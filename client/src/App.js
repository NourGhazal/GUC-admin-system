import React,{useState} from 'react'
import { Route, Switch } from 'react-router-dom';

import './App.css';
import Login from "./pages/LoginPage";
import Home from "./pages/Home";
import Faculties from './pages/Faculties'
import { Redirect } from 'react-router'
import Departments from './pages/Departments'
import Courses from './pages/Courses'
import Staff from './pages/Staff'
import MyAttendance from './pages/MyAttendance'
import EditFaculty from './compononets/EditFaculty';
import EditDepartment from './compononets/EditDepartment';
import EditCourse from './compononets/EditCourse'
import EditStaff from './compononets/EditStaff';
import ViewCourseAssignment from './pages/ViewCourseAssignments'
import ViewSchedule from "./compononets/ViewSchedule";
import ViewReplacement from "./compononets/ViewReplacement";
import SendReplacementMEM from "./compononets/SendReplacementMEM";
import SendReplacementHOD from "./compononets/SendReplacementHOD";
import SendSlotLinking from "./compononets/SendSlotLinking";
import ChangeDayOff from "./compononets/ChangeDayOff";
import LeaveRequests from "./compononets/LeaveRequests";
import ViewStatus from "./compononets/ViewStatus";
import Notifications from "./compononets/Notifications";
import CancelRequest from "./compononets/CancelRequest"
import ProfilePage from './pages/ProfilePage';
import UpdateProfile from './pages/UpdateProfile';
import ResetPassword from './pages/ResetPassword';
import MissingHours from './pages/MissingHours'
import MissingDays from './pages/MissingDays'
import HodViewRequests from './pages/HodViewRequests';



function App() {
  const [state, setstate] = useState({
    name:JSON.parse(localStorage.getItem('name')),
  token:JSON.parse(localStorage.getItem('token')),
    role:JSON.parse(localStorage.getItem('role')),
    id:JSON.parse(localStorage.getItem('id'))
});
const [facultydata, setFacultyData] =useState({})
const [departmentdata, setDepartmentData] =useState({})
const [coursedata, setCourseData] =useState({})
const [staffData, setStaffData] =useState({})
// const [faculty_id,setFacultyId] = useState('');

// const editFaculty = (id)={
//   setFacultyId(id);
// }


  const setToken = (token,name,role,id) => {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('name', JSON.stringify(name));
    localStorage.setItem('role', JSON.stringify(role));
    localStorage.setItem('id',JSON.stringify(id))
    const newuser=state;
    newuser.name = name;
    newuser.token = token;
    newuser.logged =true;
    newuser.role = role;
    newuser.id = id;
    console.log("TOKEN");
  
   setstate(newuser);
  // console.log(this.state.token)
  };
  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setstate({token:'',name:'',role:''});
  }
  const editfac=(data)=>{
    setFacultyData(data);
  }
  const editdep=(data)=>{
    setDepartmentData(data);
  }
  const editcour=(data)=>{
    setCourseData(data);
  }
  const editStaff=(data)=>{
    setStaffData(data);
  }
  
  return (
    <div>
    <Switch>
    <Route exact path="/">
       {state.token ? <Home  name={state.name} logout={logout} role={state.role}/>
      : <Redirect to="/login" />}
      </Route>
      <Route exact path="/login">
        {state.token ? <Redirect to="/" />
      :<Login  setToken={setToken}/> }
      </Route>
      <Route exact path="/faculties">
         {state.token ? <Faculties role={state.role} token={state.token} logout={logout} editFaculty={editfac}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/departments">
         {state.token ? <Departments role={state.role}  token={state.token} logout={logout} editDepartment={editdep}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/courses">
         {state.token ? <Courses  role={state.role} token={state.token} logout={logout} editCourse={editcour}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/viewstaff">
         {state.token ? <Staff role={state.role} token={state.token} logout={logout} editStaff={editStaff}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/attendance">
         {state.token ? <MyAttendance  token={state.token} logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/editfaculty">
         {state.token ? <EditFaculty role={state.role} token={state.token} data={facultydata} logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/editdepartment">
         {state.token ? <EditDepartment role={state.role} token={state.token} data={departmentdata}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/editcourse">
         {state.token ? <EditCourse role={state.role} token={state.token} data={coursedata} logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/editstaff">
         {state.token ? <EditStaff role={state.role} token={state.token} data={staffData} logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/hodviewrequest">
         {state.token ? <HodViewRequests id={state.id} role={state.role} token={state.token} logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/courseassignment">
         {state.token ? <ViewCourseAssignment id={state.id} role={state.role} token={state.token} logout={logout}/>
      : <Redirect to="/login" />}</Route>


 

        <Route exact path="/viewSchedule">
          {state.token ? <ViewSchedule token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/viewReplacement">
          {state.token ? <ViewReplacement token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/sendReplacementMEM">
          {state.token ? <SendReplacementMEM token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/sendReplacementHOD">
          {state.token ? <SendReplacementHOD token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/sendSlotLinking">
          {state.token ? <SendSlotLinking token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/changeDayOff">
          {state.token ? <ChangeDayOff token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/leaveRequests">
          {state.token ? <LeaveRequests token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/viewStatus">
          {state.token ? <ViewStatus token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/notifications">
          {state.token ? <Notifications token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>  

        <Route exact path="/cancelRequest">
          {state.token ? <CancelRequest token={state.token} logout={logout}/>
            : <Redirect to="/login" />}</Route>


            <Route exact path="/viewprofile">
         {state.token ? <ProfilePage  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/updateprofile">
         {state.token ? <UpdateProfile  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/resetpassword">
         {state.token ? <ResetPassword  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/viewattend">
         {state.token ? <MyAttendance  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/viewmissinghours">
         {state.token ? <MissingHours  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
      <Route exact path="/viewmissingdays">
         {state.token ? <MissingDays  token={state.token}  logout={logout}/>
      : <Redirect to="/login" />}</Route>
        
    </Switch>
  </div>
  )
}

export default App

