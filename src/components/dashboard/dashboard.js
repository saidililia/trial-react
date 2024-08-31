import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Button, Col, Layout, Row, Statistic, Collapse, Select, Dropdown, Menu } from 'antd';
import CountUp from 'react-countup';
import { renderToString } from 'react-dom/server';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, DownloadOutlined, PayCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image} from '@react-pdf/renderer';
import { Avatar, Card } from 'antd';
import { Svg } from '@react-pdf/renderer';
import Lottie from 'lottie-react';
import animation from './DZFlag.json'
const { Meta } = Card;
const { Header, Content } = Layout;
const { Panel } = Collapse;
const { Option } = Select;


const formatter = (value) => <CountUp end={value} separator="," />;

function Dashboard() {
    const navigate = useNavigate();
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [montant, setMontant] = useState(null);
    const [duree, setDuree] = useState(null);
    const [Users, setUsers] = useState(0);
    const [averageScore, setAverageScore] = useState(0.00);
    const [selectedVariable, setSelectedVariable] = useState('avgScore');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [monthlyData, setMonthlyData] = useState({});
    
    const styles = StyleSheet.create({
        page: {
          padding: 30,
          fontSize: 12,
        },
        section: {
          marginBottom: 20,
        },
        title: {
          fontSize: 18,
          marginBottom: 10,
          textAlign: 'center',
        },
        chartContainer: {
          height: 400,
          marginBottom: 20,
        },
        table: {
          display: 'table',
          width: 'auto',
          margin: '10px 0',
        },
        tableRow: {
          flexDirection: 'row',
        },
        tableCol: {
          width: '50%',
          padding: 5,
        },
        tableCell: {
          margin: 'auto',
          marginTop: 5,
        },
      });
      
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
            setAdmin(responseData.admin);
            setDuree(responseData.duree);
            setMontant(responseData.montant);
            setStartDate(responseData.startDate);
            setEndDate(responseData.endDate);
            console.log("total: ", responseData.totalUsers);
            setUsers(responseData.totalUsers);
            setAverageScore(responseData.averageScore);
            console.log("average: ", responseData.averageScore);
            setMonthlyData(responseData.monthlyData);
            console.log("monthly data structure: ", responseData.monthlyData);
          } else {
            navigate('/Error');
            console.error('Failed to fetch dashboard');
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      };

    const handleTogglePaymentInfo = () => {
        setShowPaymentInfo(!showPaymentInfo);
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
        <Layout className="layout">
        {
            loading ? (
                <div className="circus">
                        <CircularProgress />
                </div>
            ) : (
                <div className="content">
                <Header className="header">
                
                <div className="action-buttons" style={{float:"right"}}>
                    <PDFDownloadLink document={<PdfDocument 
                        monthlyData={monthlyData}
                        selectedYear={selectedYear}
                        admin={admin}
                        Users={Users}
                        averageScore={averageScore}
                        startDate={startDate}
                        endDate={endDate}
                        montant={montant}
                        duree={duree}
                        styles={styles}
                    />} fileName="dashboard.pdf" style={{ textDecoration: 'none' }}>
                        <Button type="primary" shape="default" icon={<DownloadOutlined />} size="large" style={{ backgroundColor: "rgb(66, 108, 70)", marginRight:"5px" }}>Download</Button>
                    </PDFDownloadLink>

                    <Button type="default" shape="default" icon={<PayCircleOutlined />} size="large" style={{ backgroundColor: "white", marginTop:"10px" }} onClick={handleTogglePaymentInfo}>Payment</Button>
                </div>
            </Header>
            <Content className="content">
                <div className="site-layout-content">
                    {showPaymentInfo && (
                        <Row gutter={[16, 16]} justify="center" align="top" style={{marginBottom:"20px"}}>
                            <Col span={24}>
                                <Collapse defaultActiveKey={['1']}>
                                    <Panel header="Payment Information" key="1">
                                        <p>Here are your Payment Information: you paid <strong>{montant}DA</strong> on <strong>{startDate}</strong>, for <strong>{duree} month</strong></p>
                                        <p>Your subscription ends on <strong>{endDate}</strong></p>
                                        <Button type="default" onClick={handleTogglePaymentInfo}>Collapse</Button>
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    )}
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                            <Row gutter={[26, 16]} justify="start" align="top" style={{ marginBottom: "40px" }}>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                        <Meta
                                            avatar={<TeamOutlined style={{fontSize:"25px"}}/>}
                                            title="active users"
                                        />
                                        <Statistic value={Users} formatter={formatter} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                    <Meta
                                            avatar={<ScoreboardOutlinedIcon />}
                                            title="average score"
                                        />
                                        <Statistic value={averageScore} precision={2} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                    <Meta
                                            avatar={<DeleteOutlined style={{fontSize:"22px"}}/>}
                                            title="total waste in kg"
                                        />
                                        <Statistic value={0} precision={2} />
                                    </Card>
                                </Col>
                            </Row>
                           
                            <div>
                            <Row justify="end" style={{ marginBottom: "20px" }}>
                                    <Select defaultValue="avgScore" style={{ width: 150 }} onChange={handleVariableChange}>
                                        <Option value="avgScore">Average Score</Option>
                                        <Option value="users">Number of Users</Option>
                                    </Select>
                    
                                    <Select defaultValue="2023" style={{ width: 100 }} onChange={handleYearChange}>
                                        <Option value="2023">2024</Option>
                                        <Option value="2024">2025</Option>
                                    </Select>
                            </Row>
                            <Row justify="start">
                                <Col span={24}>
                                <div className="chart" style={{ width: "100%" }}>
                                   <h3>{selectedVariable === 'avgScore' ? 'Average Score' : 'Number of Users'} in {selectedYear}</h3>
                                   <LineChart width={720} height={370} data={getDataForYears()}>
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
                            
                        </div>
                        <div style={{ width: '290px' }}>
                            <Card style={{ height: '100%', width: '290px' }}>
                            <h2 >{admin.wilaya}, {admin.commune}</h2>
                            <div style={{ width: 250, height: 150 }}>
                               <Lottie animationData={animation} loop={true} />
                            </div>
                            <p><strong>Total Population:</strong> <span style={{color:"green"}}> {admin.population} habitants</span></p>
                            <p><strong>Geographical Location:</strong> <span style={{color:"green"}}>{admin.geography}</span></p>
                            <p><strong>Population Density:</strong> <span style={{color:"green"}}>{admin.density}/square Km</span></p>
                            <p><strong>Municipal Code:</strong> <span style={{color:"green"}}>{admin.code}</span></p>
                            <p><strong>Key Infrastructure:</strong> <span style={{color:"green"}}>unknown</span></p>
                            <p><strong>Literacy Rate:</strong> <span style={{color:"green"}}>unknown</span></p>
                            <p><strong>Crime Rate:</strong> <span style={{color:"green"}}>unknwon</span></p>
                            </Card>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
            )
        }
        </Layout>
    );
}
const renderChart = (data) => {
    const chartSvg = renderToString(
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avgScore" stroke="#8884d8" />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" />
      </LineChart>
    );
    return chartSvg;
};

