import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Select, Button, Table, Input, Alert } from 'antd';
import { UsergroupDeleteOutlined, EditOutlined, ArrowLeftOutlined, MinusOutlined } from '@ant-design/icons';
import './clients.css';
import { CiLocationOn } from "react-icons/ci";

function Clients() {
  const [selectedValue, setSelectedValue] = useState("GREEN");
  const [clients, setClients] = useState([]);
  const [allclients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showEditDiv, setShowEditDiv] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientFullName, setSelectedClientFullName] = useState('');
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [wemosInfo, setWemosInfo] = useState('');
  const [type, setType] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `${token}`
  };

  const fetchClients = () => {
    fetch('https://saidililia.pythonanywhere.com/Clients', { headers })
      .then(response => response.json())
      .then(data => {
        console.log("the full message: ...", data);
        setClients(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClients();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    if (isEditClicked) {
      const fetchWemosInfo = () => {
        fetch('https://saidililia.pythonanywhere.com/wemos-info')
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              setWemosInfo(`Wemos D1 R2 found ${data.wemos_port}`);
              setType('success');
            } else {
              console.error('Error fetching Wemos D1 R2 info:', data.message);
              setType('error');
              setWemosInfo('No Wemos D1 R2 found');
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      };

      fetchWemosInfo();
      const intervalId = setInterval(fetchWemosInfo, 2000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isEditClicked]);

  const showTableFunc = async () => {
    console.log('step1: start show table func ...........');
    const response = await fetch('https://saidililia.pythonanywhere.com/AllClients', { headers });
    console.log('step2: show table func ...........');
    const jsonData = await response.json();
    console.log('step3: we got response json here ........... ', jsonData);
    if (jsonData.message === "success") {
      console.log(jsonData.message);
      setAllClients(jsonData.clients);
    }
    setShowTable(true);
  };

  const handleNFC = () => {
    console.log("starting.......");
    fetch('https://saidililia.pythonanywhere.com/control-wemos', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        selectedClientId: selectedClientId,
        selectedClientFullName: selectedClientFullName,
        selectedValue: selectedValue
      })
    })
      .then(response => {
        if (response.ok) {
          console.log(`Successfully updated Recycable`);
        } else {
          console.error(`Failed to update Recycable`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleBack = () => {
    setShowTable(false);
  };

  const handleEditClick = (id, first, last) => {
    setIsEditClicked(true);
    setSelectedClientId(id);
    setSelectedClientFullName(first + " " + last);
    setShowEditDiv(true);
  };

  const handleCancelEdit = () => {
    setIsEditClicked(false);
    setShowEditDiv(false);
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => (
        <span>{text}</span>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'actions',
      
    },
  ];

  // const onChange = (id) => {
  //   fetch('/Clients/update', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify({ id })
  //   })
  //     .then(response => {
  //       if (response.ok) {
  //         console.log(`Successfully updated client with id ${id}`);
  //         // Reload the page after successful update
  //         window.location.reload();
  //       } else {
  //         console.error(`Failed to update client with id ${id}`);
  //         // Handle error
  //       }
  //     });
  // };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <div className="clients">
      <div className="header">
        {!showTable ? (
          <Button className='add' type='primary' icon={<UsergroupDeleteOutlined style={{ color: 'white' }} />} onClick={showTableFunc}>
            View all clients
          </Button>
        ) : (
          <Button className='add' type='primary' icon={<ArrowLeftOutlined style={{ color: 'white'}} />} style={{position:'relative', left:'1070px'}} onClick={handleBack}>
            Back
          </Button>
        )}
      </div>
      <div className="container">
      {loading ? (
  <div className='circus'>
    <CircularProgress />
  </div>
) : showTable ? (
  <Table columns={columns} dataSource={allclients.map((client, index) => ({
    key: index,
    firstName: client['First Name'],
    lastName: client['Last Name'],
    phone: client['Phone'], // Adjust this according to your data structure
    score: client['score'], // Adjust this according to your data structure
    rank: index, // Adjust this according to your data structure
  }))} style={{ width: '100%' }} />
) : (
  <div className="cards">
    {clients.map((client, index) => (
      <div className="User" key={index}>
        <div className="title">
          <p style={{color: "rgb(44, 54, 36)"}}>{client['First Name']}</p>
          <p style={{color: "rgb(44, 54, 36)"}}>{client['Last Name']}</p>
        </div>
        <div className="status">
          <Select
            showSearch
            defaultValue="GREEN"
            onChange={(value) => {
              setSelectedValue(value);
              //onChange(client.id); // Pass the id to the onChange function
            }}
            onSearch={onSearch}
            options={[
              {
                value: 'GREEN',
                label: 'GREEN',
              },
              {
                value: 'RED',
                label: 'RED',
              },
              {
                value: 'ORANGE',
                label: 'ORANGE',
              },
            ]}
          />
          <Button type="primary" style={{ backgroundColor: "white", marginLeft: "5px" }} onClick={() => handleEditClick(client.id, client['First Name'], client['Last Name'])}>
          <EditOutlined />
          </Button>
        </div>
        <div className="both">
          {/* <div className="location">
            <p>{client.Geolocation}</p>
          </div> */}
          <div className="document">
          <CiLocationOn style={{marginLeft:"10px"}} size={18}/>
          <p>{client.Geolocation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  {/* Render the edit div when showEditDiv state is true */}
  {showEditDiv && (
    <div className='compose-message-button' style={{float:"right", width:"400px", height:"400px", padding:"0px 30px"}}>
        <div className='message-header'>
        <MinusOutlined onClick={handleCancelEdit} style={{float:'right', padding:"0px 5px"}}/>
        <h4>Configure NFC: {selectedValue} Bin</h4>
        </div>
        <h5>Note: Please connect the nfc reader first</h5>
        <div className="info">
        <Alert type={type} message={wemosInfo}/>
        </div>
        <div className="one">
        <p>User : </p>
        <Input disabled={true} defaultValue={selectedClientFullName} style={{width:"250px", display:"inline-block"}}/>
        </div>
        <div className="one">
        <p>ID : </p>
        <Input disabled={true} defaultValue={selectedClientId} style={{width:"250px", display:"inline-block"}}/>
        </div>
        <div className="one">
        <p>Bin : </p>
        <Input disabled={true} defaultValue={selectedValue} style={{width:"250px", display:"inline-block"}}/>
        </div>
        
        <Button type="primary" style={{backgroundColor: "rgb(66, 108, 70)", float:"right", position:"relative", top:"30px"}} onClick={handleNFC}>Apply</Button>
    </div>
  )}
  </div>
  </div>
  );
}

export default Clients;
