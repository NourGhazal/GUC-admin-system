import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import $ from 'jquery';
import Nav from "./Nav"
import AmCol from './AmCol';

export default function CancelRequest(props) {
    const [state, setState] = useState([])
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(true)
    const main = useRef();
    const auth = {
        headers: {
            "Authorization": props.token
        }
    }
    useEffect(() => {
        if (result !== "") {
            window.confirm(result) && window.location.reload()
        }
    }, [result])

    // useEffect(() => {
    //     result !== "" && window.alert(result)
    // }, [result])
    const cancelReq = (data) => {
        axios.delete(`/cancelRequest/${data}`, auth)
            .then(res => setResult(res.data))
            .catch(err => setResult(err.response.data))
    }

    useEffect(() => {
        axios.post("/getCancelRequest/", auth)
            .then(res => {
                setLoading(false)
                setState(res.data)
                $("#table").DataTable({
                    data: res.data,
                    columns,
                    ordering: true,
                    searching: true,
                    destroy: true,
                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    pageLength: -1,

                });
                var table = $(main.current).DataTable();
                var bodies = main.current.tBodies
                let test1 = table.row(bodies[0]).nodes().selector.rows
                // const len = res.data.length
                // console.log("file: CancelRequest.js ~ line 52 ~ len", len)
                for (let i = 0; i < test1.rows.length; i++) {
                    let data = table.row(test1.rows[i]).data()
                    $(test1.rows[i].cells[9]).on('click', function () {
                        cancelReq(data._id);
                    });
                }
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
        {
            title: 'Desired Slot',
            data: 'desiredSlot',
            render: function (a, b, data) {
                return helper(data.desiredSlot)
            },
        },
        {
            title: '',
            // width: "25%",
            render: function (a, b, data) {

                return '<button type="button" class="btn btn-danger">Cancel Request</button>'
            },
            searching: false,
            orderable: false,

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
                            <table ref={main} id="table" className="display"></table>}
                    </div>
                
                </div>
            </div>
        </div>
    )
}
