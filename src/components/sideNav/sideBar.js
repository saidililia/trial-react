import React from "react";
import {Flex, Menu} from 'antd'
import { faLeaf } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () =>{
    return (
        <div>
            <Flex align="center" justify="center">
            <div className="logo">
            <faLeaf/>
            </div>
            </Flex>
            <Menu mode="inline" defaultSelectedKeys={['1']} className="menu-bar"/>
        </div>
    );
};

export default Sidebar;