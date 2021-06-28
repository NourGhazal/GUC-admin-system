import React,  { component } from 'react';
import { Component } from 'react';
import axios from 'axios';
// import $ from 'jquery';
import Nav from '../compononets/Nav';
import "../css/UpdateProfile.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';


export default class ResetPassword extends Component 
{
    constructor(props)
    {
        super(props);


        this.state = {
            user : null,
            once : -1 ,
            newPass : "",
            confirm : ""
        }
        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.onChangePersonal = this.onChangePersonal.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    
    componentDidMount()
    {
        axios.get('/viewprofile',{
            headers :{
              "Authorization":  this.props.token
          }}).then((resp)=>{
              
            this.setState({
                user : resp.data,
                once : 1 
                
            })
            
           
        })
    }
     onChangeEmail (evt) {
        this.setState({
            newPass : evt.target.value
        })
        
      };
      onChangePersonal (evt) {
        this.setState({
            confirm : evt.target.value
        })
        
      }
    onSubmit(e){
        e.preventDefault() ;
        let  data ={
    
            password:this.state.newPass,
            confirm:this.state.confirm
        }
        // this.setState({
        //     newPersonal : "",
        //     newEmail : ""
        // })
       console.log(data);
        axios.post('/resetPassword',data).then((resp) => {
        toast.success("Password Updated ! ",{position: toast.POSITION.TOP_CENTER});
}).catch((err)=>{
  
  toast.error(err,{position: toast.POSITION.TOP_CENTER});
});
    }
    render()
    {
        if(this.state.once === 1 && this.state.user) {
            return (<div className="container">
        <div>{<Nav logout={this.props.logout}></Nav>}</div>
            
        <div className="container form">
        <form onSubmit = {this.onSubmit}>
            <div className="row mb-3">
                <label for="password" className="col-sm-2 col-form-label">New</label>
                <div className="col-sm-10">
                <input type="password" className="form-control" onChange={this.onChangeEmail} id="password"  ></input>
                </div>
            </div>
            <div className="row mb-3">
                <label for="confirm" className="col-sm-2 col-form-label">Confirm</label>
                <div className="col-sm-10">
                <input type="password" className="form-control" onChange={this.onChangePersonal} id="confirm"  ></input>
                </div>
            </div>
            
                
            
            <button type="submit" class="btn btn-success">Reset</button>
        </form>
        </div>
        <ToastContainer />
    </div>)}
        
        this.componentDidMount();
        return <div>
            <h3>LOADING ... </h3>
        <ToastContainer />
        </div>
        
    }
}