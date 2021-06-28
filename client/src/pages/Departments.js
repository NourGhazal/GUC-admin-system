import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';
import HrCol from '../compononets/HrCol';
import { ToastContainer, toast } from 'react-toastify';
import {Redirect} from "react-router";


function Departments(props) {
    const main = useRef();
    const [state, setstate] = useState({});

    const editDepartment = (data)=>{
        props.editDepartment(data);
        setstate({data:data})
    }
    const deleteDeartment=(data)=>{
        if(window.confirm('Are you sure you want to delete this department?')){
            axios.delete(`/department/${data._id}`,{
              headers :{
                "Authorization":  props.token
            }}).then((resp)=>{
              toast.success("Department deleted Successfully",{position: toast.POSITION.TOP_CENTER})
              setTimeout(()=>{
                window.location.reload();
              },1500)
            }).catch((err)=>{
              toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
            })
          };
    }
    const addNewDepartment = (data)=>{
        props.editDepartment({new:true});
        setstate({data:true});
    }
    useEffect(() => {
        axios.get('/departments',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
            
            const columns = [
                {
                    title: 'Name',
                    width:"50%",
                    render: function(a,b,data) {
                    
                        return"<a  href='#'>"+data.name+"</a>"
                      }, 
                    searching:true,
                },
                {
                    title: 'HOD',
                    width:"50%",
                    render: function(a,b,data) {
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
                 $(main.current).DataTable({
             
                  data:resp.data,
                  columns,
                  ordering: true,
                  searching: true,
                  destroy: true,
                  lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                  pageLength: -1
                  
               });
             setstate({department:resp.data})
             console.log("state1");
             console.log(state);
             var table = $(main.current).DataTable();
             var bodies = main.current.tBodies
             let test1 =   table.row(bodies[0]).nodes().selector.rows
             
             for( let i =0;i<test1.rows.length;i++){
               let data=   table.row(test1.rows[i]).data()
               console.log("row")
               console.log(test1.rows)
               console.log("test1.rows[i]");
               console.log(test1.rows[i]);
               $(test1.rows[i].cells[0]).on( 'click', function () {
               
                   let sentdata = data;
                   sentdata.department=state.department
                   console.log('state')
                console.log(state)
                editDepartment(sentdata);
                console.log('state')
                console.log(state)
                  console.log( sentdata );
              });
              if(props.role==='HR'){
              $(test1.rows[i].cells[2]).on( 'click', function () {
                deleteDeartment(data);
                  console.log( data );
              });}
             }
            
        })
      },[]);
      if(state.data){
        return(
           <Redirect
          to="/editdepartment"/>
        )
      }
      else{
        return (
      
            <div>
            <div>
            {<Nav logout={props.logout}></Nav>}
            </div>
            <div className="row">
              {<HrCol></HrCol>}
               <div className="container col-sm-10">
               <table ref={main} id="table" className="display"/>
               <div className="container">
                <button type="button" class="btn btn-dark btn-lg btn-block" onClick={addNewDepartment}>Add New Department</button>
                </div>
               </div>
                
              <ToastContainer />
              </div>
            </div>
        )
      }
   
}

export default Departments
