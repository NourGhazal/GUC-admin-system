import React,{useState,useEffect} from 'react'
import axios from 'axios';
import '../css/Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

function LoginPage(props) {
    const [state, setstate] = useState({email:'',password:"",error:''})


 const onSubmit= (evt)=> {
    evt.preventDefault();
console.log(state);
    if (!state.email) {
      return setstate({ error: 'Username is required' });
    }

    if (!state.password) {
      return setstate({ error: 'Password is required' });
    }
  let  user ={
    
        email:state.email,
        password:state.password
    }
    axios.post('/login',user).then(resp => {
        console.log(resp.data);
        props.setToken(resp.data.token,resp.data.existinguser.name,resp.data.existinguser.role,resp.data.existinguser._id);
        toast.success("Happy Login :)",{position: toast.POSITION.TOP_CENTER})
        window.location.reload();
}).catch((err)=>{
  console.log(err.response.data);
  toast.error(err.response.data.msg?err.response.data.msg:err.response.data,{position: toast.POSITION.TOP_CENTER});
});
  //  return this.setstate({ error: '' });
  }

  const onChangeemail = (evt)=> {
    let newstate = {...state};
    newstate.email=evt.target.value;
    
    setstate(newstate);
    
  };

 const onChangePassword =(evt)=> {
    let newstate = {...state};
    newstate.password=evt.target.value;
   
    setstate(newstate);
  }      
  

 
    return (
      <div >
                <form className = "box" onSubmit={onSubmit}>
                    <h1>Login</h1>
                    <input type = "text" value = {state.email} onChange = {onChangeemail} placeholder = "Email"></input>
                    <input type = "password" value = {state.password} onChange = {onChangePassword} placeholder = "Password"></input>
                    <input type = "submit"  value = "Login"></input>
                </form>
                <ToastContainer />
            </div>
    );
}


export default LoginPage
  
