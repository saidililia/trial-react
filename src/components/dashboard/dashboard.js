import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Button, Col, Layout, Row, Statistic, Collapse } from 'antd';
import CountUp from 'react-countup';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { DownloadOutlined, PayCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View} from '@react-pdf/renderer';

const { Header, Content } = Layout;
const { Panel } = Collapse;

const data = [
    { name: 'January', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'February', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'March', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'April', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'June', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'July', uv: 3490, pv: 4300, amt: 2100 },
];

const barChartData = [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 300 },
    { name: 'D', value: 400 },
    { name: 'E', value: 500 },
];

const formatter = (value) => <CountUp end={value} separator="," />;

function Dashboard() {
    const navigate = useNavigate();
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const [loading, setLoading] = useState(true)
    const [wilaya, setWilaya] = useState('')
    const [commune, setCommune] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [montant, setMontant] = useState(null)
    const [duree, setDuree] = useState(null)
    const [Users, setUsers] = useState(0)
    

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetchReports(token);
        console.log("in dashboard use effects............")
      });
    
      const fetchReports = async (token) => {
        console.log("here is the dashboard token.......", token)
        const headers = {
            'Authorization': `${token}`
        };
        try {
          const response = await fetch(`https://saidililia.pythonanywhere.com/Dashboard`, {headers});
          const responseData = await response.json();
          if (responseData.message ==='success') {
            console.log(`fetched data with value: ${responseData.endDate} ${responseData.montant} ${responseData.message}`)
            setCommune(responseData.commune)
            setWilaya(responseData.wilaya)
            setDuree(responseData.duree)
            setMontant(responseData.montant)
            setStartDate(responseData.startDate)
            setEndDate(responseData.endDate)
            console.log("total: ", responseData.totalUsers)
            setUsers(responseData.totalUsers)
            
            
          } else {
            navigate('/Error')
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
                <div className="content" style={{}}>
                <Header className="header">
                <div className="action-buttons" style={{float:"left"}}>
                    <PDFDownloadLink document={<PdfDocument />} fileName="dashboard.pdf" style={{ textDecoration: 'none' }}>
                        <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" style={{ backgroundColor: "rgb(66, 108, 70)" }}>Download</Button>
                    </PDFDownloadLink>
                    <Button type="default" shape="round" icon={<PayCircleOutlined />} size="large" style={{ backgroundColor: "white", marginTop:"10px" }} onClick={handleTogglePaymentInfo}>Payment</Button>
                </div>
                <h2 >{wilaya}, {commune}</h2>
            </Header>
            <Content className="content">
                <div className="site-layout-content">
                    {showPaymentInfo && (
                        <Row gutter={[16, 16]} justify="center" align="top" style={{marginBottom:"20px"}}>
                            <Col span={24}>
                                <Collapse defaultActiveKey={['1']}>
                                    <Panel header="Payment Information" key="1">
                                        {/* Your payment information here */}
                                        <p>Here are your Payment Information: you payed {montant}DA on {startDate}, for {duree} month</p>
                                        <p>Your subscription ends on {endDate}</p>
                                        <Button type="default" onClick={handleTogglePaymentInfo}>Collapse</Button>
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    )}

                    <Row gutter={[16, 16]} justify="center" align="top" style={{ marginBottom: "40px", marginLeft: "70px" }}>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic title="Active Users" value={Users} formatter={formatter} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic title="Average Score" value={0} formatter={formatter} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic title="Total Waste in Kg" value={0} prefix="" formatter={formatter} />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Statistic title="Revenue" value={0} prefix="$" formatter={formatter} />
                        </Col>
                    </Row>

                    <Row gutter={[580, 26]} justify="start">
                        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                            <div className="chart" style={{ width: "450px" }}>
                                <h3>Monthly Data</h3>
                                <LineChart width={400} height={200} data={data}>
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
                        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                            <div className="chart" style={{ width: "450px" }}>
                                <h3>Bar Chart</h3>
                                <BarChart width={400} height={200} data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </div>
                        </Col>
                    </Row>
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
