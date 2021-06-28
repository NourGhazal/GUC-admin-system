import React, { useState, useEffect } from 'react'
import axios from "axios"
import Nav from "./Nav"
import AmCol from './AmCol';


export default function SendSlotLinking(props) {
    const [dataSlots, setDataSlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [desiredSlot, setDesiredSlot] = useState("")
    const [result, setResult] = useState("")

    useEffect(() => {
        axios.post("/allSlots/", auth)
            .then(res => {
                setDataSlots(res.data)
                setLoading(false)
            }
            )
            .catch(err => setDataSlots(err.response.data))
    }, [])


    const auth = {
        headers: {
            "Authorization": props.token
        }
    }

    const handleChange = (event) => {
        const slotID = event.target.value
        const found = dataSlots.find(element => element._id === slotID)
        setDesiredSlot(found)
    }

    const reqBody = {
        desiredSlot: desiredSlot._id,
        co: desiredSlot.courseCoordinator
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post("/sendSlotLinking/", reqBody, auth)
            .then(res => setResult(res.data.message))
            .catch(err => setResult(err.response.data))
    }

    useEffect(() => {
        if (result !== "") {
            window.confirm(result) && window.location.reload()
        }
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
                        {
                            loading ? <h4>please wait while loading ...</h4> :
                                <form onSubmit={handleSubmit}>
                                    <select className="form-select form-select-lg mb-3 col-sm-4 btn btn-secondary" onChange={handleChange}>
                                        <option value="">--select desired slot--</option>
                                        {dataSlots.map(slot => {
                                            return <option value={slot._id}>
                                                CourseName: {slot.courseName} - Location: {slot.locationName} - Time: {slot.time} </option>
                                        })}
                                    </select>
                                    <br />
                                    <input className="btn btn-primary" type="submit" value="Submit"></input>
                                </form>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

