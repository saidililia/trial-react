import React, { useState, useEffect } from "react";
import { Card } from 'antd';
import CircularProgress from '@mui/material/CircularProgress';
import { EditOutlined } from '@ant-design/icons';

function Logs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchLogs(token);
    console.log("Fetching logs...");
  }, []);

  const fetchLogs = async (token) => {
    console.log("Token for fetching logs:", token);
    const headers = {
      'Authorization': `${token}`
    };
    try {
      const response = await fetch('https://saidililia.pythonanywhere.com/Logs', { headers });
      const responseData = await response.json();
      console.log('API Response:', responseData);
  
      // Check if the response has the logs array
      if (responseData.logs) {
        setLogs(responseData.logs);
        console.log("Logs fetched successfully");
      } else {
        console.log("No logs found.");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="logs">
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '16px', width: '100%', marginTop:'20px' }}>
          {logs.map((log, index) => (
            <Card
              key={index}
              title={log.user} // Display the full name
              style={{ width: '100%' }}  // Ensure the card takes full width
              bodyStyle={{ padding: '10px' }}
            >
              <p>{log.message}</p> {/* Display the message */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Logs;
