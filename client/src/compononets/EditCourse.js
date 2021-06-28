import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";
import HrCol from './HrCol';


function EditCourse(props) {
    const [state,setState] = useState(props.data);
    const [users,setUsers] = useState();
    const [departments,setDepartments] = useState();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get('/viewstaff',{
            headers :{
              "Authorization":  props.token
          }}).then((resp)=>{
            setUsers(resp.data)
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
    },[isLoading])
    const setdepartment = (data)=>{
        let newstate = state
        newstate.course.department_id = data
     console.log(newstate)
    console.log("newstate")
        setState(newstate);
    }
    const setUser = (data)=>{
        let newstate = state
        if(state.user){
            newstate.user._id = data;
        }
        else{
            state.user = {_id:data}
        }
        setState(newstate);
        console.log("state")
        console.log(state)
    }

    const onChangeName=(e)=>{
        let newstate = state;
        newstate.course.name=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onchangeRequiredslots=(e)=>{
        let newstate = state;
        newstate.course.required_slots=e.target.value;
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
           let data= {name: state.course.name,coordinator:state.user._id,department_id:state.course.department_id,required_slots:state.course.required_slots};
            axios.post('/course/',data ,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Course Added Successfully",{position: toast.POSITION.TOP_CENTER});
              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
            }
        else{
            let data= {name: state.course.name,coordinator:state.user._id,department_id:state.course.department_id,required_slots:state.course.required_slots};
            axios.put(`/course/${state.course._id}`, data,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Course Updated Successfully",{position: toast.POSITION.TOP_CENTER});

              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
        }
    }
    if(!state.new && !state.course){
        return(

            <Redirect to="/courses"/>
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
                        <input type="text" placeholder={state.course?state.course.name:""} className="form-control" onChange={onChangeName} id="facname"  ></input>
                        </div>
                    </div> 
                    <div className="row mb-3">
                        <label for="reqslots" className="col-sm-3 col-form-label">Required Slots</label>
                        <div className="col-sm-9">
                        <input type="number" placeholder={state.course?state.course.required_slots:""} className="form-control" onChange={onchangeRequiredslots} id="reqslots"  ></input>
                        </div>
                    </div>  
                    <div className="row mb-3">
                    <label for="hod" className="col-sm-3 col-form-label">Coordinator</label>
                    <select id="hod" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setUser(event.target.value)}>
                    <option value={state.user?state.user._id:''}>{state.user?state.user.name:''}</option>
                    {users.map(user => {
                return <option value={user._id}> {user.name} </option>
                             })}
                </select>       
                    </div>  
                    <div className="row mb-3">
                    <label for="faculty" className="col-sm-3 col-form-label">Department</label>
                    <select id="faculty" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setdepartment(event.target.value)}>
                    <option value={state.faculty_id?state.faculty_id:''}>{getdepartmentname}</option>
                    {departments.map(department => {
                return <option value={department._id}> {department.name} </option>
                             })}
                </select>       
                    </div>  

                    <button type="submit" class="btn btn-success btn-lg btn-block">{state.course?"Update":"ADD"}</button>
                <ToastContainer />
                </form>
                </div>
                </div>
                </div>
            )
        }
       
    }
   
}

export default EditCourse
