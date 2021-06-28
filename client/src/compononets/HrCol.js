import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../css/Col.css'
export class HrCol extends Component {
    getheight=()=>{
        var styleVar={
            height: window.innerHeight + "px"
        };
        
        return styleVar;
    }
    render() {
        return (
            
          
           <div className='col-sm-2 leftcol' style={this.getheight()} >
           <Link to='/faculties'>
            <div>
            Faculties 
            </div> 
            </Link>
            <Link to='/departments'>
            <div>
            Departments 
            </div> 
            </Link>
            <Link to='/courses'>
            <div>
            Courses 
            </div> 
            </Link>
            <Link to='/viewstaff'>
            <div>
            Staff 
            </div> 
            </Link>
            <Link to='/attendance'>
            <div>
          Attendance
            </div> 
            </Link>


            
           
        </div>     
            
        );
    }
}

export default HrCol

