import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Dashboard from './components/dashboard/dashboard';
import Schedule from './components/schedule/schedule';
import Requests from './components/requests/requests';
import Login from './components/login/login';
import Clients from "./components/clients/clients";
import Payment from "./components/payment/payment";
import Logs from './components/logs/logs';
import Average from './components/average/average';
import Rtypes from './components/rtypes/rtypes';

import { BarsOutlined, BellOutlined, TeamOutlined, ClockCircleOutlined, HomeOutlined, FileOutlined } from '@ant-design/icons';
import './App.css';
import Auth from './components/auth';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Check if the current location is the login page or payment page
  const isLoginPage = location.pathname === '/';
  const isPaymentPage = location.pathname === '/Payment';
  const isUnauthorized = location.pathname === '/Error';

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    updatePageTitle(e.key);
  };

  const updatePageTitle = (key) => {
    switch (key) {
      case '1':
        setPageTitle('Dashboard');
        break;
      case '2':
        setPageTitle('Schedule');
        break;
      case '3':
        setPageTitle('Clients');
        break;
      case '4':
        setPageTitle('Requests');
        break;
      case '5-1':
        setPageTitle('Reports/Average-Score');
        break;
      case '5-2':
        setPageTitle('Reports/Request-Type');
        break;
      case '5-3':
        setPageTitle('Reports/Logs');
        break;
      default:
        setPageTitle('Dashboard');
    }
  };

  useEffect(() => {
    switch (location.pathname) {
      case '/Dashboard':
        setSelectedMenuItem('1');
        setPageTitle('Dashboard');
        break;
      case '/Schedule':
        setSelectedMenuItem('2');
        setPageTitle('Schedule');
        break;
      case '/Clients':
        setSelectedMenuItem('3');
        setPageTitle('Clients');
        break;
      case '/Requests':
        setSelectedMenuItem('4');
        setPageTitle('Requests');
        break;
      case '/Reports/Average-Score':
        setSelectedMenuItem('5-1');
        setPageTitle('Reports/Average-Score');
        break;
      case '/Reports/Request-Type':
        setSelectedMenuItem('5-2');
        setPageTitle('Reports/Request-Type');
        break;
      case '/Reports/Logs':
        setSelectedMenuItem('5-3');
        setPageTitle('Reports/Logs');
        break;
      default:
        setPageTitle('');
    }
  }, [location.pathname]);

  return (
    <>
      {(!isLoginPage && !isPaymentPage && !isUnauthorized) && (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width={200} className="site-layout-background" style={{ backgroundColor: "white" }}>
            <div className="logo" style={{ height: "120px", backgroundColor: "white", padding: "20px", display: "flex", alignItems: "center" }}>
              <img src="icon2.png" style={{ width: '130px', height: '130px' }} alt="Logo" />
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              selectedKeys={[selectedMenuItem]}
              onClick={handleMenuClick}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" style={selectedMenuItem === '1' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Dashboard"><BarsOutlined style={{ margin: "0px 10px" }} />Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2" style={selectedMenuItem === '2' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Schedule"><ClockCircleOutlined style={{ margin: "0px 10px" }} />Schedule</Link>
              </Menu.Item>
              <Menu.Item key="3" style={selectedMenuItem === '3' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Clients"><TeamOutlined style={{ margin: "0px 10px" }} />Clients</Link>
              </Menu.Item>
              <Menu.Item key="4" style={selectedMenuItem === '4' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Requests"><BellOutlined style={{ margin: "0px 10px" }} />Requests</Link>
              </Menu.Item>

              <SubMenu key="5" title={<span style={{color:"black"}}><FileOutlined style={{ margin: "0px 10px", color:"black" }} />Reports</span>}
              >
                <Menu.Item key="5-1" style={selectedMenuItem === '5-1' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                  <Link to="/Reports/Average-Score">Average Score</Link>
                </Menu.Item>
                <Menu.Item key="5-2" style={selectedMenuItem === '5-2' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                  <Link to="/Reports/Request-Type">Request Type</Link>
                </Menu.Item>
                <Menu.Item key="5-3" style={selectedMenuItem === '5-3' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                  <Link to="/Reports/Logs">Logs</Link>
                </Menu.Item>
              </SubMenu>

            </Menu>
          </Sider>
          <Layout>
            <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "white", height: "120px" }}>
              <h2 style={{ marginTop: "30px", marginLeft: "20px", color: 'rgb(44, 44, 70)' }}><HomeOutlined />/ {pageTitle}</h2>
            </Header>
            <Content style={{ margin: '0 16px', overflowY: 'auto' }}>
              <Routes>
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/Schedule' element={<Schedule />} />
                <Route path='/Clients' element={<Clients />} />
                <Route path='/Requests' element={<Requests />} />
                <Route path='/Reports/Average-Score' element={<Average />} />
                <Route path='/Reports/Request-Type' element={<Rtypes />} />
                <Route path='/Reports/Logs' element={<Logs />} />
              </Routes>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Your Footer Here</Footer>
          </Layout>
        </Layout>
      )}
      {(isLoginPage || isPaymentPage || isUnauthorized) && (
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Payment' element={<Payment />} />
          <Route path='/Error' element={<Auth />} />
        </Routes>
      )}
    </>
  );
}

export default App;
