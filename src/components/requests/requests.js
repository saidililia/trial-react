import './requests.css';
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Select, TreeSelect, Button, Input, Alert } from 'antd';
import { SendOutlined, MinusOutlined } from '@ant-design/icons';
import { CiLocationOn } from "react-icons/ci";
const treeData = [
  {
    value: 'All Requests',
    title: 'All Requests'
  },
  {
    value: 'Demande de vidage',
    title: 'Demande de vidage',
    children: [
      {
        value: 'RED',
        title: 'RED',
      },
      {
        value: 'YELLOW',
        title: 'YELLOW',
      },
      {
        value: 'GREEN',
        title: 'GREEN',
      },
    ],
  },
  {
    value: 'Retard du collecte',
    title: 'Retard du collecte',
  },
  {
    value: 'Mauvaise collecte',
    title: 'Mauvaise collecte',
  },
  {
    value: 'Decharge sauvage a proximite',
    title: 'Decharge sauvage a proximite',
  }
];
const { TextArea } = Input;
function Requests() {
  const [selectedValue, setSelectedValue] = useState("delivered");
  const [treeValue, setTreeValue] = useState("All Requests");
  const [reports, setReports] = useState([]);
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isApplyClicked, setIsApplyClicked] = useState(false);
  const [title, setTitle] = useState('');
  const [full, setFull] = useState('');
  const [alertType, setAlertType] = useState(null);
  const [showComposeButton, setShowComposeButton] = useState(false); // State to show/hide compose message button


  useEffect(() => {
    // Check if alertType is set and applyClicked is true
    if (alertType && isApplyClicked) {
      // Display the alert
      const timer = setTimeout(() => {
        setIsApplyClicked(false); // Reset the state to allow showing alert again
      }, 3000); // Adjust the duration as needed
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [alertType, isApplyClicked]); 

  const token = localStorage.getItem('token')
  const headers = {
    'Authorization': `${token}`
  };
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (value = treeValue) => {
    try {
      const response = await fetch(`https://saidililia.pythonanywhere.com/Requests?value=${value}`, {headers});
      if (response.ok) {
        const data = await response.json();
        setReports(data);
        console.log(`fetched data with value:   ....${value} and reports: ${data}`)
        setAlertType('success')
      } else {
        console.error('Failed to fetch reports');
        setAlertType('error')
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = (_id, _title, _first, _last) =>{
    setAlertType(null)
    setUserID(_id);
    setTitle(_title);
    setFull(`${_first} ${_last}`)
    setShowComposeButton(true);
  }

const handleApplyNotification = async () => { 
  try {
    const response = await fetch(`https://saidililia.pythonanywhere.com/addNews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({ id: userID, text: text, title: title }),
    });
    if (response.ok) {
      console.log(`Notification sent successfully`);
      setAlertType('success');
    } else {
      console.error('Failed to send notification');
      setAlertType('error');
    }
  } catch (error) {
    console.error('Error:', error);
    setAlertType('error');
  } finally {
    setLoading(false);
    setIsApplyClicked(true); // Set isApplyClicked to true after the Apply button is clicked
  }
};
  
const formatDate = (dateString) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
};
  // const handleComposeMessage = () => {
  //   // Handle compose message functionality
  // };

  const handleCancelCompose = () => {
    setShowComposeButton(false);
  };

  // const handleConfirmCompose = () => {
  //   setShowComposeButton(false);
  //   // Add logic to send notification
  // };

  const handleTreeSelect = async (value) => {
    setTreeValue(value);
    fetchReports(value);
  };

  const handleSelectChange = (value, report_id, user_id) => {
    setSelectedValue(value);
  
  //  // Update the report status in the reports state
  //   setReports(prevReports => prevReports.map(report => 
  //   report.id === report_id ? { ...report, status: value } : report
  fetch('https://saidililia.pythonanywhere.com/Requests/update', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ report_id, user_id })
  })
  .then(response => {
    if (response.ok) {
      console.log(`Successfully updated report with id ${report_id}`);
      // Optionally, you may reload the page after successful update
      //
      setLoading(true)
      fetchReports();
    } else {
      console.error(`Failed to update report with id ${report_id}`);
      // Handle error
    }
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle network errors
  });
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const displayedItems = reports.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const headerText = treeValue === 'All Requests' ? 'All Requests' : (treeValue === 'GREEN' || treeValue === 'RED' || treeValue === 'YELLOW') ? `Demande de vidage - ${treeValue}` : treeValue;
  return (
    <div className='request'>
      <div className='container'>
        <div className='header2'>
          <h3 style={{ color: '#3c3a3a', display: "inline-block" }}>{headerText}</h3>
          <TreeSelect
            defaultValue={treeValue}
            showSearch
            style={{ width: '200px', float: 'right', paddingTop: '10px', height: '40px' }}
            placeholder="Select Request Type"
            treeDefaultExpandAll
            onChange={handleTreeSelect}
            treeData={treeData}
          />
        </div>
        {loading ? (
          <div className='circus'>
            <CircularProgress />
          </div>
        ) : (
          <div className='Cards'>
            {displayedItems.map(report => (
              <div key={report.id} className='card'>
                <div className='title'>
                  <p>{report['fName']} {report['lName']}: {report.title}</p>
                </div>
                <div className='status'>
                  <Select
                    showSearch
                    defaultValue={selectedValue}
                    onChange={(value) => handleSelectChange(value, report.id, report.user_id)}
                    onSearch={onSearch}
                    options={[
                      {
                        value: 'Done',
                        label: 'Done',
                      },
                    ]}
                  />
                  <Button type='primary' style={{ backgroundColor: 'rgb(66, 108, 70)', marginLeft: "5px" }}  onClick={() => handleSendNotification(
                    report['user_id'],
                     report.title,
                      report['fName'],
                       report['lName']
                       )}>
                  <SendOutlined />
                  </Button>
                </div>
                <div className='message'>
                  <p>{report.message}</p>
                </div>
                <div className='both'>
                <CiLocationOn style={{marginLeft:"0px"}} size={18}/>
                  <p>Location</p>
                  <p style={{float:"right"}}>{formatDate(report.date)}</p>
                </div>
              </div>
            ))}
            <div className='Pagination'>
              <button className="npc" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button style={{ backgroundColor: currentPage === index + 1 ? "#a6dba5" : "" }} className="main" key={index} onClick={() => goToPage(index + 1)} disabled={currentPage === index + 1}>
                  {index + 1}
                </button>
              ))}
              <button className="npc" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {showComposeButton && (
        <div className='compose-message-button' style={{float:"right", width:"400px", height:"400px"}}>
        <div className='message-header'>
        <MinusOutlined onClick={handleCancelCompose} style={{float:'right'}}/>
        <h3>Reply to: {title}</h3>
        </div>
        <div className='message-header' style={{margin:"10px 0px"}}>
        <p style={{display:"inline-block", fontSize:"16px"}}>Author: </p>
        <Input
          disabled={true}
          value={full}
          style={{display:"inline", width:"270px", marginLeft:"30px"}}
        />
        <p style={{display:"inline-block", fontSize:"16px"}}>User ID: </p>
        <Input
          disabled={true}
          value={userID}
          style={{display:"inline", width:"270px", marginLeft:"30px"}}
        />
        </div>
        <TextArea rows={4} style={{margin:"5px 0px"}} 
         value={text}
         onChange={(e) => setText(e.target.value)}/>
        <Button type='primary' style={{margin:"10px 0px", float:"right",
         backgroundColor:"rgb(66, 108, 70)"}} 
         onClick={() => handleApplyNotification()}>
         Reply
        </Button>
        {alertType && isApplyClicked && (
            alertType === 'success' ? (
              <Alert type="success" message="Reply sent successfully" style={{ width: "280px", marginTop: "8px" }} />
            ) : (
              <Alert type="error" message="Error while sending request" style={{ width: "280px", marginTop: "8px" }} />
            )
            )}
          </div>
            )}
            </div>
            );
          }

export default Requests;
