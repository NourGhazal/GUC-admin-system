import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import $ from 'jquery';
import Nav from "../compononets/Nav"
import HodCol from '../compononets/HodCol';
import { ToastContainer, toast } from 'react-toastify';
  


function HodViewRequests(props) {
    const [state, setState] = useState([])
    const [loading, setLoading] = useState(true)
    const main = useRef() ;
    const auth = {
        headers: {
            "Authorization": props.token
        }
    }
    const acceptRequest = (data)=>{
        console.log("ID")
        console.log(data._id);
        axios.put(`/acceptrequest/${data._id}`,{}, auth).then((resp)=>{
            toast.success("Request Accepted Successfully",{position: toast.POSITION.TOP_CENTER});


        }).catch((err)=>{

        })
        
    }
    const rejectRequest = (data)=>{
        axios.put(`/rejectrequest/${data._id}`,{comment:"nocomment"}, auth).then((resp)=>{
            toast.success("Request Rejected Successfully",{position: toast.POSITION.TOP_CENTER});


        }).catch((err)=>{

        })
    }
    useEffect(() => {
        

        axios.get("/viewrequest/", auth)
            .then(res => {
                setState(res.data)
                setLoading(false)
                console.log(res.data)
                axios.get("/getallrequests/", auth).then((resp)=>{
                    resp.data=  resp.data.filter((req)=>{
                        console.log("MY ID")
                        console.log(props.id)
                         return (req.Boss === props.id && req.status==="pending")
                         })
                    $(main.current).DataTable({
                        data: resp.data,
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
                      console.log("row")
                      console.log(test1.rows)
                      console.log("test1.rows[i]");
                      console.log(test1.rows[i]);
                      if(props.role==="HOD"){
                      $(test1.rows[i].cells[5]).on( 'click', function () {
                      
                          let sentdata = data;
                          sentdata.department=state.department
                       acceptRequest(sentdata);
                       
                     });
                    
                     $(test1.rows[i].cells[4]).on( 'click', function () {
                       rejectRequest(data);
                         console.log( data );
                     });}
                    
                }
                    console.log("final")
                    console.log(resp.data)
                }).catch(err=>console.log(err))
            })
            .catch(err => console.log(err.response))
    }, [])

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
   
    const columns = [
       
        {
            title: 'Type',
            data: 'type',
        },
        {
            title: 'Status',
            data: 'status',
        },
      
        {
            title: 'Targeted Day',
            render: function (a, b, data) {
                return formatDate(data.targetedDay);
            },

        },
        {
            title: 'Submitted Day',
            render: function (a, b, data) {
                return formatDate(data.submittedDay);
            },
          
        },
        {
            title: '',
            render: function (a, b, data) {
                return '<button type="button" class="btn btn-danger">Reject Request</button>';
            },
          
        },
        {
            title: '',
            render: function (a, b, data) {
                return '<button type="button" class="btn btn-success">Accept Request</button>';
            },
          
        },
        

    ];
    return (
        <div >
            <div >
                {<Nav logout={props.logout}></Nav>}
            </div>
            <div className='row'>
            {<HodCol></HodCol>}
                <div className="col-sm-9 container">

                    <div>
                        {loading ? <h4>please wait while loading ...</h4> :
                            <table ref={main} id="table" className="display"></table>}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default HodViewRequests


