import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaSave, FaMoneyBillWave } from "react-icons/fa";


const IconPlus = FaPlus as any;
const IconTrash = FaTrash as any;
const IconSave = FaSave as any;
const IconMoney = FaMoneyBillWave as any;

interface Employee {
  emp_id: number;
  name: string;
  code: string;
  role: string;
}

interface SalaryRow {
  id: number;
  comp_code: string;
  comp_name: string;
  amount: number;
}

const SALARY_TYPES = [
  { code: "BASIC", name: "Basic Salary" },
  { code: "DA", name: "Dearness Allowance" },
  { code: "HRA", name: "House Rent Allowance" },
  { code: "TA", name: "Transport Allowance" },
  { code: "PF", name: "Provident Fund" },
  { code: "OT", name: "Overtime" },
  { code: "BONUS", name: "Performance Bonus" }
];

function Master() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [searchCode, setSearchCode] = useState(""); 
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("");
  

  const [salaryCache, setSalaryCache] = useState<Record<number, Record<string, number>>>({});
  const [rows, setRows] = useState<SalaryRow[]>([
    { id: Date.now(), comp_code: "", comp_name: "", amount: 0 }
  ]);



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/employees");
        console.log("Employees Loaded:", res.data); 
        setEmployees(res.data);
      } catch (err) {
        console.error("Error loading employees. Is Server Running?", err);
      }
    };
    fetchEmployees();
  }, []);

 
  const handleEmpSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchCode(inputValue);

   
    const potentialCode = inputValue.split("-")[0].trim(); 

    const foundEmp = employees.find(emp => 
        emp.code.toLowerCase() === potentialCode.toLowerCase() || 
        emp.code.toLowerCase() === inputValue.trim().toLowerCase() ||
        emp.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    
    if (foundEmp) {
        console.log("Found Employee:", foundEmp.name);
        setEmpName(foundEmp.name);
        setEmpRole(foundEmp.role);
        

        try {
            const res = await axios.get(`http://localhost:5000/salary/${foundEmp.code}`);
            
            if (res.data.length > 0) {
             
              const rowsWithIds = res.data.map((r: any, idx: number) => ({
                ...r,
                id: Date.now() + idx
              }));
              setRows(rowsWithIds);
              
            
              const newCache: any = {};
              rowsWithIds.forEach((r: SalaryRow) => {
                newCache[r.id] = { [r.comp_code]: Number(r.amount) };
              });
              setSalaryCache(newCache);

            } else {
              
              setRows([{ id: Date.now(), comp_code: "", comp_name: "", amount: 0 }]);
              setSalaryCache({});
            }
        } catch (err) { console.error(err); }

    } else {

      setEmpName(""); 
        setEmpRole("");


        if (inputValue === "") {
             setRows([{ id: Date.now(), comp_code: "", comp_name: "", amount: 0 }]);
        }
    }
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), comp_code: "", comp_name: "", amount: 0 }]);
  };

  const removeRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (index: number, field: keyof SalaryRow, value: any) => {
    const newRows = [...rows];
    const rowId = newRows[index].id;

    if (field === "comp_code") {
      newRows[index].comp_code = value;
      const foundType = SALARY_TYPES.find(t => t.code === value);
      newRows[index].comp_name = foundType ? foundType.name : "";

      
      const cachedAmount = salaryCache[rowId]?.[value] || 0;
      newRows[index].amount = cachedAmount; 

    } else if (field === "amount") {
      newRows[index].amount = value;
      

      const currentCode = newRows[index].comp_code;
      if (currentCode) {
        setSalaryCache(prev => ({
          ...prev,
          [rowId]: { ...(prev[rowId] || {}), [currentCode]: Number(value) }
        }));
      }
    } else {
      newRows[index] = { ...newRows[index], [field]: value };
    }
    setRows(newRows);
  };

  const totalSalary = rows.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const saveSalary = async () => {
    if (!searchCode || !empName) {
        alert("Please Select a Valid Employee from the Database!");
        return;
    }


    const actualCode = searchCode.split("-")[0].trim();

    try {
        const body = { emp_code: actualCode, rows: rows };
        await axios.post("http://localhost:5000/salary", body);
        alert("Salary Structure Saved Successfully!");
      setSearchCode("");
        setEmpName("");
     setEmpRole("");
     setSalaryCache({});
     setRows([{ id:Date.now(),comp_code:"",comp_name:"",amount:0}])

    } catch (err: any) {
        console.error(err);
        if(err.response && err.response.data) {
            alert("Error: " + JSON.stringify(err.response.data));
        } else {
            alert("Failed to Save Salary.");
        }
    }
  };

  return (
    <div className="container">
      
      <div className="d-flex align-items-center mb-4">
         <h2 className="text-primary" style={{ borderBottom: "3px solid #0d6efd", paddingBottom: "5px" }}>
            <span><IconMoney className="me-2"/></span>
            Salary Master Setup
         </h2>
      </div>

      <div className="card p-4 mb-4 shadow-sm border-0 bg-light">
        <div className="row g-3">
            <div className="col-md-4">
                <label className="form-label fw-bold text-secondary">Search Employee:</label>
                <input 
                    type="text" 
                    className="form-control border-primary"
                    list="employee-options" 
                    placeholder="Type Name or Code..."
                    value={searchCode}
                    onChange={handleEmpSearch}
                />

                <datalist id="employee-options">
                    {employees.map(emp => (
                        <option key={emp.emp_id} value={`${emp.code} - ${emp.name}`} />
                    ))}
                </datalist>
            </div>
            <div className="col-md-4">
                <label className="form-label fw-bold text-secondary">Employee Name:</label>
                <input type="text" className="form-control bg-white fw-bold" value={empName} readOnly />
            </div>
            <div className="col-md-4">
                <label className="form-label fw-bold text-secondary">Designation / Role:</label>
                <input type="text" className="form-control bg-white fw-bold text-uppercase" value={empRole} readOnly />
            </div>
        </div>
      </div>

      <div className="card p-4 shadow border-0">
        <h5 className="mb-3">Salary Components</h5>
        
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{width: '30%'}}>Type (No. - Name)</th>
              <th style={{width: '30%'}}>Description (Auto)</th>
              <th style={{width: '25%'}}>Amount</th>
              <th style={{width: '15%'}} className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <select 
                    className="form-select"
                    value={row.comp_code}
                    onChange={(e) => handleInputChange(index, "comp_code", e.target.value)}
                  >
                    <option value="">-- Select Type --</option>
                    {SALARY_TYPES.map((type, i) => {
                      const number = (i + 1).toString().padStart(2, '0');
                      return (
                        <option key={type.code} value={type.code}>
                          {number} - {type.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control bg-light" value={row.comp_name} readOnly />
                </td>
                <td>
                  <div className="input-group">
                    <span className="input-group-text" style={{
                         position: 'relative', 
                      display: 'flex', 
                      justifyContent: 'center', 
                       alignItems: 'center' ,
                       minWidth: '40px'
                    }} >
                    < span  style={{
                      position:'absolute',
                      height:'4px',
                      width:'40%',
                      borderTop:'1px solid black',
                      borderBottom:'1px solid black',
                      top: '45%'
                    }}/>
                      <span style={{
                        position:'relative',
                       top: '0px',          
                   fontWeight: 'bold',
                   fontSize: '19px',
                     zIndex: 2,           
                     padding: '0 2px' 
                      }}>D</span>
        </span>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={row.amount} 
                        onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                    />
                  </div>
                </td>
                <td className="text-center">
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeRow(index)}>
                    <span><IconTrash /></span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row mt-4 align-items-center">
          <div className="col-md-4">
              <button className="btn btn-secondary" onClick={addRow}>
                <span><IconPlus className="me-2"/></span> Add Row
              </button>
          </div>
<div className="col-md-4 text-center">
    <h4 className="d-flex justify-content-center align-items-center m-0">
        Total: 
        
 <span className="text-success ms-2 me-1" style={{ 
            position: 'relative', 
            display: 'inline-flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minWidth: '20px'
        }}>
            
          
            <span style={{
                position: 'relative',
                top: '1px',
                fontWeight: 'bold',
                fontSize: '25px',
                color: '#198754',
                zIndex: 1,       
                
            }}>
                D
            </span>

            
            <span style={{
                position: 'absolute',
                width: '120%',       
                height: '6px',         
                borderTop: '2px solid #198754',
                borderBottom: '2px solid #198754',
                top: '45%',          
                left: '-10%',        
                zIndex: 2             
            }}/>

        </span>
        <span className="text-success fw-bold">
             {totalSalary}
        </span>
    </h4>
</div>
          <div className="col-md-4 text-end">
             <button className="btn btn-primary px-4 py-2 shadow-sm" onClick={saveSalary}>
                <span><IconSave className="me-2"/></span> Save Salary
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Master;