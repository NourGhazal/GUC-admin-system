import React, { useState, useEffect } from 'react'
import axios from "axios"
import Nav from "./Nav"
import AmCol from './AmCol';

export default function SendReplacementMEM(props) {
    const [ids, setIDs] = useState([])
    const [days, setDays] = useState([])
    const [courses, setCourses] = useState([])
    const [result, setResult] = useState("")

    const [selectedId, setSelectedId] = useState("")
    const [selectedCourse, setSelectedCourse] = useState("")
    const [selectedDay, setSelectedDay] = useState("")

    const auth = {
        headers: {
            "Authorization": props.token
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault()

        const data = {
            theAcademicMemberReplacementID: selectedId,
            targetedDay: selectedDay,
            course_id: selectedCourse
        }
        axios.post("/sendReplacementMEM/", data, auth)
            .then(res => setResult(res.data.message))
            .catch(err => setResult(err.response.data))
    }

    useEffect(() => {
        result !== "" && window.alert(result)
    }, [result])

    useEffect(() => {
        axios.get("/allStaffMemberIDs/", auth)
            .then(res => setIDs(res.data))
            .catch(err => setIDs(err.response.data))

        axios.get("/allCourses/", auth)
            .then(res => setCourses(res.data))
            .catch(err => setCourses(err.response.data))

        setDays([
            { day: "Saturday", num: 0 },
            { day: "Sunday", num: 1 },
            { day: "Monday", num: 2 },
            { day: "Tuesday", num: 3 },
            { day: "Wednesday", num: 4 },
            { day: "Thursday", num: 5 },
            { day: "Friday", num: 6 },
        ])
    }, [])



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
                            <select className="form-select form-select-lg mb-3 col-sm-3 btn btn-secondary" onChange={(event) => setSelectedId(event.target.value)}>
                                <option value="">--select replacement--</option>
                                {ids.map(id => {
                                    return <option value={id._id}> {id._id} </option>
                                })}
                            </select>
                            <br />

                            <select className="form-select form-select-lg mb-3 col-sm-3 btn btn-secondary" onChange={(event) => setSelectedCourse(event.target.value)}>
                                <option value="">--select course--</option>
                                {courses.map(course => {
                                    return <option value={course._id}> {course.name} </option>
                                })}
                            </select>
                            <br />

                            <select className="form-select form-select-lg mb-3 col-sm-3 btn btn-secondary" onChange={(event) => setSelectedDay(event.target.value)}>
                                <option value="">--select day--</option>
                                {days.map(day => {
                                    return <option value={day.num}> {day.day} </option>
                                })}
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
