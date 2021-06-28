import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";
import HrCol from './HrCol';


function EditDepartment(props) {
    const [state,setState] = useState(props.data);
    const [users,setUsers] = useState();
    const [faculties,setFaculties] = useState();
    const [isLoading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get('/viewstaff',{
            headers :{
              "Authorization":  props.token
          }}).then((resp)=>{
            setUsers(resp.data)
            axios.get('/faculties',{
            headers :{
              "Authorization":  props.token
          }}).then((resp)=>{
            setFaculties(resp.data)
            setLoading(false)
          }).catch(err=>{
            toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER});
          })
          }).catch(err=>{
            toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER});
          })
    },[isLoading])
    const setFaculty = (data)=>{
        let newstate = state
        newstate.faculty_id = data
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
        newstate.name=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const getfacultyname =()=>{
        let returnfac='';
        faculties.forEach(fac => {
            console.log("fac")
            console.log(fac)
            if(fac._id===state.faculty_id)
                return fac.name
        });
        
    }
    
    const onSubmit =(e)=>{
        e.preventDefault() ;
        if(state.new){
           let data= {name: state.name,hod:state.user._id,faculty_id:state.faculty_id};
            axios.post('/department/',data ,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Department Added Successfully",{position: toast.POSITION.TOP_CENTER});
              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
            }
        else{
            let data= {name: state.name,hod:state.user._id};
            axios.put(`/department/${state._id}`, data,{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Department Updated Successfully",{position: toast.POSITION.TOP_CENTER});

              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
        }
    }
    if(!state.new && !state.name){
        return(

            <Redirect to="/departments"/>
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
                        <input type="text" placeholder={state.name?state.name:""} className="form-control" onChange={onChangeName} id="facname"  ></input>
                        </div>
                    </div>  
                    <div className="row mb-3">
                    <label for="hod" className="col-sm-3 col-form-label">HOD</label>
                    <select id="hod" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setUser(event.target.value)}>
                    <option value={state.user?state.user._id:''}>{state.user?state.user.name:''}</option>
                    {users.map(user => {
                return <option value={user._id}> {user.name} </option>
                             })}
                </select>       
                    </div>  
                    <div className="row mb-3">
                    <label for="faculty" className="col-sm-3 col-form-label">Faculty</label>
                    <select id="faculty" className="form-select form-select-lg mb-3 col-sm-9" onChange={(event) => setFaculty(event.target.value)}>
                    <option value={state.faculty_id?state.faculty_id:''}>{getfacultyname}</option>
                    {faculties.map(faculty => {
                return <option value={faculty._id}> {faculty.name} </option>
                             })}
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

export default EditDepartment
