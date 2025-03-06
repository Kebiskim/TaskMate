import React, { useEffect, useState, useContext } from 'react';
import { Typography, Layout, Carousel, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';  // Import the ThemeContext

const { Title } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;

const Home = () => {
  const { darkMode } = useContext(ThemeContext);  // Access darkMode from ThemeContext
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: fadeIn ? (darkMode ? '#121212' : '#f0f2f5') : '#777777',
        transition: 'background 3s ease',
      }}
    >
      <Content
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: darkMode ? '#1d1d1d' : '#fff',  // Change background for dark mode
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 3s ease',
          padding: '20px',
        }}
      >
        <Title level={1} style={{ color: darkMode ? '#fff' : '#000' }}>Welcome to TaskMate!</Title>
        <p style={{ fontSize: '16px', marginBottom: '20px', color: darkMode ? '#ddd' : '#000' }}>
          Your productivity assistant for managing tasks and events.
        </p>
        
        <Link to="/calendar">
          <img
            src="./assets/calendar.png"  // 원하는 이미지 경로로 변경 가능
            alt="Go to Calendar"
            style={{
              width: '200px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease-in-out', // Smooth animation
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')} // Zoom in effect
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Reset to original size
          />
        </Link>

        {/* Carousel */}
        <Carousel autoplay dotPosition="bottom" style={{ marginBottom: '20px', width: '80%' }}>
          <div>
            <img src="./assets/task1.jpg" alt="Task 1" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
          <div>
            <img src="./assets/task2.jpg" alt="Task 2" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
          <div>
            <img src="./assets/task3.jpg" alt="Task 3" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
        </Carousel>

        {/* Accordion for Additional Tips */}
        <Collapse defaultActiveKey={['1']} style={{ width: '60%', marginBottom: '20px' }}>
          <Panel header="How TaskMate Can Help You" key="1" style={{ background: darkMode ? '#333' : '#fff' }}>
            <p style={{ color: darkMode ? '#ddd' : '#000' }}>
              TaskMate helps you organize your tasks with ease. It’s the perfect tool for managing your work and personal life.
            </p>
          </Panel>
          <Panel header="Pro Tips" key="2" style={{ background: darkMode ? '#333' : '#fff' }}>
            <p style={{ color: darkMode ? '#ddd' : '#000' }}>
              Use the calendar view to get an overview of your tasks for the entire month.
            </p>
          </Panel>
        </Collapse>


      </Content>
    </Layout>
  );
};

export default Home;
