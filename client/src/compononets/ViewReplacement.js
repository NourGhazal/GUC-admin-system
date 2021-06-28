import React, { useState, useEffect } from 'react'
import axios from "axios"
import $ from 'jquery';
import Nav from "./Nav"
import AmCol from './AmCol';


export default function ViewReplacement(props) {
    const [state, setState] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = {
            headers: {
                "Authorization": props.token
            }
        }
        axios.get("/viewReplacement/", auth)
            .then(res => {
                setState(res.data)
                setLoading(false)
                $("#table").DataTable({
                    data: res.data,
                    columns,
                    ordering: true,
                    searching: true,
                    destroy: true,

                });
            })
            .catch(err => console.log(err.response.data))
    }, [])

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
                return formatDate(data.Boss);
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
                        {loading ? <h4>please wait while loading ...</h4> :
                            <table id="table" className="display"></table>}
                    </div>

                </div>
            </div>
        </div>
    )
}

