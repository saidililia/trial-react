import React from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { Layout, Menu, theme } from 'antd';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
import {
  BarChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const items = [
  { key: '1', icon: <UserOutlined style={{ fontSize: '20px' }} />, label: 'Dashboard', path: '/videos' },
  { key: '2', icon: <VideoCameraOutlined style={{ fontSize: '20px' }} />, label: 'Schedule', path: '/videos' },
  { key: '3', icon: <UploadOutlined style={{ fontSize: '20px' }} />, label: 'Client', path: '/upload' },
  { key: '4', icon: <BarChartOutlined style={{ fontSize: '20px' }} />, label: 'Requests', path: '/analytics' },
];

const Dash = () => {
   
    <div></div>

};

export default Dash;
