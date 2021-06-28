import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';
import HrCol from '../compononets/HrCol';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";
import HodCol from '../compononets/HodCol';


function Courses(props) {
    const main = useRef(); 
    const [state, setstate] = useState({});
    const addNewCourse = ()=>{
        props.editCourse({course:{},user:{},new:true});
        setstate({data:true})
    }
    const editCourse = (data)=>{
        props.editCourse(data);
        setstate({data:data})
    }
    const deleteCourse= (data)=>{
        if(window.confirm('Are you sure you want to delete this course?')){
            axios.delete(`course/${data.course._id}`,{
              headers :{
                "Authorization":  props.token
            }}).then((resp)=>{
              toast.success("Course deleted Successfully",{position: toast.POSITION.TOP_CENTER})
              setTimeout(()=>{
                window.location.reload();
              },1500)
            }).catch((err)=>{
              toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
            })
          };
    }
    useEffect(() => {
      
        axios.get('/courses',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
          let columns =[]
          if(props.role==="HR")
             {
              columns = [
                {
                    title: 'Name',
                   
                    render: function(a,b,data){
                        return data.course.name
                    },
                    searching:true,
                },
                {
                    title: 'Coordinator',
                   
                    render: function(a,b,data){
                        return data.user.name
                    },
                    searching:true,
                },
                {
                    title: '',
                    width:"25%",
                      render: function(a,b,data) {
                        
                        return props.role==="HR"?'<button type="button" class="btn btn-danger">Delete Faculty</button>':''
                    }, 
                    searching:false,
                    orderable: false,
                    
                },
               
                 ];
             }else{
              if(props.role==="HOD"){
              columns = [
                {
                    title: 'Name',
                   
                    render: function(a,b,data){
                        return data.course.name
                    },
                    searching:true,
                },
                {
                    title: 'Coordinator',
                   
                    render: function(a,b,data){
                        return data.user.name
                    },
                    searching:true,
                },
                {
                    title: 'Coverage',
                    width:"25%",
                      render: async function(a,b,data) {
                        axios.get(`/viewcoursecoverage/${data._id}`,{
                          headers :{
                            "Authorization":  props.token
                        }}).then((resp)=>{
                              return resp.data.coverage
                        }).catch((err)=>{

                        })
                        
                    }, 
                    searching:false,
                    orderable: false,
                    
                },
               
                 ];}
                 else{
                  columns = [
                    {
                        title: 'Name',
                       
                        render: function(a,b,data){
                            return data.course.name
                        },
                        searching:true,
                    },
                    {
                        title: 'Coordinator',
                       
                        render: function(a,b,data){
                            return data.user.name
                        },
                        searching:true,
                    },
                    
                   
                     ];}
                 }
             
                 

                 $(main.current).DataTable({
             
                  data:resp.data,
                  columns,
                  ordering: true,
                  searching: true,
                  destroy: true,
                  lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                  pageLength: -1
                  
               });

             var table = $(main.current).DataTable();
             var bodies = main.current.tBodies;
             let test1 =   table.row(bodies[0]).nodes().selector.rows
             for( let i =0;i<test1.rows.length;i++){
                let data=   table.row(test1.rows[i]).data()
               $(test1.rows[i].cells[0]).on( 'click', function () {
                   console.log("data")
                    console.log(data)
                editCourse(data);
              
              });
              if(props.role==='HR'){
              $(test1.rows[i].cells[2]).on( 'click', function () {
                deleteCourse(data);
                  console.log( data );
              });}
             }
            console.log(props.token);
            console.log(resp);
        })
      },[]);
      if(state.data){
        return(
           <Redirect
          to="/editcourse"/>
        )
      }
      else{
        if(props.role ==="HR"){
          return (
    
            <div >
                <div>
                {<Nav logout={props.logout}></Nav>}
                </div>
              <div className="row">
              {<HrCol></HrCol>}
               <div className="container col-sm-10">
               <table ref={main} id="table" className="display"/>
               <div className="container">
                <button type="button" class="btn btn-dark btn-lg btn-block" onClick={addNewCourse}>Add New Course</button>
                </div>
               </div>
               
              <ToastContainer />
              </div>
              
              </div>
        )
        }
        else{
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
    
      }
}

export default Courses
