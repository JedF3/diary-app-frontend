import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "./context/UserContext";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import EntryDashDisplayItem from "./EntryDashDisplayItem";
import ViewAllEntryListObject from "./ViewAllEntryListObject";
import DashboardButton from "./DashboardButton";
import DashItem from "./DashItem";
import LastEntryDashItem from "./LastEntryDashItem";
import CheckJWT from "./CheckJWT";
function ViewAllEntryScreen(){
    const {user, isLoggedIn} = useContext(UserContext);
    let [allEntries, setAllEntries] = useState([]);
    let [JWTErrorClassName, setJWTErrorClassName] = useState("confirmWindowBackdrop hide")
    let [JWTError, setJWTErrorStatus] = useState(false);
    let firstRun = useRef("true");
    let navigate = useNavigate();
    async function getAllEntries(){
        axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/v1/entries/", {}, {headers:{Authorization:`Bearer ${user.accessToken}`}})
        .then((result)=>{
            setAllEntries(result.data.data);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
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
        getAllEntries();
    },[])
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
            <div className="shortNav"><DashboardButton/><button onClick={()=>{navigate("/addEntry")}}>Add Entry</button></div>
            <h1>All entries</h1>
            {allEntries.length>0 &&
                allEntries.map((entry)=><EntryDashDisplayItem displayItem={<ViewAllEntryListObject entry={entry}/>}/>)
            }
            {!allEntries.length>0&&
                <DashItem displayItem={<LastEntryDashItem/>}/>
            }
            <div className={JWTErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <p>You are not logged in. Returning to login page.</p>
                </div>
            </div> 
        </div>
    );
}
export default ViewAllEntryScreen;