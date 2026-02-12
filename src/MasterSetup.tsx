import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

const IconPlus = FaPlus as any;
const IconTrash = FaTrash as any;

function MasterSetup() {
  const [activeTab, setActiveTab] = useState("dept"); 
  const [inputText, setInputText] = useState("");
  const [selectedDept, setSelectedDept] = useState(""); 
  
  const [listData, setListData] = useState<any[]>([]);
  const [deptList, setDeptList] = useState<any[]>([]);

  // 1. FETCH DATA HELPER
  const fetchData = async () => {
    try {
        let endpoint = "";
        if (activeTab === "dept") endpoint = "departments";
        else if (activeTab === "religion") endpoint = "religions";
        else if (activeTab === "country") endpoint = "countries";
        
        if (activeTab === "role") return; 

        if(endpoint) {
            // UPDATED URL HERE:
            const res = await axios.get(`https://employee-api-p2ts.onrender.com/master/${endpoint}`);
            setListData(res.data);
        }
    } catch (err) { console.error(err); }
  };

  // 2. LOAD DEPARTMENTS
  useEffect(() => {
    // UPDATED URL HERE:
    axios.get("https://employee-api-p2ts.onrender.com/master/departments").then(res => setDeptList(res.data));
  }, []);

  // 3. TAB CHANGE HANDLER
  useEffect(() => {
    setListData([]); 
    setInputText(""); 
    setSelectedDept(""); 
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); 

  // 4. LOAD ROLES WHEN DEPT SELECTED
  useEffect(() => {
    const fetchRoles = async () => {
        if (activeTab === "role" && selectedDept) {
            try {
                // UPDATED URL HERE:
                const res = await axios.get(`https://employee-api-p2ts.onrender.com/master/designations/${selectedDept}`);
                setListData(res.data); 
            } catch (err) { console.error(err); }
        }
    };
    fetchRoles();
  }, [selectedDept, activeTab]); 


  // --- SAVE FUNCTION ---
  const handleSave = async () => {
    if (!inputText.trim()) return alert("Please enter the Name");
    if (activeTab === "role" && !selectedDept) return alert("Select a department first");
   
    const alreadyExists = listData.some((item: any) => 
        item.name.toLowerCase() === inputText.trim().toLowerCase()
    );

    if (alreadyExists) {
        alert(`"${inputText}" already exists!`);
        return; 
    }

    try {
        // UPDATED URL HERE:
        await axios.post("https://employee-api-p2ts.onrender.com/master/add", {
            type: activeTab,
            name: inputText,
            dept_name: selectedDept
        });
        alert("Saved Successfully!");
        setInputText("");

        if (activeTab === "role") {
             const res = await axios.get(`https://employee-api-p2ts.onrender.com/master/designations/${selectedDept}`);
             setListData(res.data);
        } else {
             fetchData();
             if(activeTab === "dept") {
                const res = await axios.get("https://employee-api-p2ts.onrender.com/master/departments");
                setDeptList(res.data);
             }
        }
    } catch (err) {
        alert("Failed to save.");
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id: number) => {
      if(!window.confirm("Are you sure you want to delete this?")) return;

      try {
          // UPDATED URL HERE:
          await axios.delete(`https://employee-api-p2ts.onrender.com/master/${activeTab}/${id}`);
          
          setListData(listData.filter(item => item.id !== id));
          
          if(activeTab === "dept") {
              setDeptList(deptList.filter(d => d.id !== id));
          }

      } catch (err) {
          alert("Error deleting. This item might be used by an Employee.");
      }
  };

  return (
    <div className="container">
      <h2 className="text-primary mb-4">Master Data Configuration</h2>

      <div className="btn-group mb-4 w-100 shadow-sm">
        <button className={`btn ${activeTab==='dept'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setActiveTab('dept')}>Department</button>
        <button className={`btn ${activeTab==='role'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setActiveTab('role')}>Designation</button>
        <button className={`btn ${activeTab==='religion'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setActiveTab('religion')}>Religion</button>
        <button className={`btn ${activeTab==='country'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setActiveTab('country')}>Country</button>
      </div>

      <div className="card p-4 shadow-sm border-0 bg-light mb-4">
          
          {activeTab === "role" && (
              <div className="mb-3">
                  <label className="fw-bold">Select Department:</label>
                  <select className="form-select" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                      <option value="">-- Select --</option>
                      {deptList.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
              </div>
          )}

          <label className="fw-bold">
              New {activeTab === 'dept' ? 'Department' : activeTab === 'role' ? 'Designation' : activeTab === 'religion' ? 'Religion' : 'Country'} Name:
          </label>
          <div className="d-flex gap-2">
              <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Type here..." 
                  value={inputText} 
                  onChange={e => setInputText(e.target.value)}
              />
              <button className="btn btn-success px-4" onClick={handleSave}>
                  <span><IconPlus/></span> Save
              </button>
          </div>
      </div>

      <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white">
              Existing Data {activeTab === 'role' && selectedDept ? `for ${selectedDept}` : ''}
          </div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0 align-middle">
                <thead>
                    <tr>
                        <th style={{width: '10%'}}>ID</th>
                        <th>Name</th>
                        <th className="text-end pe-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listData.map((item: any, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td className="text-end pe-4">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                    <span><IconTrash /></span> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {listData.length === 0 && (
                        <tr><td colSpan={3} className="text-center">
                            {activeTab === 'role' && !selectedDept 
                                ? "Please Select a Department to view Roles" 
                                : "No Data Found"}
                        </td></tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}

export default MasterSetup;