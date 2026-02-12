import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus,FaTrash } from "react-icons/fa";
import { error } from "console";


const IconPlus = FaPlus as any;
const IconTrash = FaTrash as any;

function MasterSetup() {

  const [activeTab, setActiveTab] = useState("dept");
  const [inputText, setInputText] = useState("");
  const [selectedDept, setSelectedDept] = useState(""); 
  
 
  const [listData, setListData] = useState<any[]>([]);
  
 
  const [deptList, setDeptList] = useState<any[]>([]);


  const fetchData = async () => {
    try {
        let endpoint = "";

        if (activeTab === "dept") endpoint = "departments";
        else if (activeTab === "religion") endpoint = "religions";
        else if (activeTab === "country") endpoint = "countries";
        else if (activeTab === "role") {

            setListData([]); 
             return; 
        }
         
        if(activeTab==="role")return;
        if(endpoint) {
            const res = await axios.get(`https://employee-api-p2ts.onrender.com/master/${endpoint}`);
            setListData(res.data);
        }
    } catch (err) {
        console.error(err);
    }
  };


  
  
  useEffect(() => {
    axios.get("https://employee-api-p2ts.onrender.com/master/departments").then(res => setDeptList(res.data));
  }, []);

  
  useEffect(() => {
    fetchData(); 
    setInputText(""); 
    setSelectedDept("");
  }, [activeTab]);


   useEffect(() => {
    const fetchRoles = async () => {
        if (activeTab === "role" && selectedDept) {
            try {
               
                const res = await axios.get(`https://employee-api-p2ts.onrender.com/master/designations/${selectedDept}`);
                setListData(res.data); 
            } catch (err) { console.error(err); }
        }
    };
    fetchRoles();
  }, [selectedDept, activeTab]);



  const handleSave = async () => {
    if (!inputText) return alert("Please enter the Name");
    if (activeTab === "role" && !selectedDept) return alert("Select a department first");
   
   

    const alreadyExists = listData.some((item: any) => 
        item.name.toLowerCase() === inputText.trim().toLowerCase()
    );

    if (alreadyExists) {
        alert(`"${inputText}" already exists!`);
        return; 
    }

    try {
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
        alert("Failed to save. Item might already exist.");
    }
  };

  const handelet=async(id:number)=>{
      if(!window.confirm("Are u sure to delete this")) return;
        try{
            await axios.delete(`https://employee-api-p2ts.onrender.com/master/${activeTab}/${id}`)
          
            setListData(listData.filter(item=>item.id!==id))
            if(activeTab==="dept"){
                setDeptList(deptList.filter(d=>d.id!==id))
            }
            alert("Deleted Successfully")
        }
        catch (err){
         alert("error deleting in this data")
        }
  }
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
                  <select className="form-select" onChange={e => setSelectedDept(e.target.value)}>
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
              Existing Data
          </div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {listData.map((item: any, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td className="text-end pe-4">
                                <button className="btn btn-danger btn-sm" onClick={() => handelet(item.id)}>
                                    <span><IconTrash /></span> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {listData.length === 0 && (
                        <tr><td colSpan={2} className="text-center">No Data Found / Select a Tab</td></tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
export default MasterSetup;