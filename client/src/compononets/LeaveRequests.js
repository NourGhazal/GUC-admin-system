import React, { useState, useEffect } from 'react'
import axios from "axios"
import Nav from "./Nav"
import AmCol from './AmCol';

export default function LeaveRequests(props) {
    const [type, setType] = useState("")
    const [targetedDay, setTargetedDay] = useState("2021-01-01")
    const [reason, setReason] = useState()
    const [result, setResult] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        const auth = {
            headers: {
                "Authorization": props.token
            }
        }
        const data = {
            type: type,
            targetedDay: targetedDay,
            reason: reason
        }
        axios.post("/leaveRequests/", data, auth)
            .then(res => setResult(res.data.message))
            .catch(err => setResult(err.response.data))
    }

    useEffect(() => {
        result !== "" && window.alert(result)
    }, [result])


    return (
        <div >
            <div >
                {<Nav logout={props.logout}></Nav>}
            </div>
            <div className='row'>
            {<AmCol></AmCol>}
                <div className="col-sm-9 container">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <select className="form-select form-select-lg mb-3 col-sm-2 btn btn-secondary" onChange={(event) => setType(event.target.value)}>
                                <option value="">--select type--</option>
                                <option value="accidental">accidental</option>
                                <option value="sick">sick</option>
                                <option value="maternity">maternity</option>
                                <option value="compensation">compensation</option>
                            </select>
                            <br />
                            <input className="mb-3 col-sm-2 btn btn-secondary" type="date" value={targetedDay} onChange={(event) => setTargetedDay(event.target.value)} />
                            <br />
                            <textarea className="mb-1" placeholder="Absence Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
                            <br />
                            <input className="btn btn-primary" type="submit" value="Submit"></input>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

