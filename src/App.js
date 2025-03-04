import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Home from "./components/Home";
import Calendar from "./components/Calendar";
import Navbar from "./components/Navbar";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Navbar />
          <MainContent />
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

const MainContent = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <Layout.Content style={{ background: darkMode ? "#121212" : "#fff", padding: "20px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Layout.Content>
  );
};

export default App;