const PdfDocument = ({ monthlyData, selectedYear, admin, Users, averageScore, startDate, endDate, montant, duree, styles }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Dashboard Report - {selectedYear}</Text>
        
        <View style={styles.section}>
          <Text>Admin Information</Text>
          <Text>Location: {admin.wilaya}, {admin.commune}</Text>
          <Text>Population: {admin.population}</Text>
          <Text>Geography: {admin.geography}</Text>
          <Text>Density: {admin.density} per square Km</Text>
          <Text>Municipal Code: {admin.code}</Text>
        </View>
        
        <View style={styles.section}>
          <Text>Subscription Information</Text>
          <Text>Paid Amount: {montant} DA</Text>
          <Text>Subscription Start Date: {startDate}</Text>
          <Text>Subscription End Date: {endDate}</Text>
          <Text>Subscription Duration: {duree} months</Text>
        </View>
        
        <View style={styles.section}>
          <Text>Key Statistics</Text>
          <Text>Total Active Users: {Users}</Text>
          <Text>Average Score: {averageScore.toFixed(2)}</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <Svg>
            {/* <Svg
              width="500"
              height="300"
              dangerouslySetInnerHTML={{ __html: renderChart(monthlyData[selectedYear]) }}
            /> */}
          </Svg>
        </View>
      </Page>
    </Document>
  );
       
            


export default Dashboard;
