import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";
import HrCol from './HrCol';


function EditStaff(props) {
    const [state,setState] = useState(props.data);
    const [offices,setOffices] = useState();
    const [departments,setDepartments] = useState();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get('/office',{
            headers :{
              "Authorization":  props.token
          }}).then((resp)=>{
            setOffices(resp.data)
            axios.get('/departments',{
            headers :{
              "Authorization":  props.token
          }}).then((resp)=>{
            setDepartments(resp.data)
            setLoading(false)
          }).catch(err=>{
            toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER});
          })
          }).catch(err=>{
            toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER});
          })
    },[])
    const setdepartment = (data)=>{
        let newstate = state
        newstate.department_id = data
     console.log(newstate)
    console.log("newstate")
        setState(newstate);
    }
    const setOffice = (data)=>{
        let newstate = state
        newstate.office_id = data;
            state.user = {_id:data}
        setState(newstate);
        console.log("state")
        console.log(state)
    }

    const onChangeName=(e)=>{
        let newstate = state;
        newstate.name=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onchangeSalary=(e)=>{
        let newstate = state;
        newstate.salary=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onchangeMail=(e)=>{
        let newstate = state;
        newstate.email=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onChangeRole=(e)=>{
        let newstate = state;
        newstate.role=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onchangeDayOff=(e)=>{
        let newstate = state;
        newstate.day_off=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const getdepartmentname =()=>{
        
        departments.forEach(dep => {
            console.log("dep")
            console.log(dep)
            if(dep._id===state.dep)
                return dep.name
        });
        
    }
    
    const onSubmit =(e)=>{
        e.preventDefault() ;
        if(state.new){
            let data= {office_id:state.office_id,name:state.name,role:state.role,salary:state.salary,email:state.email,department_id:state.department_id,day_off:state.day_off};
            axios.post('/staff/',data ,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Member Added Successfully",{position: toast.POSITION.TOP_CENTER});
              }).catch((err)=>{
                toast.error("Somthing went wrong",{position: toast.POSITION.TOP_CENTER})
              })
            }
        else{
            let data= {office_id:state.office_id,role:state.role,salary:state.salary,department_id:state.department_id,day_off:state.day_off};

            axios.put(`/staff/${state._id}`, data,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Member Updated Successfully",{position: toast.POSITION.TOP_CENTER});

              }).catch((err)=>{
                toast.error("Somthing went wrong",{position: toast.POSITION.TOP_CENTER})
              })
        }
    }
    if(!state.new && !state.name){
        return(

            <Redirect to="/viewstaff"/>
            )
    }
    else{
        if(isLoading){
            return(
            <Nav logout={props.logout}></Nav>
                )
            
        }
        else{
            return (
        
                <div>
                {<Nav logout={props.logout}></Nav>}
                <div className="container row">
                {<HrCol></HrCol>}
                <div className="col-sm-10">
                <form onSubmit = {onSubmit}>
                <div className="row mb-3">
                        <label for="facname" className="col-sm-3 col-form-label">Name</label>
                        <div className="col-sm-9">
                        <input type="text" placeholder={state.name?state.name:""} className="form-control" onChange={onChangeName} id="facname" readonly={state.name?"readonly":false} ></input>
                        </div>
                    </div> 
                    <div className="row mb-3">
                        <label for="reqslots" className="col-sm-3 col-form-label">Salary</label>
                        <div className="col-sm-9">
                        <input type="number" placeholder={state.salary?state.salary:""} className="form-control" onChange={onchangeSalary} id="reqslots"  ></input>
                        </div>
                    </div>  
                    <div className="row mb-3">
                        <label for="email" className="col-sm-3 col-form-label">E-Mail</label>
                        <div className="col-sm-9">
                        <input type="email" placeholder={state.email?state.email:""} className="form-control" onChange={onchangeMail} id="reqslots" readonly={state.email?"readonly":false} ></input>
                        </div>
                    </div>  
                    <div className="row mb-3">
                        <label for="hod" className="col-sm-3 col-form-label">Role</label>
                        <select id="hod" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => onChangeRole(event)}>
                        <option value={state.role?state.role:''}>{state.role?state.role:"Please Select Role"}</option>
                        <option value='HR'>HR</option>
                        <option value='HOD'>HOD</option>
                        <option value='COD'>Coordinator</option>
                        <option value='CI'>Course Instructor</option>
                        <option value='AM'>Acadimic Member</option>
                        </select>       
                    </div>  
                    <div className="row mb-3">
                    <label for="faculty" className="col-sm-3 col-form-label">Department</label>
                    <select id="faculty" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setdepartment(event.target.value)}>
                    <option value={state.department_id?state.department_id:''}>{getdepartmentname}</option>
                    {departments.map(department => {
                return <option value={department._id}> {department.name} </option>
                             })}
                </select>       
                    </div>  
                    <div className="row mb-3">
                    <label for="office" className="col-sm-3 col-form-label">Office</label>
                    <select id="office" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setOffice(event.target.value)}>
                    <option value={state.office_id?state.office_id:''}></option>
                    {offices.map(office => {
                return <option value={office._id}> {office.name} </option>
                             })}
                </select>       
                    </div>  
                    <div className="row mb-3">
                    <label for="faculty" className="col-sm-3 col-form-label">DayOff</label>
                    <select id="faculty" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => onchangeDayOff(event)}>
                    <option value={state.day_off?state.day_off:''}></option>
                    <option value='0'>Sunday</option>
                    <option value='1'>Monday</option>
                    <option value='2'>Tuesday</option>
                    <option value='3'>Wednesday</option>
                    <option value='4'>Thursday</option>
                    <option value='5'>Friday</option>
                    <option value='6'>Saturday</option>
                     </select>       
                    </div>  
                    <button type="submit" class="btn btn-success btn-lg btn-block">{state.name?"Update":"ADD"}</button>
                <ToastContainer />
                </form>
                </div>
                </div>
                </div>
            )
        }
       
    }
   
}

export default EditStaff
