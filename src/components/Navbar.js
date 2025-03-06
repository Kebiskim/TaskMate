import {
	AppstoreAddOutlined,
	BulbOutlined,
	CalendarOutlined,
	HomeOutlined,
	MoonOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Switch } from "antd";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const { Header } = Layout;

const Navbar = () => {
	const location = useLocation();
	const { darkMode, setDarkMode } = useContext(ThemeContext);

	return (
		<Layout>
			<Header
				style={{
					background: darkMode ? "#000" : "#001529",
					padding: 0,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Menu
					theme={darkMode ? "dark" : "light"}
					mode="horizontal"
					selectedKeys={[location.pathname]}
					style={{ flex: 1, lineHeight: "64px" }}
				>
					<Menu.Item
						key="/"
						icon={<HomeOutlined />}
						style={{ transition: "transform 0.2s ease-in-out" }} // 부드러운 확대 효과
						onMouseOver={(e) =>
							(e.currentTarget.style.transform = "scale(1.1)")
						}
						onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
					>
						<Link to="/">Home</Link>
					</Menu.Item>
					<Menu.Item
						key="/calendar"
						icon={<CalendarOutlined />}
						style={{ transition: "transform 0.2s ease-in-out" }}
						onMouseOver={(e) =>
							(e.currentTarget.style.transform = "scale(1.1)")
						}
						onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
					>
						<Link to="/calendar">Calendar</Link>
					</Menu.Item>
				</Menu>

				<Switch
					checked={darkMode}
					onChange={() => setDarkMode(!darkMode)}
					checkedChildren={<MoonOutlined />}
					unCheckedChildren={<BulbOutlined />}
					style={{ marginRight: 20 }}
				/>
			</Header>
		</Layout>
	);
};

export default Navbar;
