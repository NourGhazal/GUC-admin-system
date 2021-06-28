import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../css/Col.css'
export class AmCol extends Component {
    getheight=()=>{
        var styleVar={
            height: window.innerHeight + "px"
        };
        
        return styleVar;
    }
    render() {
        return (
            
          
           <div className='col-sm-2 leftcol' style={this.getheight()} >

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

            
           
        </div>     
            
        );
    }
}

export default AmCol

