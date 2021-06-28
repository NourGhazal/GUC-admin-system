import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import Nav from '../compononets/Nav';


function MissingDays(props) {
    const main = useRef();
    const [state, setstate] = useState({});
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }
    useEffect(() => {
        axios.get('/viewMissingDays',{
          headers :{
            "Authorization":  props.token
        }}).then(resp=>{
            const columns = [
              {
                title: 'Days',
               
                render: function(a,b,data) {
                    return    formatDate(data.absent);
                     
                  }, 
                searching:true,
            },
            {
              title: 'Status',
             
              render: function(a,b,data) {
                   return "Absent"
                
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

        {<Nav logout={props.logout}></Nav> }
          <br></br>
          <br></br>
          <table ref={main} className="display"/>
        </div>
    )
}

export default MissingDays
