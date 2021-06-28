import React,  { component } from 'react';
import { Component } from 'react';
import axios from 'axios';
// import $ from 'jquery';
import Nav from '../compononets/Nav';
import "../css/Profile.css"



export default class ProfilePage extends Component 
{
    constructor(props)
    {
        super(props);


        this.state = {
            user : null,
            once : -1
        }
    }
    setHeight(fieldId){
        document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight+'px';
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
            
            this.setHeight("per");
        })
    }
    
    
    render()
    {
        if(this.state.once === 1 && this.state.user) {
            return (<div className="container">
        <div>{<Nav logout={this.props.logout}></Nav>}</div>
        <div className="withWord">
            <h3>Your Profile !</h3>
            <div className = "grid">
                <div className="mb-3 row">
                    <label for="name" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                    <input type="text" readOnly className="form-control" id="name" value= {this.state.user.name} ></input>
                    </div>
                </div> 
                <div className="mb-3 row">
                    <label for="staticEmail" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                    <input type="text" readOnly className="form-control" id="staticEmail" value= {this.state.user.email} ></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label for="salary" className="col-sm-2 col-form-label">Salary</label>
                        <div className="col-sm-10">
                        <input type="text" readOnly className="form-control" id="salary" value={this.state.user.salary}></input>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label for="per" className="col-sm-2 col-form-label">Info</label>
                        <div className="col-sm-10">
                        <textarea type="text" readOnly className="form-control" id="per" >{this.state.user.personal_info}</textarea>
                    </div>
                </div>
                <div className="mb-3 row">
                    
                    <div className="col-sm-10">
                        <a className = "btn btn-success update" href="/updateprofile">Update</a>
                    </div>
                </div>
                <div className="mb-3 row">
                    
                    <div className="col-sm-10">
                        <a className = "btn btn-danger reset" href="/resetpassword">Reset Password</a>
                    </div>
                </div>
            </div>
        </div>
        
    </div>)}
        
        this.componentDidMount();
        return <h3>LOADING ... </h3>
        
    }
}