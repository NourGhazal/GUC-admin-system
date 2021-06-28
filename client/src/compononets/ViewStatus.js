import React, { useState, useEffect } from 'react'
import axios from "axios"
import $ from 'jquery';
import Nav from "./Nav"
import AmCol from './AmCol';

export default function ViewStatus(props) {
    const [state, setState] = useState([])
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const auth = {
            headers: {
                "Authorization": props.token
            }
        }
        axios.get(`http://localhost:1000/viewStatus/${status}`, auth)
            .then(res => {
                setLoading(false)
                setState(res.data)
                $("#table").DataTable({
                    data: res.data,
                    columns,
                    ordering: true,
                    searching: true,
                    destroy: true,

                });
            })
            .catch(err => console.log(err.response.data))
    }, [status])

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const helper = (data) => {
        if (!data)
            return "---"
        else
            return data
    }

    const columns = [
        {
            title: 'Replacement ID',
            data: 'theAcademicMemberReplacementID',
            render: function (a, b, data) {
                return helper(data.theAcademicMemberReplacementID)
            },
        },
        {
            title: 'Type',
            data: 'type',
        },
        {
            title: 'Status',
            data: 'status',
        },
        {
            title: 'Boss',
            data: 'Boss',
            render: function (a, b, data) {
                return helper(data.Boss);
            },
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
            //   searching:true,
        },
        {
            title: 'reason',
            data: 'reason',
            render: function (a, b, data) {
                return helper(data.reason)
            },
        },
        {
            title: 'Change DayOff',
            data: 'desiredDayOff',
            render: function (a, b, data) {
                return helper(data.desiredDayOff)
            },
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
                        <select className="form-select form-select-lg mb-3 col-sm-2 btn btn-secondary" onChange={(event) => setStatus(event.target.value)}>
                            <option value={status}>--select status--</option>
                            <option value="all">all</option>
                            <option value="pending">pending</option>
                            <option value="accepted">accepted</option>
                            <option value="rejected">rejected</option>
                        </select>
                        <br />
                        {loading && status !== "" && <h4>please wait while loading ...</h4>}
                        <br />
                        {status === "" ? <div></div> :
                            <table id="table" className="display"></table>}
                    </div>

                </div>
            </div>
        </div>
    )
}

