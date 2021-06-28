import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';
import HrCol from '../compononets/HrCol';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";
import HodCol from '../compononets/HodCol';


function ViewCourseAssignment(props) {
    const main = useRef(); 
    const [state, setstate] = useState({});
   
    
    
    useEffect(() => {
      
        axios.get('/viewcourseassignment',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
          let columns = [
                {
                    title: 'Course ID',
                   
                    render: function(a,b,data){
                        return data.course
                    },
                    searching:true,
                },
                {
                    title: 'Instructor ID',
                   
                    render: function(a,b,data){
                        return data.instructor
                    },
                    searching:true,
                },
              
                 ];
             
                  
             
                 

                 $(main.current).DataTable({
             
                  data:resp.data,
                  columns,
                  ordering: true,
                  searching: true,
                  destroy: true,
                  lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                  pageLength: -1
                  
               });


        })
      },[]);
     

        
        
        
          return (
    
            <div >
                <div>
                {<Nav logout={props.logout}></Nav>}
                </div>
              <div className="row">
              {<HodCol></HodCol>}
               <div className="container col-sm-10">
               <table ref={main} id="table" className="display"/>
               </div>
               
              <ToastContainer />
              </div>
              
              </div>
        )
        }
    
      


export default ViewCourseAssignment
