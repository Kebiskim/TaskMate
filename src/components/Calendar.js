import React, { useState, useContext } from "react";
import { Calendar, Button, Input, List, Upload, message } from "antd";
import dayjs from "dayjs";
import { PlusOutlined, LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const CustomCalendar = () => {
  const { darkMode } = useContext(ThemeContext); // Get darkMode value from ThemeContext
  const [currentDate, setCurrentDate] = useState(dayjs()); // 현재 날짜 상태 관리
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 선택된 날짜 상태 관리
  const [todos, setTodos] = useState({}); // 날짜별 todo 목록을 저장
  const [todoInput, setTodoInput] = useState(""); // Todo 입력 필드 상태 관리
  const [calendarMode, setCalendarMode] = useState("month"); // Calendar의 mode 상태 관리
  const [imageList, setImageList] = useState({}); // 각 Todo에 대한 이미지 목록 저장

  // 날짜 선택 시 호출되는 함수
  const onSelect = (date) => {
    setSelectedDate(date);
  };

  // 패널이 변경될 때 (월/년 탭 이동)
  const onPanelChange = (value, mode) => {
    setCurrentDate(value); // 패널 변경 시 날짜 상태 업데이트
    setCalendarMode(mode); // 패널 변경 시 모드 상태 업데이트
  };

  // 오늘 날짜로 이동
  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today); // 오늘 날짜로 이동
    setSelectedDate(today); // 선택된 날짜도 오늘로 설정
    setCalendarMode("month"); // 월 탭으로 이동하도록 설정
  };

  // 날짜에 해당하는 Todo 목록 추가
  const addTodo = () => {
    if (todoInput.trim()) {
      const newTodos = { ...todos };
      const dateKey = selectedDate.format("YYYY-MM-DD");
      if (newTodos[dateKey]) {
        newTodos[dateKey].push({ text: todoInput, image: imageList[dateKey] || null });
      } else {
        newTodos[dateKey] = [{ text: todoInput, image: imageList[dateKey] || null }];
      }
      setTodos(newTodos);
      setTodoInput(""); // 입력 필드 초기화
      setImageList({}); // 이미지 목록 초기화
    }
  };

  // 선택된 날짜에 해당하는 Todo 목록 가져오기
  const getTodosForSelectedDate = () => {
    const dateKey = selectedDate.format("YYYY-MM-DD");
    return todos[dateKey] || [];
  };

  // 날짜 셀 렌더링 시 호출되어, Todo가 있는 날짜에 동그란 점 추가
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

  // Move to the previous month
  const goToPreviousMonth = () => {
    const prevMonth = currentDate.subtract(1, "month");
    setCurrentDate(prevMonth); // Update the current date to the previous month
    setSelectedDate(prevMonth); // Set the selected date to the same month
  };

  // Move to the next month
  const goToNextMonth = () => {
    const nextMonth = currentDate.add(1, "month");
    setCurrentDate(nextMonth); // Update the current date to the next month
    setSelectedDate(nextMonth); // Set the selected date to the same month
  };

  // Handle image upload
  const handleImageChange = (date, info) => {
    if (info.file.status === "done") {
      const newImageList = { ...imageList };
      newImageList[date] = info.file.response.url; // Assuming the server returns the image URL
      setImageList(newImageList);
    } else if (info.file.status === "error") {
      message.error("Image upload failed.");
    }
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
        {/* Flex container for buttons and calendar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Left and Right navigation buttons */}
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
            value={selectedDate} // Calendar에 선택된 날짜를 표시
            onPanelChange={onPanelChange} // 패널 변경 시 호출되는 함수
            style={{ marginBottom: "20px", flexGrow: 1 }} // Make Calendar fill the space
            mode={calendarMode} // Calendar의 mode를 설정
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
          size="small" // 버튼 크기를 작게
        >
          Go to Today
        </Button>

        {/* Todo List Section */}
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
              >
                <div>
                  <p>{item.text}</p>
                  {item.image && (
                    <img
                      src={item.image}
                      alt="todo"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </List.Item>
            )}
            style={{ width: "100%", marginBottom: "20px" }}
          />

          {/* Todo Input Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Input
              placeholder="Enter Todo"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onPressEnter={addTodo} // Enter 키로 추가
              style={{
                marginBottom: 10,
                width: "300px",
                background: darkMode ? "#333" : "#fff", // Input background color
                color: darkMode ? "#fff" : "#000", // Input text color
              }}
            />
            <Upload
              name="image"
              showUploadList={false}
              action="/upload"
              onChange={(info) => handleImageChange(selectedDate.format("YYYY-MM-DD"), info)}
            >
              <Button icon={<UploadOutlined />} size="small">
                Upload Image
              </Button>
            </Upload>
            <Button
              onClick={addTodo}
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginTop: "10px" }}
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
