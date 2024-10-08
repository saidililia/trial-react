import React, { useState, useEffect } from "react";
import './schedule.css';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, Select} from 'antd';
import { Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Meta } = Card;
const Hours = [
  { value: '00', title: '00'},
  { value: '01', title: '01'},
  { value: '02', title: '02'},
  { value: '03', title: '03'},
  { value: '04', title: '04'},
  { value: '05', title: '05'},
  { value: '06', title: '06'},
  { value: '07', title: '07'},
  { value: '08', title: '08'},
  { value: '09', title: '09'},
  { value: '10', title: '10'},
  { value: '11', title: '11'},
  { value: '12', title: '12'},
  { value: '13', title: '13'},
  { value: '14', title: '14'},
  { value: '15', title: '15'},
  { value: '16', title: '16'},
  { value: '17', title: '17'},
  { value: '18', title: '18'},
  { value: '19', title: '19'},
  { value: '20', title: '20'},
  { value: '21', title: '21'},
  { value: '22', title: '22'},
  { value: '23', title: '23'},
]
const Days = [
  { value: 'Sunday', title: 'Sunday'},
  { value: 'Monday', title: 'Monday'},
  { value: 'Tuesday', title: 'Tuesday'},
  { value: 'Wednesday', title: 'Wednesday'},
  { value: 'Thursday', title: 'Thursday'},
  { value: 'Friday', title: 'Friday'},
  { value: 'Saturday', title: 'Saturday'},
]

