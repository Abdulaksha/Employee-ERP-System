import React, { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";

const IconUserPlus = FaUserPlus as any;

function Inputemp() {
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [doj, setDoj] = useState("");
  
  
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [religion, setReligion] = useState("");
  const [country, setCountry] = useState("");

  

  const [deptList, setDeptList] = useState<any[]>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [religionList, setReligionList] = useState<any[]>([]);
  const [countryList, setCountryList] = useState<any[]>([]);

  
  useEffect(() => {
    const loadMasters = async () => {
        try {
            const depts = await axios.get("http://localhost:5000/master/departments");
            const rels = await axios.get("http://localhost:5000/master/religions");
            const countries = await axios.get("http://localhost:5000/master/countries");
            
            setDeptList(depts.data);
            setReligionList(rels.data);
            setCountryList(countries.data);
        } catch(err) { console.error("Error loading master data", err); }
    };
    loadMasters();
  }, []);

  
  const handleDeptChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedDept = e.target.value;
      setDepartment(selectedDept);
      setRole(""); 


      
      if(selectedDept) {
          try {
            const res = await axios.get(`http://localhost:5000/master/designations/${selectedDept}`);
            setRoleList(res.data);
          } catch(err) { console.error(err); }
      } else {
          setRoleList([]);
      }
  };

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !code || !department || !role || !email || !doj ||!religion||!country) {
      alert("Please Fill All the Fields");
      return;
    }

    const alphanumeric = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
    if (!alphanumeric.test(code)) {
      alert("Employee Code must be letters and numbers (e.g. EMP001)");
      return;
    }

    try {
      const body = { name, code, department, role, email, doj, religion, country };
      await axios.post("http://localhost:5000/employees", body);

      alert("Employee added Successfully");
      
      // Reset
      setName(""); setCode(""); setEmail(""); setDoj("");
      setDepartment(""); setRole(""); setReligion(""); setCountry("");
      setRoleList([]);

    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) alert(err.response.data);
      else alert("Failed to Save Data");
    }
  };

  return (
    <div className="container">
      
     
      <div className="d-flex align-items-center mb-4">
         <h2 className="text-primary" style={{ borderBottom: "3px solid #0d6efd", paddingBottom: "5px" }}>
            <span><IconUserPlus className="me-2"/></span>
            New Employee Onboarding
         </h2>
      </div>

      <form onSubmit={onSubmitForm}>
        <div className="card shadow border-0">
            <div className="card-header bg-dark text-white p-3">
                <h5 className="mb-0">Employee Details Form</h5>
            </div>
            
            <div className="card-body p-4 bg-light">
                

                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Full Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Employee Code <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="e.g. EMP001" value={code} onChange={e => setCode(e.target.value)} />
                    </div>
                </div>


                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Email Address <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Date of Joining <span className="text-danger">*</span></label>
                        <input type="date" className="form-control" value={doj}
                        max="9999-12-31"
                        onChange={e => setDoj(e.target.value)} />
                    </div>
                </div>

                <hr className="my-4 text-muted" />


                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Department <span className="text-danger">*</span></label>
                        <select className="form-select" value={department} onChange={handleDeptChange}>
                            <option value="">-- Select Department --</option>
                            {deptList.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Designation <span className="text-danger">*</span></label>
                        <select className="form-select" value={role} onChange={e => setRole(e.target.value)} disabled={!department}>
                            <option value="">{department ? "-- Select Role --" : "-- Select Dept First --"}</option>
                            {roleList.map((r: any) => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                    </div>
                </div>


                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Religion</label>
                        <select className="form-select" value={religion} onChange={e => setReligion(e.target.value)}>
                            <option value="">-- Select --</option>
                            {religionList.map((r: any) => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">Country</label>
                        <select className="form-select" value={country} onChange={e => setCountry(e.target.value)}>
                            <option value="">-- Select --</option>
                            {countryList.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

            </div>


            <div className="card-footer bg-white p-3 text-end">
                <button className="btn btn-secondary me-2"  >Cancel</button>
                <button type="submit" className="btn btn-primary px-5">Save Employee</button>
            </div>
        </div>
      </form>
    </div>
  );
}

export default Inputemp;