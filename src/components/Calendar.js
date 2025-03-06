import {
	ExclamationCircleOutlined,
	LeftOutlined,
	PlusOutlined,
	RightOutlined,
} from "@ant-design/icons";
import { Button, Calendar, Checkbox, Input, List, Modal, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const CustomCalendar = () => {
	// Context and state management
	const { darkMode } = useContext(ThemeContext); // Get darkMode value from ThemeContext
	const [currentDate, setCurrentDate] = useState(dayjs()); // Manage the current date state
	const [selectedDate, setSelectedDate] = useState(dayjs()); // Manage the selected date state
	const [todos, setTodos] = useState({}); // Store todos by date
	const [todoInput, setTodoInput] = useState(""); // Manage the todo input field state
	const [calendarMode, setCalendarMode] = useState("month"); // Manage the calendar mode state
	const [imageList, setImageList] = useState({}); // Store image lists for each todo
	const [isModalVisible, setIsModalVisible] = useState(false); // Manage modal visibility
	const [todoToDelete, setTodoToDelete] = useState(null); // Store the ID of the todo to delete
	const [isWarningModalVisible, setIsWarningModalVisible] = useState(false); // Manage warning modal visibility
	const canHandleKeyDown = useRef(false); // Ref to track if keyboard events should be handled

	// Fetch todos for current month when the date changes
	useEffect(() => {
		fetchTodosForCurrentMonth();
	}, [currentDate]);

	// Fetch todos for the selected date when it changes
	useEffect(() => {
		fetchTodosForSelectedDate();
	}, [selectedDate]);

	// Reset the key handler flag when warning modal visibility changes
	useEffect(() => {
		if (isWarningModalVisible) {
			// Disable key handling initially when modal opens
			canHandleKeyDown.current = false;

			// After a short delay, enable key handling
			const timer = setTimeout(() => {
				canHandleKeyDown.current = true;
			}, 500); // 500ms delay

			return () => clearTimeout(timer);
		}
	}, [isWarningModalVisible]);

	// Close warning modal on Enter or Escape key press
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (
				(e.key === "Enter" || e.key === "Escape") &&
				canHandleKeyDown.current
			) {
				closeModal();
				e.preventDefault(); // Prevent default action
				e.stopPropagation(); // Stop event propagation
			}
		};

		if (isWarningModalVisible) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isWarningModalVisible]);

	// Handle "Yes" button action in delete confirmation modal on Enter key press
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Enter") {
				handleOk();
				e.preventDefault(); // Prevent default action
				e.stopPropagation(); // Stop event propagation
			}
		};

		if (isModalVisible) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isModalVisible]);

	// Fetch todos for the current month
	const fetchTodosForCurrentMonth = async () => {
		const startOfMonth = currentDate.startOf("month").format("YYYY-MM-DD");
		const endOfMonth = currentDate.endOf("month").format("YYYY-MM-DD");
		try {
			const response = await axios.get(
				`http://localhost:8080/api/todos?start=${startOfMonth}&end=${endOfMonth}`,
			);
			// Group todos by date
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

	// Close the warning modal
	const closeModal = () => {
		setIsWarningModalVisible(false);
	};

	// Fetch todos for the selected date
	const fetchTodosForSelectedDate = async () => {
		const dateKey = selectedDate.format("YYYY-MM-DD");
		try {
			const response = await axios.get(
				`http://localhost:8080/api/todos/${dateKey}`,
			);
			setTodos((prevTodos) => ({
				...prevTodos,
				[dateKey]: response.data,
			}));
		} catch (error) {
			console.error("Failed to fetch todos:", error);
		}
	};

	// Add a new todo item
	const addTodo = async () => {
		if (todoInput.trim()) {
			const dateKey = selectedDate.format("YYYY-MM-DD");
			const newTodo = {
				title: todoInput,
				description: "",
				date: dateKey,
				priority: 0,
				importance: "low",
			}; // Add priority and importance fields
			try {
				const response = await axios.post(
					"http://localhost:8080/api/todos",
					newTodo,
				);
				// Update the todos state with the new todo
				setTodos((prevTodos) => ({
					...prevTodos,
					[dateKey]: [...(prevTodos[dateKey] || []), response.data],
				}));
				setTodoInput(""); // Reset the input field
				setImageList({}); // Reset the image list
			} catch (error) {
				console.error("Failed to add todo:", error);
			}
		} else {
			setIsWarningModalVisible(true); // Show warning modal if input is empty
		}
	};

	// Custom handler for input Enter key press
	const handleInputEnter = (e) => {
		if (!todoInput.trim()) {
			// If input is empty, prevent default behavior
			e.preventDefault();
			addTodo();
		}
	};

	// Delete a todo item
	const deleteTodo = async (id) => {
		try {
			await axios.delete(`http://localhost:8080/api/todos/${id}`);
			fetchTodosForSelectedDate(); // Refresh todos after deletion
		} catch (error) {
			console.error("Failed to delete todo:", error);
		}
	};

	// Show the delete confirmation modal
	const showDeleteConfirm = (id) => {
		setTodoToDelete(id);
		setIsModalVisible(true);
	};

	// Handle OK button in delete confirmation modal
	const handleOk = () => {
		if (todoToDelete) {
			deleteTodo(todoToDelete);
		}
		setIsModalVisible(false);
	};

	// Handle Cancel button in delete confirmation modal
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// Toggle the completed status of a todo
	const toggleTodoCompleted = async (id) => {
		try {
			const response = await axios.patch(
				`http://localhost:8080/api/todos/${id}/toggle`,
			);
			const updatedTodo = response.data;
			const dateKey = dayjs(updatedTodo.date).format("YYYY-MM-DD");
			// Update the todo in the state
			setTodos((prevTodos) => ({
				...prevTodos,
				[dateKey]: prevTodos[dateKey].map((todo) =>
					todo.id === updatedTodo.id ? updatedTodo : todo,
				),
			}));
		} catch (error) {
			console.error("Failed to toggle todo completed status:", error);
		}
	};

	// Get color based on todo importance
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

	// Change the priority of a todo
	const changeTodoPriority = async (id) => {
		try {
			const selectedDateKey = selectedDate.format("YYYY-MM-DD");
			const todosForDate = todos[selectedDateKey] || []; // Prevent undefined
			const todoIndex = todosForDate.findIndex((todo) => todo.id === id);

			if (todoIndex === -1) {
				console.error("Todo not found for ID:", id);
				return;
			}

			// Change importance (circulating low -> middle -> high -> low)
			const importanceCycle = ["low", "middle", "high"];
			const currentImportance = todosForDate[todoIndex].importance;
			const newImportance =
				importanceCycle[(importanceCycle.indexOf(currentImportance) + 1) % 3];

			await axios.patch(
				`http://localhost:8080/api/todos/${id}/changeimportance`,
				null,
				{
					params: { importance: newImportance },
				},
			);

			// Update UI state
			const updatedTodos = [...todosForDate];
			updatedTodos[todoIndex] = {
				...updatedTodos[todoIndex],
				importance: newImportance,
			};

			setTodos((prevTodos) => ({
				...prevTodos,
				[selectedDateKey]: updatedTodos,
			}));
		} catch (error) {
			console.error("Failed to change todo priority:", error);
		}
	};

	// Handle date selection in the calendar
	const onSelect = (date) => {
		setSelectedDate(date);
		fetchTodosForSelectedDate();
	};

	// Handle panel change in the calendar
	const onPanelChange = (value, mode) => {
		setCurrentDate(value); // Update the date state when the panel changes
		setCalendarMode(mode); // Update the mode state when the panel changes
	};

	// Go to today's date
	const goToToday = () => {
		const today = dayjs();
		setCurrentDate(today); // Move to today's date
		setSelectedDate(today); // Set the selected date to today
		setCalendarMode("month"); // Set the calendar mode to month
	};

	// Get todos for the selected date
	const getTodosForSelectedDate = () => {
		const dateKey = selectedDate.format("YYYY-MM-DD");
		return todos[dateKey] || [];
	};

	// Render date cell with dot indicator for todos
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

	// Navigate to the previous month
	const goToPreviousMonth = () => {
		const prevMonth = currentDate.subtract(1, "month");
		setCurrentDate(prevMonth); // Update the current date to the previous month
		setSelectedDate(prevMonth); // Set the selected date to the same month
	};

	// Navigate to the next month
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
			{/* Main container */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: 600,
					position: "relative",
					background: darkMode ? "#1f1f1f" : "#fff", // Dark mode background for the inner container
				}}
			>
				{/* Calendar header with navigation buttons */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginBottom: "20px",
					}}
				>
					{/* Previous month button */}
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
					{/* Calendar component */}
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
					{/* Next month button */}
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

				{/* Go to today button */}
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

				{/* Todo list section */}
				<div
					style={{
						marginTop: "20px",
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{/* Selected date display */}
					<h3>{selectedDate.format("YYYY-MM-DD")} Todos</h3>

					{/* Todo list */}
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
									// Delete button
									<Button
										type="link"
										onClick={() => showDeleteConfirm(item.id)}
									>
										Delete
									</Button>,
									// Priority button
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
								{/* Todo item with checkbox */}
								<Checkbox
									checked={item.completed}
									onChange={() => toggleTodoCompleted(item.id)}
								>
									{item.title}
								</Checkbox>
								{/* Optional image for todo */}
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

					{/* Add todo input and button */}
					<div
						style={{
							display: "flex",
							flexDirection: "row", // Change to row to align items horizontally
							alignItems: "center",
							justifyContent: "center", // Center the items horizontally
						}}
					>
						{/* Todo input field */}
						<Input
							placeholder="Enter Todo"
							value={todoInput}
							onChange={(e) => setTodoInput(e.target.value)}
							onPressEnter={addTodo} // Add on Enter key press
							maxLength={256}
							style={{
								marginBottom: 10,
								width: "300px",
								background: darkMode ? "#333" : "#fff", // Input background color
								color: darkMode ? "#fff" : "#000", // Input text color
							}}
						/>
						{/* Add todo button */}
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

			{/* Warning Modal - shown when trying to add an empty todo */}
			<Modal
				title="Warning"
				visible={isWarningModalVisible}
				onOk={closeModal} // Close modal when OK button is clicked
				okText="OK"
				centered // Center the modal on the screen
				keyboard // Allow closing with the keyboard (Esc)
				closable={false} // Remove the close (X) button
			>
				<p>Please enter a todo item.</p>
			</Modal>

			{/* Confirmation Modal - shown when deleting a todo */}
			<Modal
				title="Are you sure you want to delete this todo?"
				visible={isModalVisible}
				onOk={handleOk} // Trigger "Yes" button action
				onCancel={handleCancel} // Trigger cancel button action
				okText="Yes"
				okType="primary" // Change the button type to primary
				cancelText="No"
				centered // Center the modal on the screen
				keyboard // Allow closing with the keyboard (Esc)
			>
				<p>This action cannot be undone.</p>
			</Modal>
		</div>
	);
};

export default CustomCalendar;
