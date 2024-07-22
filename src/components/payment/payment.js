import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { Button, Card, Col, Row } from 'antd';
import './payment.css';

function Payment() {
    const location = useLocation();
    const { commune } = location.state || {};
    // const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleClick = async (montant, duree) => {
        const response = await fetch('https://saidililia.pythonanywhere.com/addPayment', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ 
              montant: montant,
              commune: commune,
              duree: duree
            })
          });
        console.log("print response message: ..........", response)
        const jsonData = await response.json();
        console.log("print jsonData message: ..........", jsonData.message)
        // setResponseMessage(jsonData.message);

    if (response.ok) {
      console.log(jsonData.message);
      navigate('/Dashboard')
    }
    else{
        console.log(jsonData.message)
        navigate('/Payment')
    }
    }

    return (
        <div className="payment">
            <header className="payment-header">
                <h1>Welcome to Trial</h1>
                <h3>The first Digital waste management and recycling system in Algeria.</h3>
            </header>
            <div className="payment-cards">
                <Row gutter={24} justify="center">
                    <Col xs={24} sm={8}>
                        <Card title="Monthly Plan" bordered={false} className="payment-card" style={{ backgroundColor: '#6CC47C' }}>
                            <h1>2000 DA</h1>
                            <Button onClick={() => handleClick(1000, 1)}>Apply</Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card title="6 Months Plan" bordered={false} className="payment-card" style={{ backgroundColor: "#FF99CC" }}>
                            <h1>10000 DA</h1>
                            <Button onClick={() => handleClick(5000, 6)}>Apply</Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card title="Annual Plan" bordered={false} className="payment-card" style={{ backgroundColor: "#A4D8D8" }}>
                            <h1>20000 DA</h1>
                            <Button onClick={() => handleClick(10000, 12)}>Apply</Button>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default Payment;
