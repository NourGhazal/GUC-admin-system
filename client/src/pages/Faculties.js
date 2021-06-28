import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $, { data } from 'jquery';
import Nav from '../compononets/Nav';
import {Redirect} from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import HrCol from '../compononets/HrCol';
function Faculties(props) {
    const main = useRef();
    const [state, setstate] = useState({});
   
    const editFaculty = (data)=>{
      props.editFaculty(data);
      setstate({data:data})
      console.log(data._id);
      
    }
    const deleteFaculty = (data)=>{
      if(window.confirm('Are you sure you want to delete this faculty?')){
        axios.delete(`/faculty/${data._id}`,{
          headers :{
            "Authorization":  props.token
        }}).then((resp)=>{
          toast.success("faculty deleted Successfully",{position: toast.POSITION.TOP_CENTER})
          setTimeout(()=>{
            window.location.reload();
          },1500)
        }).catch((err)=>{
          toast.error(err.response.data.msg,{position: toast.POSITION.TOP_CENTER})
        })
      };
      
      
    }
    const addNewFaculty = ()=>{
      props.editFaculty({new:true});
      setstate({data:true});
     }
    useEffect(() => {
      console.log(main.current.tBodies);
    
          
          // Draw once all updates are done
          
     
    console.log(main.current.tBodies);
        axios.get('/faculties',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
            const columns = [
              {
                title: 'Name',
                width:"75%",
                  render: function(a,b,data) {
                    
                  return"<a  href='#'>"+data.name+"</a>"
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
         
               
             var table = $(main.current).DataTable();
             var bodies = main.current.tBodies
             let test1 =   table.row(bodies[0]).nodes().selector.rows
             for( let i =0;i<test1.rows.length;i++){
               
               let data=   table.row(test1.rows[i]).data()
               
               $(test1.rows[i].cells[0]).on( 'click', function () {
                 editFaculty(data);
                  console.log( data );
              });
              if(props.role==='HR'){
              $(test1.rows[i].cells[1]).on( 'click', function () {
                  deleteFaculty(data);
                  console.log( data );
              });
            }
             }
    

            
             
            console.log(props.token);
            console.log(resp);
        })

      },[]);
      if(state.data){
        return(
           <Redirect
          to="/editfaculty" />
        )
      }
      else{
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
            <button type="button" class="btn btn-dark btn-lg btn-block" onClick={addNewFaculty}>Add New Faculty</button>
            </div>
           </div>
          
          <ToastContainer />
          </div>
          
          </div>
      )
      }
   
}

export default Faculties
