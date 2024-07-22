import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Button, Col, Layout, Row, Statistic, Collapse } from 'antd';
import CountUp from 'react-countup';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { DownloadOutlined, PayCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View} from '@react-pdf/renderer';
import { Avatar, Card } from 'antd';

const { Meta } = Card;
const { Header, Content } = Layout;
const { Panel } = Collapse;

const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'June', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'July', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Aug', uv: 3490, pv: 4300, amt: 2400 },
    { name: 'Sep', uv: 4490, pv: 4300, amt: 2300 },
    { name: 'Oct', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Nov', uv: 2490, pv: 2300, amt: 2600 },
    { name: 'Dec', uv: 3490, pv: 4300, amt: 2700 },
];

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
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchReports(token);
        console.log("in dashboard use effects............");
      }, []);
    
      const fetchReports = async (token) => {
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
                                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                            title="Average Score"
                                        />
                                        <Statistic value={averageScore} precision={2} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                    <Card>
                                    <Meta
                                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                            title="Active Users"
                                        />
                                        <Statistic value={averageScore} precision={2} />
                                    </Card>
                                </Col>
                            </Row>
                            <Row justify="start">
                                <Col span={24}>
                                    <div className="chart" style={{ width: "100%" }}>
                                        <h3>Score</h3>
                                        <LineChart width={720} height={400} data={data}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                        </LineChart>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ width: '290px' }}>
                            <Card style={{ height: '100%', width: '290px' }}>
                            <h2 >{wilaya}, {commune}</h2>
                            <p>Total Population: 1 657 000</p>
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
