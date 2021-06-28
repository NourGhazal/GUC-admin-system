import React, { useState, useEffect } from 'react'
import axios from "axios"
import Nav from "./Nav"
import AmCol from './AmCol';


export default function ChangeDayOff(props) {
    const [day, setDay] = useState("")
    const [result, setResult] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        const auth = {
            headers: {
                "Authorization": props.token
            }
        }
        const data = {
            desiredDayOff: day,
        }
        axios.post("/changeDayOff/", data, auth)
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

                            <select className="form-select form-select-lg mb-3 col-sm-2 btn btn-secondary" onChange={(event) => setDay(event.target.value)}>
                                <option value="">  --select day--</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>
                            <br />
                            <input className="btn btn-primary" type="submit" value="Submit"></input>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

