import React,  { component } from 'react';
import { Component } from 'react';
import axios from 'axios';
// import $ from 'jquery';
import Nav from '../compononets/Nav';
import "../css/UpdateProfile.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';


export default class UpdateProfile extends Component 
{
    constructor(props)
    {
        super(props);


        this.state = {
            user : null,
            once : -1 ,
            newEmail : "",
            newPersonal : ""
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
            newEmail : evt.target.value
        })
        
      };
      onChangePersonal (evt) {
        this.setState({
            newPersonal : evt.target.value
        })
        
      }
    onSubmit(e){
        e.preventDefault() ;
        let  data ={
    
            email:this.state.newEmail,
            personal_info:this.state.newPersonal
        }
        // this.setState({
        //     newPersonal : "",
        //     newEmail : ""
        // })
       console.log(data);
        axios.put('/updateprofile',data).then((resp) => {

        toast.success("Profile Updated ! ",{position: toast.POSITION.TOP_CENTER});
}).catch((err)=>{
  console.log(err)
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
                <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                <input type="email" className="form-control" onChange={this.onChangeEmail} id="inputEmail3"  ></input>
                </div>
            </div>
            <div class="row mb-3">
                <label for="personal" className="col-sm-2 col-form-label">Info</label>
                <div class="col-sm-10">
                <textarea type="text" onChange = {this.onChangePersonal}  className="form-control" id="personal" ></textarea>
                </div>
            </div>
            
                
            
            <button type="submit" class="btn btn-success">Update</button>
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