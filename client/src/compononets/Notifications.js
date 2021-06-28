import React, { useState, useEffect } from 'react'
import axios from "axios"
import Nav from "./Nav"
import AmCol from './AmCol';

export default function Notifications(props) {
    const [state, setState] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = {
            headers: {
                "Authorization": props.token
            }
        }
        axios.get("/notifications/", auth)
            .then(res => {
                setState(res.data)
                setLoading(false)
            })
            .catch(err => console.log(err.response.data))
    }, [])

    // const columns = [
    //     {
    //         title: 'Notifications',
    //         data: 'theAcademicMemberReplacementID',
    //     },
    // ];

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
                            state.map((element) => <h2>{element}</h2>)
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}
