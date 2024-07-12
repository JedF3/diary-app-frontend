import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "./context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import RegisterScreen from "./RegisterScreen";



function LoginScreen(){
    let defaultLoginErrorMessage="Wrong Username/Password"
    let notExistLoginErrorMessage="User does not exist";
    let {setIsLoggedIn, setUser} = useContext(UserContext);
    let navigate = useNavigate();
    let [loginUsername, setLoginUsername] = useState("");    
    let [password, setLoginPassword] = useState("");
    let credentials = {
        loginUsername,
        password
    };
    let firstRun = useRef(true);
    let [loginErrorClassName, setLoginErrorClassName] = useState("confirmWindowBackdrop hide")
    let [loginError, setLoginErrorStatus] = useState(false);
    let [loginErrorMessage, setLoginErrorMessage] = useState(defaultLoginErrorMessage);
    const handleLogin=async (e, credentials)=>{
        e.preventDefault();   
        axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/api/v1/users/login", {
            username: credentials.loginUsername, 
            password: credentials.password
        }).then((data)=>{
            localStorage.setItem("user", JSON.stringify(data.data.data));
            setIsLoggedIn(true);
            setUser(data.data.data);
            navigate("/");})
            .catch((error)=>{
                if(error.response.status==404){
                    setLoginErrorClassName("confirmWindowBackdrop show");
                    setLoginErrorStatus(true);
                    setLoginErrorMessage(notExistLoginErrorMessage);
                }
                else{
                    setLoginErrorClassName("confirmWindowBackdrop show");
                    setLoginErrorStatus(true);
                    setLoginErrorMessage(defaultLoginErrorMessage);
                }
            })
    }
    function removeFailDialog(){
        setLoginErrorClassName("confirmWindowBackdrop hide");
        setLoginErrorStatus(false);
    }
    useEffect(()=>{
        if(!firstRun.current&&loginError){
            setTimeout(removeFailDialog, 3000);
        }
        else{
            firstRun.current=false;
        }
    },[loginError]);
    return(
        <div className="LoginDiv MaterialShadow">
            <h1>Login</h1>
            <form className="LoginForm" onSubmit={(e)=>{handleLogin(e, credentials)}}>
                <label className="loginFormLabel">Username</label>
                <input type="text" onChange={(e)=>{setLoginUsername(e.target.value)}} required></input>
                <label className="loginFormLabel">Password</label>
                <input type="password" onChange={(e)=>{setLoginPassword(e.target.value)}} required></input>
                <button>Login</button>
            </form>
            <h4>Don't have an account? <Link to={'/signup'}>Register</Link></h4>
            <div className={loginErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <h2 className="dialogh2">{loginErrorMessage}</h2>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;