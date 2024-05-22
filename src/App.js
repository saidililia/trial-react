import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Dashboard from './components/dashboard/dashboard';
import Schedule from './components/schedule/schedule';
import Requests from './components/requests/requests';
import Login from './components/login/login';
import Clients from "./components/clients/clients";
import Payment from "./components/payment/payment";
import { CloudOutlined } from '@ant-design/icons';
import './App.css'
import Auth from './components/auth';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  return (
    <BrowserRouter>
      <AppContent/>
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
              <img src="icon2.png" style={{ width: '130px', height: '130px' }} alt="Logo"/>
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
                <Link to="/Dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2" style={selectedMenuItem === '2' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Schedule">Schedule</Link>
              </Menu.Item>
              <Menu.Item key="3" style={selectedMenuItem === '3' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Clients">Clients</Link>
              </Menu.Item>
              <Menu.Item key="4" style={selectedMenuItem === '4' ? { backgroundColor: 'rgb(66, 108, 70)', color: 'white' } : null}>
                <Link to="/Requests">Requests</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "white", height: "120px" }}>
              <h1 style={{marginTop:"30px", marginLeft:"20px", color: 'rgb(44, 44, 70)'}}>{pageTitle}</h1>
            </Header>
            <Content style={{ margin: '0 16px', overflowY: 'auto' }}>
              <Routes>
                <Route path='/Dashboard' element={<Dashboard />} />
                <Route path='/Schedule' element={<Schedule />} />
                <Route path='/Clients' element={<Clients />} />
                <Route path='/Requests' element={<Requests />} />
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
          <Route path='/Error' element={<Auth />}/>
        </Routes>
      )}
    </>
  );
}

export default App;
