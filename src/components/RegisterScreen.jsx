import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "./context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoginScreen from "./LoginScreen";


function RegisterScreen(){
    let navigate = useNavigate();
    let [registerUsername, setRegisterUsername] = useState("");    
    let [password, setRegisterPassword] = useState("");
    let [email, setRegisterEmail] = useState("")
    let credentials = {
        registerUsername,
        email,
        password
    };
    let firstRun = useRef(true);
    let [confirmWindowClassName, setConfirmWindowClassName] = useState("confirmWindowBackdrop hide");
    const handleRegister=async (e, credentials)=>{
        e.preventDefault();   
        axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/api/v1/users/signup", {
            username: credentials.registerUsername, 
            email:credentials.email,
            password: credentials.password
        }).then((data)=>{
            setConfirmWindowClassName("confirmWindowBackdrop show");
        })
    }
    function moveToLogin(){
        navigate("/login");
    }
    useEffect(()=>{
        if(!firstRun.current){
            setTimeout(moveToLogin, 3000);
        }
        else{
            firstRun.current=false;
        }
    },[confirmWindowClassName]);
    return(
        <div className="LoginDiv MaterialShadow">
            <h1>Register</h1>
            <form className="LoginForm" onSubmit={(e)=>{handleRegister(e, credentials)}}>
                <label className="loginFormLabel">Email</label>
                <input type="email" placeholder="John@yahoo.com" onChange={(e)=>{setRegisterEmail(e.target.value)}} required></input>
                <label className="loginFormLabel">Username</label>
                <input type="text" onChange={(e)=>{setRegisterUsername(e.target.value)}} required></input>
                <label className="loginFormLabel">Password</label>
                <input type="password" onChange={(e)=>{setRegisterPassword(e.target.value)}} required></input>
                <button>Register</button>
            </form>
            <h4>Already a member? <Link to={'/login'}>Login</Link></h4>
            <div className={confirmWindowClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <p>Successfully Registered. Please login</p>
                </div>
            </div>
        </div>
    );
}

export default RegisterScreen;