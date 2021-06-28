import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../css/Col.css'
export class HodCol extends Component {
    getheight=()=>{
        var styleVar={
            height: window.innerHeight + "px"
        };
        
        return styleVar;
    }
    render() {
        return (
            
          
           <div className='col-sm-2 leftcol' style={this.getheight()} >
          
            <Link to='/courses'>
            <div>
            Courses 
            </div> 
            </Link>
            <Link to='/viewstaff'>
            <div>
            Staff 
            </div> 
            </Link>
            <Link to='/attendance'>
            <div>
            My Attendance 
            </div> 
            </Link>
              <Link to="/viewSchedule"> View Schedule</Link>
                    <br />

                    <Link to="/viewReplacement"> View Replacement Requests</Link>
                    <br />

                    <Link to="/sendReplacementMEM/"> Send Replacement Requests Member</Link>
                    <br />

                    <Link to="/sendReplacementHOD/"> Send Replacement Requests HOD</Link>
                    <br />

                    <Link to="/sendSlotLinking/"> Send SlotLinking Requests</Link>
                    <br />

                    <Link to="/changeDayOff/"> Send ChangeDayOff Requests</Link>
                    <br />

                    <Link to="/leaveRequests/"> Send Leave Requests</Link>
                    <br />

                    <Link to="/viewStatus/"> View Status Requests</Link>
                    <br />

                    <Link to="/notifications/"> View Notifications</Link>
                    <br />

                    <Link to="/cancelRequest/"> Cancel Request</Link>
                    <br />

                    <Link to="/hodviewrequest/"> See Pending Requests</Link>
                    <br />

                    <Link to="/courseassignment/"> View All Courses Assignments</Link>
                    <br />

            
           
        </div>     
            
        );
    }
}

export default HodCol

