import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "./context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function LastEntryDashItem(){
    const {user, isLoggedIn} = useContext(UserContext);
    const navigate = useNavigate();
    let firstRun = useRef(true);
    let [lastEntry, setLastEntry] = useState(null);
    let [entryDataStatus, setEntryDataStatus] = useState(true);
    let [entryTitle, setEntryTitle] = useState("");
    let [entryFeelsImg, setEntryFeelsImg] = useState("");
    let [entryDate, setEntryDate] = useState("");
    let [displayMonth, setDisplayMonth] = useState(null);
    let [displayDay, setDisplayDay] = useState(null);
    async function getLastEntry(){
        axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/v1/entries/recent/lastEntry", {}, {headers:{Authorization:`Bearer ${user.accessToken}`}})
        .then((result)=>{
            setLastEntry(result.data.data[0]);
        })
        .catch((error)=>{

        });
    }
    useEffect(()=>{getLastEntry()},[])
    useEffect(()=>{
        if(!firstRun.current){
            if(lastEntry){
                let tempdate=new Date(lastEntry.createdAt);
                setDisplayMonth(tempdate.getMonth()+1)
                setDisplayDay(tempdate.getDate());
                setEntryTitle(lastEntry.entryTitle);
                setEntryFeelsImg(lastEntry.mainTag.image.path);
                setEntryDate(tempdate);
            }
        }
        else{
            firstRun.current=false;
        }
    },[lastEntry])
    function handleLastEntry(){
        if(lastEntry){
            navigate("/viewEntry/"+lastEntry._id)
        }
        else{
            navigate("/addEntry");
        }
    }
    return(
        
        <div className="DashItemDiv" onClick={()=>{handleLastEntry()}}>
            {lastEntry&&
                <div className="EntrysubDivDate"><h1 className="LastEntryDate">{displayMonth}</h1><h1 className="LastEntryDate">{displayDay}</h1></div>
            }
            {lastEntry&&
                <div className="EntrysubDivSmiley"><img className="smileys" src={entryFeelsImg}/></div>
            }
            {lastEntry&&
                <div className="EntrysubDivTitle"><h1 className="LastEntryTitle">{entryTitle}</h1></div>  
            }        
            {!lastEntry&&
                <h1>No entries yet. Click here to add one!</h1>
            } 
        </div>
    );
}

export default LastEntryDashItem;