import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faUser, faCalendarDays, faTableColumns, faBell, faBed } from '@fortawesome/free-solid-svg-icons'
import './sideNav.css'
import { Link } from 'react-router-dom';

function SideNav() {
    return(
        <div className="nav">
        <aside>
        <div className="logo">
        <FontAwesomeIcon icon={faLeaf}  size="3x" style={{float: "left"}}/>
        <p>GREEN.</p>
        </div>   
      
        <div className="elements">
        <ul>
                <li>
                <Link to="/Dashboard">
                <FontAwesomeIcon icon={faTableColumns} className="icon" style={{marginInline: 20, color:"black", }} size={70}/>
                  <span>Dashboard</span>
                </Link>
                </li>

                <li>
                <Link to="/Schedule">
                <FontAwesomeIcon icon={faCalendarDays} style={{marginInline: 20, color:"black"}}/>
                  <span>Schedule</span>
                </Link>
                </li>

                <li>
                <Link to="/Clients">
                <FontAwesomeIcon icon={faUser} style={{marginInline: 20, color:"black"}}/>
                  <span>Clients</span>
                </Link>
                </li>

                <li>
                <Link to='/Requests'>
                <FontAwesomeIcon icon={faBell} style={{marginInline: 20, color:"black"}}/>
                  <span>Notifications</span>
                </Link>
                  
                </li>
            </ul>
        </div>
            
        </aside>

        </div>
    )

}

export default SideNav