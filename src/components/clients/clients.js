import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Select, Button, Table, Input, Alert } from 'antd';
import { UsergroupDeleteOutlined, ArrowLeftOutlined, DeleteOutlined, PhoneOutlined, TrophyOutlined } from '@ant-design/icons';
import './clients.css';
import { useNavigate } from "react-router-dom";
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import { CiLocationOn } from "react-icons/ci";
import { Navigate } from "react-router-dom";
const { Search } = Input;


function Clients() {
  const [clients, setClients] = useState([]);
  const [allclients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showEditDiv, setShowEditDiv] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientFullName, setSelectedClientFullName] = useState('');
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `${token}`
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () =>{
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
  }
  const showTableFunc = async () => {
    console.log('step1: start show table func ...........')
    const response = await fetch('https://saidililia.pythonanywhere.com/AllClients', { headers });
    console.log('step2: show table func ...........')
    const jsonData = await response.json();
    console.log('step3: we got response json here ........... ', jsonData)
    if (jsonData.message === "success") {
      console.log(jsonData.message);
      setAllClients(jsonData.clients);
      setFilteredClients(jsonData.clients);
    }
    setShowTable(true);
  };

  const handleBack = () => {
    setShowTable(false);
  };

  const handleDoneClick = async (id, first, last) => {
    // setIsEditClicked(true);
    // setSelectedClientId(id);
    // setSelectedClientFullName(first + " " + last);
    // setShowEditDiv(true);
    console.log('Handling Done clicked ...........')
    const response = await fetch('https://saidililia.pythonanywhere.com/Clients/update', {
      method: 'POST',
      headers: {
        'Authorization': `${token}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ 
        id: id,
        first: first
      })
    });
    const jsonData = await response.json();
    if (jsonData.message === "Client data updated") {
      console.log('Here is response message ...........')
      console.log(jsonData.message);
      setLoading(true);
      fetchClients();
    }
  };

  const handleSearch = (value) => {
    const filtered = allclients.filter(client =>
      client['First Name'].toLowerCase().includes(value.toLowerCase()) ||
      client['Last Name'].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleDelete = async (id) => {
    console.log("this is the record id", id);
    try {
      const response = await fetch('https://saidililia.pythonanywhere.com/Client-delete', {
        method: 'DELETE',
        headers: {
        'Authorization': `${token}`,
        'Content-type': 'application/json'
      },
        body: JSON.stringify({ 
              id: id
            })
      });

      if (response.ok) {
        const jsonData = await response.json();
        console.log('the messaage.............',jsonData.message)
        // message.success('Client deleted successfully');
        // Remove the client from the state
        const updatedClients = filteredClients.filter(client => client.id !== id);
        setFilteredClients(updatedClients);
        setAllClients(allclients.filter(client => client.id !== id));
      } else {
        console.log('the messaage.............',response.message)
        // message.error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      // message.error('Failed to delete client');
    }
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
      title: (
        <span>
          <PhoneOutlined style={{fontSize:"17px"}}/> Phone
        </span>
      ),
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record) => (
        <span>{text}</span>
      ),
    },
    {
      title: (
        <span>
          <ScoreboardOutlinedIcon style={{fontSize:"20px", marginTop:"5px"}}/> Score
        </span>
      ),
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: (
        <span>
          <TrophyOutlined style={{fontSize:"17px"}}/> Rank
        </span>
      ),
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button danger style={{marginRight:"10px"}} onClick={()=>handleDelete(record.id)}>
          <DeleteOutlined/>
          </Button>
        </div>
      ),
    },
  ];

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="clients">
      <div className="header">
        {!showTable ? (
          <Button className='add' type='primary' icon={<UsergroupDeleteOutlined style={{ color: 'white' }} />} onClick={showTableFunc}>
            View all clients
          </Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button className='add' type='primary' icon={<ArrowLeftOutlined style={{ color: 'white' }} />} onClick={handleBack}>
              Back
            </Button>
            <Search style={{ marginLeft: '10px', flexGrow: 1, width:"400px" }} placeholder="search user"  size="medium" onSearch={handleSearch}/>
          </div>
          
        )}
      </div>
      <div className="container">
        {loading ? (
          <div className='circus'>
            <CircularProgress />
          </div>
        ) : showTable ? (
          <Table columns={columns}
           dataSource={filteredClients.map((client, index) => ({
            key: index,
            firstName: client['First Name'],
            lastName: client['Last Name'],
            phone: client['Phone'],
            score: client['score'],
            rank: index,
            action: client['score'],
            id: client.id
          }))} style={{ width: '100%' }} />
        ) : (
          <div className="cards">
            {clients.map((client, index) => (
              <div className="User" key={index}>
                <div className="title" style={{ display: "block", margin: "4px 10px", marginBottom: "10px" }}>
                  <p style={{fontWeight:"500"}}>First Name:</p>
                  <span className="hover-green" onClick={() => handleCopy(client['First Name'])} style={{ cursor: 'pointer' }}>{client['First Name']}</span>
                  <p style={{fontWeight:"500"}}>Last Name:</p> 
                  <span className="hover-green" onClick={() => handleCopy(client['Last Name'])} style={{ cursor: 'pointer' }}>{client['Last Name']}</span>
                  <Button style={{backgroundColor: "rgb(66, 108, 70)", float:"right", marginRight:"10px"}} type="primary" onClick={() => handleDoneClick(client.id, client['First Name'], client['Last Name'])}>
                    Done
                  </Button>
                </div>
                <div className="document" style={{ padding: "4px 10px" }}>
                  <p style={{fontWeight:"500"}}>ID:</p>
                  <span className="hover-green" onClick={() => handleCopy(client.id)} style={{ cursor: 'pointer' }}>{client.id}</span>
                  <div style={{ display: "flex", alignItems: "center", marginLeft:"12px" }}>
                    <CiLocationOn className="location-icon" size={18}/>
                    <p style={{fontWeight:"500"}}>Location:</p>
                    <span className="hover-green" onClick={() => handleCopy(client.Geolocation)} style={{ cursor: 'pointer' }}>{client.Geolocation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;
