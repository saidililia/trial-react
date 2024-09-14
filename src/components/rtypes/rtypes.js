import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Row, Col, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Option } = Select;

function Rtypes() {
  const [loading, setLoading] = useState(true);
  const [selectedVariable, setSelectedVariable] = useState('Demande');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchDash(token);
  }, []);

  const fetchDash = async (token) => {
    const headers = {
      'Authorization': `${token}`
    };
    try {
      const response = await fetch('https://saidililia.pythonanywhere.com/Stats', { headers });
      const responseData = await response.json();
      if (responseData.message === 'success') {
        console.log('monthly types data:', responseData.monthlyData);
        setMonthlyData(responseData.monthlyData);
      } else {
        // Handle error
        console.error('Error fetching data:', responseData.message);
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
                Demande: monthlyData[selectedYear][month]['requestCounts']['Demande de vidage'],
                Retard: monthlyData[selectedYear][month]['requestCounts']['Retard du collecte'],
                Mauvaise: monthlyData[selectedYear][month]['requestCounts']['Mauvaise collecte'],
                Decharge: monthlyData[selectedYear][month]['requestCounts']['Decharge a proximite'],
                Autres: monthlyData[selectedYear][month]['requestCounts']['Autres']
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
            <Select defaultValue="Demande de vidage" style={{ width: 200 }} onChange={handleVariableChange}>
              <Option value="Demande">Demande de vidage</Option>
              <Option value="Retard">Retard du collecte</Option>
              <Option value="Mauvaise">Mauvaise collecte</Option>
              <Option value="Decharge">Decharge a proximite</Option>
              <Option value="Autres">Autres</Option>
            </Select>

            <Select defaultValue="2024" style={{ width: 100 }} onChange={handleYearChange}>
              <Option value="2024">2024</Option>
            </Select>
          </Row>
          <Row justify="start">
            <Col span={24}>
              <div className="chart" style={{ width: "100%" }}>
                <h3>{selectedVariable} in {selectedYear}</h3>
                <ResponsiveContainer width="100%" height={370}>
                  <BarChart data={getDataForYears()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={selectedVariable} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default Rtypes;
