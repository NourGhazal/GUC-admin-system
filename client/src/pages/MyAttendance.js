import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';


function MyAttendance(props) {
    const main = useRef();
    const [state, setstate] = useState({});
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }
    useEffect(() => {
        axios.get('/viewattendance',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
            const columns = [
              {
                title: 'Days',
               
                render: function(a,b,data) {
                    if(data.absent)
                 return    formatDate(data.absent);
                     else
                    return formatDate(data.signin);
                  }, 
                searching:true,
            },
            {
              title: 'Status',
             
              render: function(a,b,data) {
                  if(data.absent)
                   return "Absent"
                   else
                   return "Attended"
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
         

            console.log(props.token);
            console.log(resp);
        })
      });
    return (
      
        <div className="container">

        {<Nav logout={props.logout}></Nav>}
       
          <table ref={main} className="display"/>
        </div>
    )
}

export default MyAttendance
