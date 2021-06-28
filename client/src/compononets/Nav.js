import React, { useState, useEffect,useRef } from 'react';
import {Redirect} from "react-router";
import axios from "axios";




function Nav(props) {
  const [state, setstate] = useState({redirect:''})
  useEffect(() => {
    if(state.redirect) return <Redirect to = {state.redirect} /> 
  })
  const onSubmit= (e)=>{
    e.preventDefault(); 
    
  
    axios.post("/logout",{},{ headers :{
      "Authorization":  props.token
  }}).then((res) =>{

        console.log("Succ")
        console.log(res)
        setstate({
            redirect : '/login'
        })
        props.logout();
      } );

   
}
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">GUC</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
           
            <a class="nav-link active" aria-current="page" href = "/">Home</a>
            </li>
        </ul>
        
        </div>
        <form class="d-flex" onSubmit = {onSubmit}>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
            
            <a class="nav-link active" aria-current="page" href = "/viewprofile">Profile</a>
            </li>
            <li class="nav-item">
            <input class="nav-link active btn btn-danger" type = "submit"  value = "Logout" ></input>
               
            </li>
        </ul>
        </form>
        
    </div>
</nav>

  )
}

export default Nav
