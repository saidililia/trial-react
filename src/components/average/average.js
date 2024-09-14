import React, { useState, useEffect } from "react";

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Col, Layout, Row, Statistic, Collapse, Select, Dropdown, Menu } from 'antd';
const { Option } = Select;

function Average() {
  const [loading, setLoading] = useState(true);
  const [selectedVariable, setSelectedVariable] = useState('avgScore');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [monthlyData, setMonthlyData] = useState({});
  const [Users, setUsers] = useState(0);
  const [averageScore, setAverageScore] = useState(0.00);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchDash(token);
    console.log("in dashboard use effects............");
  }, []);

  const fetchDash = async (token) => {
    console.log("here is the dashboard token.......", token);
    const headers = {
        'Authorization': `${token}`
    };
    try {
      const response = await fetch('https://saidililia.pythonanywhere.com/Dashboard', {headers});
      const responseData = await response.json();
      if (responseData.message === 'success') {
        console.log(`fetched data with value: ${responseData.endDate} ${responseData.montant} ${responseData.message}`);
        console.log("total: ", responseData.totalUsers);
        setUsers(responseData.totalUsers);
        setAverageScore(responseData.averageScore);
        console.log("average: ", responseData.averageScore);
        setMonthlyData(responseData.monthlyData);
        console.log("monthly data structure: ", responseData.monthlyData);
      } else {
        // navigate('/Error');
        // console.error('Failed to fetch dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariableChange = (value) => {
    setSelectedVariable(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const getDataForYears = () => {
    const yearData = [];
    if (monthlyData && monthlyData[selectedYear]) {
        for (let month in monthlyData[selectedYear]) {
            yearData.push({
                name: month,
                avgScore: monthlyData[selectedYear][month].avgScore || 0,
                users: monthlyData[selectedYear][month].users || 0,
            });
        }
    } else {
        console.warn(`No data found for the selected year: ${selectedYear}`);
    }
    return yearData;
 };

  return (
    <div className="schedule">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Row justify="end" style={{ marginBottom: "20px" }}>
            <Select defaultValue="avgScore" style={{ width: 150 }} onChange={handleVariableChange}>
              <Option value="avgScore">Average Score</Option>
              <Option value="users">Number of Users</Option>
            </Select>

            <Select defaultValue="2023" style={{ width: 100 }} onChange={handleYearChange}>
              <Option value="2023">2024</Option>
            </Select>
          </Row>
          <Row justify="start">
            <Col span={24}>
              <div className="chart" style={{ width: "100%" }}>
                <h3>{selectedVariable === 'avgScore' ? 'Average Score' : 'Number of Users'} in {selectedYear}</h3>
                <LineChart width={1100} height={370} data={getDataForYears()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={selectedVariable} stroke="#8884d8" />
                </LineChart>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default Average;
