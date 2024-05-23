import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Select, Button } from "antd";
import './login.css';
import wilayaOptions from './wilayaOptions'; // Import wilaya options
import communeOptions from './communeOptions'; // Import commune options

function Login() {
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [wilaya, setWilaya] = useState('Alger');
  const [passwordValue, setPasswordValue] = useState('');
  const [commune, setCommune] = useState('Rouiba');
  const navigate = useNavigate();

  const handleChange = (value) => {
    setWilaya(value);
    // Reset commune when wilaya changes
    setCommune(communeOptions[value][0].value);
  };

  const handleCommChange = (value) => {
    setCommune(value);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleLogin = async () => {
    setLoading(false);

    const response = await fetch(`http://saidililia.pythonanywhere.com/login?wilaya=${wilaya}&password=${passwordValue}&commune=${commune}`);
    const jsonDataLogin = await response.json();

    setResponseMessage(jsonDataLogin.message);

    if (jsonDataLogin.message === "Document found") {
      console.log(jsonDataLogin.message);
      localStorage.setItem('token', jsonDataLogin.token);

      // Redirect to the appropriate page
      navigateToPage(jsonDataLogin.token);
    } else if (jsonDataLogin.message === 'Document not found'){
      // Login failed
      //console.log('this is the eroponse message',jsonDataLogin.message)
      setResponseMessage("Login failed. Please try again."); // Set error message
      setLoading(true); // Reset loading state to show login form again
    }
  };

  const navigateToPage = (token) => {
    //console.log("here is the token.......", token)
    const headers = {
      'Authorization': `${token}`
    };
  
    // Fetch additional data or navigate based on token
    fetch(`http://saidililia.pythonanywhere.com/facture?commune=${commune}`, { headers })
      .then(response => response.json())
      .then(jsonDataFacture => {
        //console.log("the full message: ...", jsonDataFacture)
        if(jsonDataFacture.message === "not paid"){
          navigate('/Payment'); // Redirect to the Payment component
        }
        else{
          // Login successful
          navigate('/Dashboard');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  
  const filterOption = (input, option) => {
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  };

  return (
    <div className="containerl">
      {loading ? (
        <div className="container">
          <div className="loginBox">
            <h2>Sign in</h2>
            <Select
              showSearch
              filterOption={filterOption}
              defaultValue={wilaya}
              style={{ width: 220, margin: "10px 0px" }}
              onChange={handleChange}
              options={wilayaOptions}
            />
            <Select
              showSearch
              filterOption={filterOption}
              defaultValue={commune}
              style={{ width: 220, margin: "10px 0px" }}
              onChange={handleCommChange}
              options={communeOptions[wilaya]} // Use commune options based on selected wilaya
            />
            <Input
              type="password"
              style={{ width: "220px", margin: "0px 0px 10px 0px" }}
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              // prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={
                <Tooltip title="Extra information">
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
            <Button onClick={handleLogin}>Login</Button>
            {responseMessage && <p style={{ color: "red" }}>{responseMessage}</p>}
            <p>Forgot your password? </p>
          </div>
          <div className="right-panel">
            <img src="collecte.png" alt="Collect" style={{ width: "100%" }} />
          </div>
        </div>
      ) : (
        <div className='circus'>
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default Login;
