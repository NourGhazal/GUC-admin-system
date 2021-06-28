import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';
import {Redirect} from "react-router";
import HrCol from '../compononets/HrCol';
import { ToastContainer, toast } from 'react-toastify';


function Staff(props) {
    const main = useRef();
    const [state, setstate] = useState({});
    const addNewStaff = ()=>{
        props.editStaff({new:true});
        setstate({data:true})
    }
    const editStaff = (data)=>{
        props.editStaff(data);
        setstate({data:data})
    }
    const deleteStaff= (data)=>{
        if(window.confirm('Are you sure you want to delete this Member?')){
            axios.delete(`/staff/${data._id}`,{
              headers :{
                "Authorization":  props.token
            }}).then((resp)=>{
              toast.success("Staff deleted Successfully",{position: toast.POSITION.TOP_CENTER})
              setTimeout(()=>{
                window.location.reload();
              },1500)
            }).catch((err)=>{
              toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
            })
          };
    }
    useEffect(() => {
        axios.get('/viewstaff',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
            const columns = [
                {
                    width:"50%",
                    title: 'Name',
                   
                    data: 'name',
                 //   searching:true,
                },
                {
                    width:"50%",
                    title: 'Email',
                   
                    data: 'email',
                    //searching:true,
                },
                {
                    width:"50%",
                    title: 'Salary',
                   
                    data: 'salary',
                   // searching:true,
                },
                {
                    width:"50%",
                    title: 'Role',
                   
                    data: 'role',
                 //   searching:true,
                },
                {
                  width:"50%",
                  title: 'Day Off',
                 
                  render: (a,b,data)=>{
                  //  return data.day_off
                    switch (data.day_off){
                      case "0" : return "Sunday";
                      case "1" : return "Monday";
                      case "2" : return "Tuesday";
                      case "3" : return "Wednesday";
                      case "4" : return "Thursday";
                      case "5" : return "Friday";
                      case "6" : return "Saterday";
                      default : return "NAN";
                    }
                  },
               //   searching:true,
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

             var table = $(main.current).DataTable();
             var bodies = main.current.tBodies;
             let test1 =   table.row(bodies[0]).nodes().selector.rows

             for( let i =0;i<test1.rows.length;i++){
                let data=   table.row(test1.rows[i]).data()
               $(test1.rows[i].cells[0]).on( 'click', function () {
                   console.log("data")
                    console.log(data)
                     editStaff(data);
              
              });
              if(props.role==='HR'){
              $(test1.rows[i].cells[4]).on( 'click', function () {
                deleteStaff(data);
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
          to="/editstaff"/>
        )
      }
      else{
        return (

            <div >
    
            {<Nav logout={props.logout}></Nav>}
            <div className="row">
              {<HrCol></HrCol>}
              <div className="col-sm-10">
              <table ref={main} className="display"/>
              <div className="container">
                    <button type="button" class="btn btn-dark btn-lg btn-block" onClick={addNewStaff}>Add New Member</button>
                    </div>
              </div>
              </div>
            </div>
        )
      }

}

export default Staff
