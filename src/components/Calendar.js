import React, { useState, useContext, useEffect } from "react";
import { Calendar, Button, Input, List, Upload, message, Checkbox } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { PlusOutlined, LeftOutlined, RightOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const CustomCalendar = () => {
  const { darkMode } = useContext(ThemeContext); // Get darkMode value from ThemeContext
  const [currentDate, setCurrentDate] = useState(dayjs()); // Manage the current date state
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Manage the selected date state
  const [todos, setTodos] = useState({}); // Store todos by date
  const [todoInput, setTodoInput] = useState(""); // Manage the todo input field state
  const [calendarMode, setCalendarMode] = useState("month"); // Manage the calendar mode state
  const [imageList, setImageList] = useState({}); // Store image lists for each todo

  useEffect(() => {
    fetchTodosForCurrentMonth();
  }, [currentDate]);

  useEffect(() => {
    fetchTodosForSelectedDate();
  }, [selectedDate]);

  const fetchTodosForCurrentMonth = async () => {
    const startOfMonth = currentDate.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = currentDate.endOf("month").format("YYYY-MM-DD");
    try {
      const response = await axios.get(`http://localhost:8080/api/todos?start=${startOfMonth}&end=${endOfMonth}`);
      const todosByDate = response.data.reduce((acc, todo) => {
        const dateKey = dayjs(todo.date).format("YYYY-MM-DD");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(todo);
        return acc;
      }, {});
      setTodos(todosByDate);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const fetchTodosForSelectedDate = async () => {
    const dateKey = selectedDate.format("YYYY-MM-DD");
    try {
      const response = await axios.get(`http://localhost:8080/api/todos/${dateKey}`);
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateKey]: response.data,
      }));
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async () => {
    if (todoInput.trim()) {
      const dateKey = selectedDate.format("YYYY-MM-DD");
      const newTodo = { title: todoInput, description: "", date: dateKey, priority: 0, importance: "low" }; // Add priority and importance fields
      try {
        const response = await axios.post("http://localhost:8080/api/todos", newTodo);
        setTodos((prevTodos) => ({
          ...prevTodos,
          [dateKey]: [...(prevTodos[dateKey] || []), response.data],
        }));
        setTodoInput(""); // Reset the input field
        setImageList({}); // Reset the image list
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      fetchTodosForSelectedDate();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const toggleTodoCompleted = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/todos/${id}/toggle`);
      const updatedTodo = response.data;
      const dateKey = dayjs(updatedTodo.date).format("YYYY-MM-DD");
      setTodos((prevTodos) => ({
        ...prevTodos,
        [dateKey]: prevTodos[dateKey].map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle todo completed status:", error);
    }
  };

  const getPriorityColor = (importance) => {
    switch (importance) {
      case "low":
        return "#d9d9d9"; // Gray for low priority
      case "middle":
        return "#faad14"; // Yellow for medium priority
      case "high":
        return "#f5222d"; // Red for high priority
      default:
        return "#d9d9d9";
    }
  };
  
  const changeTodoPriority = async (id) => {
    try {
      const selectedDateKey = selectedDate.format("YYYY-MM-DD");
      const todosForDate = todos[selectedDateKey] || []; // undefined 방지
      const todoIndex = todosForDate.findIndex((todo) => todo.id === id);
  
      if (todoIndex === -1) {
        console.error("Todo not found for ID:", id);
        return;
      }
  
      // change importance (circulating low -> middle -> high -> low)
      const importanceCycle = ["low", "middle", "high"];
      const currentImportance = todosForDate[todoIndex].importance;
      const newImportance = importanceCycle[(importanceCycle.indexOf(currentImportance) + 1) % 3];
  
      await axios.patch(`http://localhost:8080/api/todos/${id}/changeimportance`, null, {
        params: { importance: newImportance }
      });
  
      // update a state (UI)
      const updatedTodos = [...todosForDate];
      updatedTodos[todoIndex] = { ...updatedTodos[todoIndex], importance: newImportance };
  
      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDateKey]: updatedTodos
      }));
  
    } catch (error) {
      console.error("Failed to change todo priority:", error);
    }
  };
  
  const onSelect = (date) => {
    setSelectedDate(date);
    fetchTodosForSelectedDate();
  };

  const onPanelChange = (value, mode) => {
    setCurrentDate(value); // Update the date state when the panel changes
    setCalendarMode(mode); // Update the mode state when the panel changes
  };

  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today); // Move to today's date
    setSelectedDate(today); // Set the selected date to today
    setCalendarMode("month"); // Set the calendar mode to month
  };

  const getTodosForSelectedDate = () => {
    const dateKey = selectedDate.format("YYYY-MM-DD");
    return todos[dateKey] || [];
  };

  const dateCellRender = (date) => {
    const dateKey = date.format("YYYY-MM-DD");
    const hasTodos = todos[dateKey] && todos[dateKey].length > 0;

    return hasTodos ? (
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "-2.1rem", // Dot position above the date
            left: "50%",
            transform: "translateX(-50%)", // Center the dot above the date
            width: "8px",
            height: "8px",
            backgroundColor: "#52c41a", // Green dot color
            borderRadius: "50%",
          }}
        />
      </div>
    ) : null;
  };

  const goToPreviousMonth = () => {
    const prevMonth = currentDate.subtract(1, "month");
    setCurrentDate(prevMonth); // Update the current date to the previous month
    setSelectedDate(prevMonth); // Set the selected date to the same month
  };

  const goToNextMonth = () => {
    const nextMonth = currentDate.add(1, "month");
    setCurrentDate(nextMonth); // Update the current date to the next month
    setSelectedDate(nextMonth); // Set the selected date to the same month
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        background: darkMode ? "#121212" : "#fff", // Dark mode background
        color: darkMode ? "#fff" : "#000", // Text color for dark mode
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 600,
          position: "relative",
          background: darkMode ? "#1f1f1f" : "#fff", // Dark mode background for the inner container
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            icon={<LeftOutlined />}
            onClick={goToPreviousMonth}
            size="small"
            style={{
              position: "absolute", // Positioning the buttons absolutely
              left: "-30px", // Left button positioned to the left of the calendar
              zIndex: 1,
            }}
          />
          <Calendar
            fullscreen={false}
            onSelect={onSelect}
            value={selectedDate} // Display the selected date in the calendar
            onPanelChange={onPanelChange} // Function called when the panel changes
            style={{ marginBottom: "20px", flexGrow: 1 }} // Make Calendar fill the space
            mode={calendarMode} // Set the mode of the Calendar
            dateCellRender={dateCellRender} // Custom date cell render for dots
            className={darkMode ? "dark-calendar" : ""} // Optionally add dark mode class
          />
          <Button
            icon={<RightOutlined />}
            onClick={goToNextMonth}
            size="small"
            style={{
              position: "absolute", // Positioning the buttons absolutely
              right: "-30px", // Right button positioned to the right of the calendar
              zIndex: 1,
            }}
          />
        </div>

        <Button
          onClick={goToToday}
          style={{
            alignSelf: "flex-end",
            marginBottom: "20px",
            backgroundColor: darkMode ? "#333" : "#fff", // Button color in dark mode
            color: darkMode ? "#fff" : "#000", // Button text color
          }}
          size="small" // Make the button small
        >
          Go to Today
        </Button>

        <div
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>{selectedDate.format("YYYY-MM-DD")} Todos</h3>

          <List
            bordered
            dataSource={getTodosForSelectedDate()}
            renderItem={(item) => (
              <List.Item
                style={{
                  background: darkMode ? "#333" : "#fff", // List item background color
                  color: darkMode ? "#fff" : "#000", // List item text color
                }}
                actions={[
                  <Button type="link" onClick={() => deleteTodo(item.id)}>
                    Delete
                  </Button>,
                  <Button
                    type="link"
                    icon={<ExclamationCircleOutlined />}
                    onClick={() => changeTodoPriority(item.id)}
                    style={{ color: getPriorityColor(item.importance) }}
                  >
                    Priority
                  </Button>,
                ]}
              >
                <Checkbox
                  checked={item.completed}
                  onChange={() => toggleTodoCompleted(item.id)}
                >
                  {item.title}
                </Checkbox>
                {item.image && (
                  <img
                    src={item.image}
                    alt="todo"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </List.Item>
            )}
            style={{ width: "100%", marginBottom: "20px" }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row", // Change to row to align items horizontally
              alignItems: "center",
              justifyContent: "center", // Center the items horizontally
            }}
          >
            <Input
              placeholder="Enter Todo"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onPressEnter={addTodo} // Add on Enter key press
              style={{
                marginBottom: 10,
                width: "300px",
                background: darkMode ? "#333" : "#fff", // Input background color
                color: darkMode ? "#fff" : "#000", // Input text color
              }}
            />
            <Button
              onClick={addTodo}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginLeft: "10px", marginBottom: "10px" }} // Add margin to the left and bottom
            >
              Add Todo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;