function Schedule() {
  const [loading, setLoading] = useState(true);
  const [datesR, setDatesR] = useState([]);
  const [datesB, setDatesB] = useState([]);
  const [datesN, setDatesN] = useState([]);
  const [click1, setClick1] = useState(false);
  const [click2, setClick2] = useState(false);
  const [click3, setClick3] = useState(false);


  const token = localStorage.getItem('token')
  const headers = {
    'Authorization': `${token}`
  };
  // retreive inial dates
  useEffect(() => {
    fetchSchedule(headers);
  }, []);
  
  const fetchSchedule = async (headers) => {
  const responseR = await fetch('https://saidililia.pythonanywhere.com/Recycable', {headers});
  const responseDataR = await responseR.json();
  if(responseDataR.message ==="success"){
    setDatesR(responseDataR.Recycable)
    console.log("recycable collection is.......",responseDataR.Recycable, datesR)
  }
  else{
    console.log("message isn't equal to success.......")
  }
  const responseB = await fetch('https://saidililia.pythonanywhere.com/Burnable', {headers});
  const responseDataB = await responseB.json();
  if(responseDataB.message ==="success"){
    setDatesB(responseDataB.Burnable)
    console.log("burnable collection is.......",responseDataB.Burnable)
  }
  else{}
  const responseN = await fetch('https://saidililia.pythonanywhere.com/NBurnable', {headers});
  const responseDataN = await responseN.json();
  if(responseDataN.message ==="success"){
    setDatesN(responseDataN.NBurnable)
  }
  else{
    
  }
  setLoading(false)
}

  const handleClick1 = () => {
    setClick1(true);
  }
  const handleClick2 = () => {
    setClick2(true);
  }
  const handleClick3 = () => {
    setClick3(true);
  }

  const handleDatesB = () => {
    setDatesB([...datesB, {}]); // Append an empty object to datesR
  };
  const handleDatesR = () => {
    setDatesR([...datesR, {}]); // Append an empty object to datesR
  };
  const handleDatesN = () => {
    setDatesN([...datesN, {}]); // Append an empty object to datesR
  };
  const deleteItem = (collection) => {
      collection.pop();
      console.log("this is the new collection");
      console.log(collection);
      if (collection === datesR){
        handleSubmitR();
      }
      if (collection === datesB){
        handleSubmitB();
      }
      if (collection === datesN){
        handleSubmitN();
      }

      
  }

  const onChangedHour = (collection, index, hour) => {
    // Create a new array with the updated object at the specified index
    const updatedCollection = collection.map((item, i) => {
      if (i === index) {
        return { ...item, 'hour': hour }; // Update the hour property of the object at the specified index
      }
      return item;
    });
  
    // Update the state based on the original collection passed in
    if (collection === datesR) {
      setDatesR(updatedCollection);
    } else if (collection === datesN) {
      setDatesN(updatedCollection);
    } else if (collection === datesB) {
      setDatesB(updatedCollection);
    }
    console.log("updates successfully")
  }
  
  const onChangedDay = (collection, index, day) => {
    const updatedCollection = collection.map((item, i) => {
      if (i === index) {
        return { ...item, 'day': day }; 
      }
      return item;
    });
    if (collection === datesR) {
      setDatesR(updatedCollection);
    } else if (collection === datesN) {
      setDatesN(updatedCollection);
    } else if (collection === datesB) {
      setDatesB(updatedCollection);
    }
    console.log("updates successfully")
  }
  
  const handleSubmitR = () =>{
    console.log(datesR)
    fetch('https://saidililia.pythonanywhere.com/update-Recycable', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}` // Include the token in the headers
     },
      body: JSON.stringify({dates: datesR})
    })
    .then(response => {
      if (response.ok) {
        console.log(`Successfully updated Recycable`);
        setLoading(true)
        fetchSchedule(); 
        setClick1(false)
      } else {
        console.error(`Failed to update Recycable`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  const handleSubmitB = () =>{
    fetch('https://saidililia.pythonanywhere.com/update-Burnable', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}` // Include the token in the headers
      },
      body: JSON.stringify({dates: datesB})
    })
    .then(response => {
      if (response.ok) {
        console.log(`Successfully updated Burnable`);
        setLoading(true)
        fetchSchedule(); 
        setClick2(false)
      } else {
        console.error(`Failed to update Burnable`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  const handleSubmitN = () =>{
    fetch('https://saidililia.pythonanywhere.com/update-NBurnable', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `${token}` // Include the token in the headers
      },
      body: JSON.stringify({dates: datesN})
    })
    .then(response => {
      if (response.ok) {
        console.log(`Successfully updated Non-burnable`);
        setLoading(true)
        fetchSchedule(); 
        setClick3(false)
      } else {
        console.error(`Failed to update Non-Burnable`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  return (
    <div className="schedule">

      <div className="container">
        {loading ? (
          <div className='circus'>
            <CircularProgress />
          </div>
        ) : (
          <div>

            <div className='element'>
            <Card style={{padding:"10px"}}
            actions={[
            
            <EditOutlined key="edit" onClick={handleClick1}/>,
            
            ]}
            >
            <Meta
            title={
                    <span>
                      <span className="circle green-circle" /> Recycable
                    </span>
                  }
            description="This is the description"

            />
            <div>
                <p>Dates</p>
                <IconButton onClick={handleDatesR} disabled={!click1}>
                  <AddIcon /> 
                </IconButton>
                <IconButton disabled={!click1} onClick={() => deleteItem(datesR)}>
                  <RemoveIcon/>
                </IconButton>
                {datesR.map((date, index) => (
                  <div key={index} className="added">
                    <div className="hours">
                      <p>Hour {index + 1}</p>
                      <Select
                        disabled={!click1}
                        defaultValue={date['hour']}
                        showSearch
                        style={{ width: '120px', float: 'right' }}
                        placeholder="Select Hour"
                        options={Hours}
                        onChange={(value) => onChangedHour(datesR, index, value)}
                      />
                    </div>
                    <div className="day">
                      <p>Day {index + 1}</p>
                      <Select
                        disabled={!click1}
                        defaultValue={date['day']}
                        showSearch
                        style={{ width: '120px', float: 'right' }}
                        placeholder="Select Day"
                        options={Days}
                        onChange={(value) => onChangedDay(datesR, index, value)}
                      />
                    </div>
                  </div>
                ))
                }
                {click1 && (
                  <div className="submit">
                    <Button onClick={handleSubmitR}>Submit</Button>
                  </div>
                )}
              </div>
              </Card>
              
              
              
            </div>
            <div className="element">
            <Card style={{padding:"10px"}}
            actions={[
            <EditOutlined key="edit" onClick={handleClick2}/>,
            ]}
            >
            <Meta
            title={
                    <span>
                      <span className="circle orange-circle" /> Organic
                    </span>
                  }
            description="This is the description"

            />
            <div>
                <p>Dates</p>
                <IconButton onClick={handleDatesB} disabled={!click2}>
                  <AddIcon /> 
                </IconButton>
                <IconButton disabled={!click2} onClick={() => deleteItem(datesB)}>
                  <RemoveIcon/>
                </IconButton>
                {datesB.map((date, index) => (
                  <div key={index} className="added">
                    <div className="hours">
                      <p>Hour {index + 1}</p>
                      <Select
                        disabled={!click2}
                        defaultValue={date['hour']}
                        showSearch
                        style={{ width: '120px', float: 'right' }}
                        placeholder="Select Hour"
                        options={Hours}
                        onChange={(value) => onChangedHour(datesB, index, value)}
                      />
                    </div>
                    <div className="day">
                      <p>Day {index + 1}</p>
                      <Select
                        disabled={!click2}
                        defaultValue={date['day']}
                        showSearch
                        style={{ width: '150px', float: 'right' }}
                        placeholder="Select Day"
                        options={Days}
                        onChange={(value) => onChangedDay(datesB, index, value)}
                      />
                    </div>
                  </div>
                ))
                }
                {click2 && (
                  <div className="submit">
                    <Button onClick={handleSubmitB}>Submit</Button>
                  </div>
                )}
              </div>
              </Card>   
            </div>

            <div className="element">
            <Card style={{padding:"10px"}}
            actions={[
            <EditOutlined key="edit" onClick={handleClick3}/>,
            ]}
            >
            <Meta
            title={
                    <span>
                      <span className="circle red-circle" /> Non-Recycable
                    </span>
                  }
            description="This is the description"

            />
            <div>
                <p>Dates</p>
                <IconButton onClick={handleDatesN} disabled={!handleClick3}>
                  <AddIcon /> 
                </IconButton>
                <IconButton disabled={!click3} onClick={() => deleteItem(datesN)}>
                  <RemoveIcon/>
                </IconButton>
                {datesN.map((date, index) => (
                  <div key={index} className="added">
                    <div className="hours">
                      <p>Hour {index + 1}</p>
                      <Select
                        disabled={!click3}
                        defaultValue={date['hour']}
                        showSearch
                        style={{ width: '120px', float: 'right' }}
                        placeholder="Select Hour"
                        options={Hours}
                        onChange={(value) => onChangedHour(datesN, index, value)}
                      />
                    </div>
                    <div className="day">
                      <p>Day {index + 1}</p>
                      <Select
                        disabled={!click3}
                        defaultValue={date['day']}
                        showSearch
                        style={{ width: '120px', float: 'right' }}
                        placeholder="Select Day"
                        options={Days}
                        onChange={(value) => onChangedDay(datesN, index, value)}
                      />
                    </div>
                  </div>
                ))
                }
                {click3 && (
                  <div className="submit">
                    <Button onClick={handleSubmitN}>Submit</Button>
                  </div>
                )}
              </div>
              </Card>
            </div>

          </div>
        )}

      </div>
    </div>


  );
};
export default Schedule
