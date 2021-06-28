import React from 'react'
import {HrCol} from '../compononets/HrCol'
import {HodCol} from '../compononets/HodCol'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "../css/Home.css"
import Nav from '../compononets/Nav';
import AmCol from '../compononets/AmCol';



function Home(props) {
   function onSignin()
  {
    axios.post('/signin')
    .then(resp => {
        props.setToken(resp.data.token,resp.data.existinguser.name,resp.data.existinguser.role);
        toast.success("Signed In ",{position: toast.POSITION.TOP_CENTER})
    }).catch((err)=>{
  
      toast.error(err,{position: toast.POSITION.TOP_CENTER});
    });
  }
  function onSignout()
  {
    console.log("11")
    axios.post('/signout')
    .then(resp => {
        console.log("12")
        props.setToken(resp.data.token,resp.data.existinguser.name,resp.data.existinguser.role);
        toast.success("Signed Out ",{position: toast.POSITION.TOP_CENTER})
    }).catch((err)=>{
     
      toast.error(err,{position: toast.POSITION.TOP_CENTER});
    });
  }
  if(props.role === "HR"){
    return (
      <div >
      <div >
        {<Nav logout={props.logout}></Nav>}
      </div>
      <div className='row'>
      {<HrCol></HrCol>}
      <div className = "box">
            <div>
              <h1>Hello {props.name}</h1>
            </div>
            <br></br>
            <hr></hr>



            <div className = "signing">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <button className="btn btn-success btn-sm" onClick = {onSignin}>Sign in</button>
                  </div>
                  <div className="cell">
                    <button className="btn btn-danger btn-sm" onClick = {onSignout}>Sign out</button>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewattend" className = "btn btn-sm btn-success">Attendance</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissingdays" className = "btn btn-sm btn-success">Missing Days</a></div>  
                    
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissinghours" className = "btn btn-sm btn-success">Missing Hours</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}



          </div>
      </div>
      </div>
    )
  }
  else{
    if(props.role === "HOD"){
      return (
        <div className="App">
        <div >
          {<Nav logout={props.logout}></Nav>}
        </div>
        <div className='row'>
        {<HodCol></HodCol>}
        <div className = "box">
            <div>
              <h1>Hello {props.name}</h1>
            </div>
            <br></br>
            <hr></hr>



            <div className = "signing">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <button className="btn btn-success btn-sm" onClick = {onSignin}>Sign in</button>
                  </div>
                  <div className="cell">
                    <button className="btn btn-danger btn-sm" onClick = {onSignout}>Sign out</button>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewattend" className = "btn btn-sm btn-success">Attendance</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissingdays" className = "btn btn-sm btn-success">Missing Days</a></div>  
                    
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissinghours" className = "btn btn-sm btn-success">Missing Hours</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}



          </div>
        </div>
        </div>
      )
   }
   else{
    return (
      <div className="App">
      <div >
        {<Nav logout={props.logout}></Nav>}
      </div>
      <div className='row'>
      {<AmCol></AmCol>}
      <div className = "col-sm-9 box">
            <div>
              <h1>Hello {props.name}</h1>
            </div>
            <br></br>
            <hr></hr>



            <div className = "signing">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <button className="btn btn-success btn-sm" onClick = {onSignin}>Sign in</button>
                  </div>
                  <div className="cell">
                    <button className="btn btn-danger btn-sm" onClick = {onSignout}>Sign out</button>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewattend" className = "btn btn-sm btn-success">Attendance</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissingdays" className = "btn btn-sm btn-success">Missing Days</a></div>  
                    
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}
            <br></br>
            <hr></hr>
            <div className = "Attend">
              <div className="container">
                <div className="row">
                  <div className="cell">
                    <div className="container"><a href = "/viewmissinghours" className = "btn btn-sm btn-success">Missing Hours</a></div>
                  </div>
                </div>
              </div>
            </div>
            {/* ============================================================ */}



          </div>
      </div>
      </div>
    )
   }
  }
 
}

export default Home

