import React, { useState, useEffect } from 'react'
import axios from "axios"
import $ from 'jquery';
import Nav from "./Nav"
import AmCol from './AmCol';

export default function ViewSchedule(props) {
    const [scheduleData, setScheduleData] = useState([])
    const [loading, setLoading] = useState(false)
    const [days, setDays] = useState([])
    const [selectedDay, setSelectedDay] = useState("")

    const auth = {
        headers: {
            "Authorization": props.token
        }
    }





    useEffect(() => {
        setLoading(true)
        selectedDay !== "" && axios.get("/viewSchedule/", auth)
            .then(res => {
                setScheduleData(res.data)
                setLoading(false)
                $("#table").DataTable({
                    data: res.data[selectedDay].slot,
                    columns,
                    ordering: true,
                    searching: true,
                    destroy: true,

                });
            })
            .catch(err => console.log(err))

        setDays([
            { day: "Saturday", num: 0 },
            { day: "Sunday", num: 1 },
            { day: "Monday", num: 2 },
            { day: "Tuesday", num: 3 },
            { day: "Wednesday", num: 4 },
            { day: "Thursday", num: 5 },
            { day: "Friday", num: 6 },
        ])
    }, [selectedDay])

    const columns = [
        {
            title: 'time',
            data: 'time',
        },

        {
            title: 'locationName',
            data: 'locationName',
        },
        {
            title: 'courseName',
            data: 'courseName',
        },

    ];

    return (
        <div >
            <div >
                {<Nav logout={props.logout}></Nav>}
            </div>
            <div className='row'>
            {<AmCol></AmCol>}
                <div className="col-sm-9 container">
                    <div>
                        <select className="form-select form-select-lg mb-3 col-sm-2 btn btn-secondary" onChange={(event) => setSelectedDay(event.target.value)}>
                            <option value="">--select day--</option>
                            {days.map(day => {
                                return <option value={day.num}> {day.day} </option>
                            })}
                        </select>
                        <br />
                        {loading && selectedDay !== "" && <h4>please wait while loading ...</h4>}
                        <br />
                        <table id="table" className="display"></table>
                    </div>

                </div>
            </div>
        </div>

    )
}

