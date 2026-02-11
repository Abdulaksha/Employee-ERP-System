import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';


import { FaUserPlus, FaListAlt, FaBuilding, FaMoneyBillWave, FaCogs } from "react-icons/fa";


import './App.css';


import Inputemp from './Inputemployee';
import ListEmployee from './Listemp';
import MasterSalary from './Master';
import MasterSetup from './MasterSetup'; 


const IconUser = FaUserPlus as any;
const IconList = FaListAlt as any;
const IconBuild = FaBuilding as any;
const IconMoney = FaMoneyBillWave as any;
const IconCogs = FaCogs as any; 

function App() {
  return (
    <BrowserRouter>
      <div className="dashboard-container">
        
      
        <div className="sidebar">
          <div className="brand-title">
            <span><IconBuild style={{ marginRight: '10px' }} /></span>
            HR PORTAL
          </div>

          <nav>
            
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span><IconUser /></span>
              <span style={{ marginLeft: '10px' }}>Add Employee</span>
            </NavLink>

            
            <NavLink 
              to="/list" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span><IconList /></span>
              <span style={{ marginLeft: '10px' }}>Employee List</span>
            </NavLink>

           
            <NavLink 
              to="/salary" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span><IconMoney /></span>
              <span style={{ marginLeft: '10px' }}>Salary Setup</span>
            </NavLink>

           
            <NavLink 
              to="/master" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span><IconCogs /></span>
              <span style={{ marginLeft: '10px' }}>Master Config</span>
            </NavLink>
          </nav>
        </div>

       
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Inputemp />} />
            <Route path="/list" element={<ListEmployee />} />
            <Route path="/salary" element={<MasterSalary />} />
            <Route path="/master" element={<MasterSetup />} /> 
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;