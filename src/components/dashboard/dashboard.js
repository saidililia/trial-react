import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Button, Col, Layout, Row, Statistic, Collapse, Select, Dropdown, Menu } from 'antd';
import CountUp from 'react-countup';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { DownloadOutlined, PayCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View} from '@react-pdf/renderer';
import { Avatar, Card } from 'antd';
import Lottie from 'lottie-react';
import animation from './DZFlag.json'
const { Meta } = Card;
const { Header, Content } = Layout;
const { Panel } = Collapse;
const { Option } = Select;

// const data2023 = [
//     { name: 'Jan', avgScore: 4000, users: 2400 },
//     { name: 'Feb', avgScore: 3000, users: 1398 },
//     { name: 'Mar', avgScore: 2000, users: 9800 },
//     { name: 'Apr', avgScore: 2780, users: 3908 },
//     { name: 'May', avgScore: 1890, users: 4800 },
//     { name: 'June', avgScore: 2390, users: 3800 },
//     { name: 'July', avgScore: 3490, users: 4300 },
//     { name: 'Aug', avgScore: 3490, users: 4300 },
//     { name: 'Sep', avgScore: 4490, users: 4300 },
//     { name: 'Oct', avgScore: 3490, users: 2100 },
//     { name: 'Nov', avgScore: 2490, users: 2300 },
//     { name: 'Dec', avgScore: 3490, users: 2700 },
// ];

// const data2024 = [
//     { name: 'Jan', avgScore: 4100, users: 2500 },
//     { name: 'Feb', avgScore: 3200, users: 1450 },
//     { name: 'Mar', avgScore: 2100, users: 10000 },
//     { name: 'Apr', avgScore: 2880, users: 4000 },
//     { name: 'May', avgScore: 1990, users: 4900 },
//     { name: 'June', avgScore: 2490, users: 3900 },
//     { name: 'July', avgScore: 3590, users: 4400 },
//     { name: 'Aug', avgScore: 3590, users: 4400 },
//     { name: 'Sep', avgScore: 4590, users: 4400 },
//     { name: 'Oct', avgScore: 3590, users: 2200 },
//     { name: 'Nov', avgScore: 2590, users: 2400 },
//     { name: 'Dec', avgScore: 3590, users: 2800 },
// ];

const formatter = (value) => <CountUp end={value} separator="," />;

function Dashboard() {
    const navigate = useNavigate();
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [wilaya, setWilaya] = useState('');
    const [commune, setCommune] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [montant, setMontant] = useState(null);
    const [duree, setDuree] = useState(null);
    const [Users, setUsers] = useState(0);
    const [averageScore, setAverageScore] = useState(0.00);
    const [selectedVariable, setSelectedVariable] = useState('avgScore');
    const [selectedYear, setSelectedYear] = useState('2023');
    const [monthlyData, setMonthlyData] = useState({});
    

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
          const response = await fetch(`https://saidililia.pythonanywhere.com/Dashboard`, {headers});
          const responseData = await response.json();
          if (responseData.message === 'success') {
            console.log(`fetched data with value: ${responseData.endDate} ${responseData.montant} ${responseData.message}`);
            setCommune(responseData.commune);
            setWilaya(responseData.wilaya);
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
                    <PDFDownloadLink document={<PdfDocument />} fileName="dashboard.pdf" style={{ textDecoration: 'none' }}>
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
                                        <p>Here are your Payment Information: you paid {montant}DA on {startDate}, for {duree} month</p>
                                        <p>Your subscription ends on {endDate}</p>
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
                                            avatar={<TeamOutlined />}
                                            title="Active Users"
                                        />
                                        <Statistic value={Users} formatter={formatter} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                    <Meta
                                            avatar={<ScoreboardIcon />}
                                            title="Average Score"
                                        />
                                        <Statistic value={averageScore} precision={2} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                    <Meta
                                            avatar={<ScoreboardIcon />}
                                            title="Active Users"
                                        />
                                        <Statistic value={averageScore} precision={2} />
                                    </Card>
                                </Col>
                            </Row>
                            {/* <Row justify="start" style={{ marginBottom: "20px" }}>
                                <Col span={12}>
                                    <Select defaultValue="avgScore" style={{ width: 180 }} onChange={handleVariableChange}>
                                        <Option value="avgScore">Average Score</Option>
                                        <Option value="users">Number of Users</Option>
                                    </Select>
                                </Col>
                                <Col span={12}>
                                    <Select defaultValue="2023" style={{ width: 120 }} onChange={handleYearChange}>
                                        <Option value="2023">2023</Option>
                                        <Option value="2024">2024</Option>
                                    </Select>
                                </Col>
                            </Row> */}
                            <div>
                            <Row justify="end" style={{ marginBottom: "20px" }}>
                                    <Select defaultValue="avgScore" style={{ width: 150 }} onChange={handleVariableChange}>
                                        <Option value="avgScore">Average Score</Option>
                                        <Option value="users">Number of Users</Option>
                                    </Select>
                    
                                    <Select defaultValue="2023" style={{ width: 100 }} onChange={handleYearChange}>
                                        <Option value="2023">2023</Option>
                                        <Option value="2024">2024</Option>
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
                            <h2 >{wilaya}, {commune}</h2>
                            <div style={{ width: 250, height: 150 }}>
                               <Lottie animationData={animation} loop={true} />
                            </div>
                            <p><strong>Total Population:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Geographical Location:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Population Density:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Municipal Code:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Key Infrastructure:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Literacy Rate:</strong> <span style={{color:"green"}}>2 657 000</span></p>
                            <p><strong>Crime Rate:</strong> <span style={{color:"green"}}>2 657 000</span></p>
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

const PdfDocument = () => (
    <Document>
        <Page size="A4">
            <View >
                <Text>Monthly Data</Text>
            </View>
            <View >
                <Text>Bar Chart</Text>
            </View>
        </Page>
    </Document>
);

export default Dashboard;
