
import React,{useEffect, useState} from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Employee{
    emp_id:number;
    name: string;
    code: string;
    role: string;
    email: string;
    doj: string;
    department: string;
    country:string;
    religion: string;

}

function Listemp(){

    const [employees,setEmployees]=useState<Employee[]>([]); 
const [searchTerm, setSearchTerm] = useState("");
const[sortType,setSortType]=useState("default");

useEffect(()=>{
       const getemployee=async()=>{
        try{
          const response=await axios.get("https://employee-api-p2ts.onrender.com/employees")
        setEmployees(response.data);
    }
        
        catch(err){
            console.log(err);
                alert("employee not available")
        }
    };

getemployee();
}
,[]);
 const filteredEmployees = employees
    .filter((emp) => {
            const term=searchTerm.toLowerCase();
            const formattedDate = new Date(emp.doj).toLocaleDateString();
        return(
         emp.name.toLowerCase().includes(term)||
            emp.code.toLowerCase().includes(term)||
            emp.role.toLowerCase().includes(term)||
            formattedDate.includes(term)
    );

    });

    filteredEmployees.sort((a,b)=>{
      if(sortType==="name")
      {
        return a.name.localeCompare(b.name);
      }
      else if(sortType==="code")
        {
          return a.code.localeCompare(b.code);
      }
      return 0;
    })

      const generatepdf=()=>{
            const doc=new jsPDF();
         doc.text("Employee report",14,10)

         autoTable(doc,{
          html:'#employee-table',
          theme:'grid',
         }
         );
         doc.save('Employee_List.pdf')
      }

      const hanprint=()=>{
        window.print();
      }


return(
   <div className="container mt-5">
      <h2 className="text-center">Employee List</h2>

      <div className="d-flex justify-content-between mb-3 mt-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

<div className="col-md-12 d-flex justify-content-end gap-2">
  <button className="btn btn-danger" onClick={generatepdf}>EXPORT PDF</button>
<button className="btn btn-secondary" onClick={hanprint}>
                Print List
            </button>


</div>




       <div className="col-md-3">
        <select
          className="form-select"
          onChange={(e)=>setSortType(e.target.value)}
        >
            <option value={"default"}>SORT BY ID</option>
            <option value={"name"}>SORT BY NAME</option>
            <option value={"code"}>SORT BY CODE</option>
          </select>
       </div>

     
      <table  id="employee-table" className="table table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Email</th>
            <th>Date Of Joining</th>
            <th>Country</th>
            <th>Religion</th>
          </tr>
        </thead>
        <tbody>
            {filteredEmployees.map((emp)=>(
                <tr key={emp.emp_id}>
                <td>{emp.code}</td>
              <td className="fw-bold">{emp.name}</td>
              <td> {emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.email}</td>
              <td>{new Date(emp.doj).toLocaleDateString()}</td>
              <td> {emp.country}</td>
              <td>{emp.religion}</td>
                </tr>
            ) )
            }

{filteredEmployees.length === 0 && (
            <tr><td colSpan={8} className="text-danger">No Employee Found</td></tr>
          )}



        </tbody>
        
      </table>
    </div>
  );
}

export default Listemp;

