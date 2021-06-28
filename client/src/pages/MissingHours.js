import React,  { component } from 'react';
import { Component } from 'react';
import axios from 'axios';
// import $ from 'jquery';
import Nav from '../compononets/Nav';
import "../css/MissingHours.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';


export default class MissingHours extends Component 
{
    constructor(props)
    {
        super(props);


        this.state = {
            hours : ""
        }
        
    }
    
    componentDidMount()
    {
        
        axios.get('/viewMissingHours',{
            headers :{
              "Authorization":  this.props.token
          }}).then((resp)=>{
           
            this.setState({
                hours : resp.data
            })
        })
    }
     
    
    render()
    {
       
            return (<div className="container">
        <div>{<Nav logout={this.props.logout}></Nav>}</div>
            

            <div className = "boxMessage">
                <div><h3 id = "heading">{this.state.hours}</h3></div>
            </div>
        
        
    </div>)
        
        // this.componentDidMount();
        // return <h3>LOADING ... </h3>
        
    }
}