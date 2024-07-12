import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import LastEntryDashItem from "./LastEntryDashItem";
import CheckJWT from "./CheckJWT";
import Logout from "./Logout";
import EntryDashDisplayItem from "./EntryDashDisplayItem";
import ViewAllEntryDashItem from "./ViewAllEntryDashItem";
import AddEntryDashItem from "./AddEntryDashItem";
import DashItem from "./DashItem";
import EmotionsBar from "./EmotionsBar";

  
function Dashboard(){
    const {user, isLoggedIn} = useContext(UserContext);
    const navigate = useNavigate();
    let [JWTErrorClassName, setJWTErrorClassName] = useState("confirmWindowBackdrop hide")
    let [JWTError, setJWTErrorStatus] = useState(false);
    let firstRun = useRef(true);
    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/login")
        }
        else{
            let JWTValidity = CheckJWT();
            if(!JWTValidity){
                setJWTErrorClassName("confirmWindowBackdrop show");
            }
        }
    })    
    useEffect(()=>{
        if(!firstRun.current){
            setTimeout(Logout, 5000);
            navigate("/login");
        }
        else{
            firstRun.current=false;
        }
    },[JWTErrorClassName])
    
    return(
        <div className="DisplayDiv">
            <h1 className="LastEntryLabel">Most recent Entry</h1>
            <DashItem displayItem={<LastEntryDashItem/>}/>
            <h1 className="LastEntryLabel">Commands</h1>
            <DashItem displayItem={<ViewAllEntryDashItem/>}/>
            <DashItem displayItem={<AddEntryDashItem/>}/>
            <EmotionsBar/> 
            <div className={JWTErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <p>You are not logged in. Returning to login page.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
