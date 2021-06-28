import React from 'react'
import { Link } from 'react-router-dom';
import Nav from "../compononets/Nav"

export default function AM(props) {
    return (
        <div>
            <div >
                {<Nav logout={props.logout}></Nav>}
            </div>

            <div className='row'>
                <div className="col-sm-9 container">

                    <h1>Hello Academic Member</h1>
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
            </div>
        </div>
    )
}
