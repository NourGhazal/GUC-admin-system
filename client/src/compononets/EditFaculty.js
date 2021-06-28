import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";


function EditFaculty(props) {
    const [state,setState] = useState(props.data);
    useEffect(()=>{

    },[state])
    console.log("lo props")
    
    console.log(props.data);
    const onChangeName=(e)=>{
        let newstate = state;
        newstate.name=e.target.value;
       setState(newstate);
        console.log(state);
    }
    const onSubmit =(e)=>{
        e.preventDefault() ;
        if(state.new){
           
            axios.post('/faculty/', {name: state.name},{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Faculty Added Successfully",{position: toast.POSITION.TOP_CENTER});
              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
            }
        else{
            axios.put(`/faculty/${state._id}`, {name: state.name},{
                headers :{
                  "Authorization":  props.token
              }}).then((resp)=>{
                toast.success("Faculty Updated Successfully",{position: toast.POSITION.TOP_CENTER});

              }).catch((err)=>{
                toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
              })
        }
    }
    if(!state.new && !state.name){
        return(

            <Redirect to="/faculties"/>
            )
    }
    else{
        return (
        
            <div>
            {<Nav logout={props.logout}></Nav>}
            <div className="container">
            <form onSubmit = {onSubmit}>
                <div className="row mb-3">
                    <label for="facname" className="col-sm-3 col-form-label">Name</label>
                    <div className="col-sm-9">
                    <input type="text" placeholder={state.name?state.name:""} className="form-control" onChange={onChangeName} id="facname"  ></input>
                    </div>
                </div>           
                <button type="submit" class="btn btn-success btn-lg btn-block">{state.name?"Update":"ADD"}</button>
            <ToastContainer />
            </form>
            </div>
            </div>
        )
    }
   
}

export default EditFaculty
