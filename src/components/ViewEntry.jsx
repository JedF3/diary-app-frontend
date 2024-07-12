import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "./context/UserContext";
import DashboardButton from "./DashboardButton";
import AllEntriesButton from "./AllEntriesButton";
import CheckJWT from "./CheckJWT";

function ViewEntry(){
    let defaultDeleteDialogClass = "confirmWindowBackdrop hide";
    let showDeleteDialogClass="confirmWindowBackdrop show"
    let [entry, setEntry] = useState({});
    let {id} = useParams();
    let {user, isLoggedIn}=useContext(UserContext);
    let [displayMonth, setDisplayMonth] = useState(null);
    let [displayDay, setDisplayDay] = useState(null);
    let [entryFeelsImg, setEntryFeelsImg] = useState("");
    let [entryTitle, setEntryTitle] = useState("");
    let [entrySubtags, setEntrySubtags] = useState([]);
    let [entryImg, setEntryImg] = useState("");
    let [entryTextContent, setEntryTextContent] = useState("");
    let [deleteDialogName, setDeleteDialogName] = useState(defaultDeleteDialogClass);
    let [JWTErrorClassName, setJWTErrorClassName] = useState("confirmWindowBackdrop hide")
    let [JWTError, setJWTErrorStatus] = useState(false);
    let navigate = useNavigate();
    async function getTargetEntry(){
        axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/v1/entries/viewOne/"+id, {}, {headers:{Authorization:`Bearer ${user.accessToken}`}})
        .then((result)=>{
            setEntry(result.data.data);
        })
        .catch((error)=>{console.log(error)});
    }
    let firstRun = useRef(true);
    useEffect(()=>{
        getTargetEntry();
        if(!isLoggedIn){
            navigate("/login")
        }
        else{
            let JWTValidity = CheckJWT();
            if(!JWTValidity){
                setJWTErrorClassName("confirmWindowBackdrop show");
            }
        }
    },[]);
    useEffect(()=>{
        if(!firstRun.current){
            setTimeout(Logout, 5000);
            navigate("/login");
        }
    },[JWTErrorClassName]);
    useEffect(()=>{
        if(!firstRun.current){
            let tempDate = new Date(entry.createdAt);
            setDisplayMonth(tempDate.getMonth()+1);
            setDisplayDay(tempDate.getDate());
            setEntryFeelsImg(entry.mainTag.image.path);
            setEntryTitle(entry.entryTitle);
            setEntrySubtags(entry.subtags);
            if(entry.image){
            setEntryImg(entry.image.path);
            }
            setEntryTextContent(entry.entryContent);
        }
        else{
            firstRun.current=false;
        }
    },[entry])
    function handleEditButton(){
        navigate("../addEntry", {state:entry});
    }
    function handleInitialDeleteButton(){
        setDeleteDialogName(showDeleteDialogClass);
    }
    function handleNeverMind(){
        setDeleteDialogName(defaultDeleteDialogClass);
    }
    async function handleActualDelete(){
        axios.put("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/v1/entries/delete/"+id, {}, {headers:{Authorization:`Bearer ${user.accessToken}`}}).then(()=>{
            navigate("/allEntries");
        })
    }
    return(
        <div className="DisplayDiv">
            <div className="EntryNavigation"><AllEntriesButton/><DashboardButton/><button onClick={()=>{handleEditButton()}}>Edit</button><button className="Active" onClick={handleInitialDeleteButton}>Delete</button></div>
            <div className="StandardDisplayDiv RoundedCorner MaterialShadow">
                    <div className="DashDisplayDiv forBorder">
                        <div className="EntrysubDivDate"><h1 className="LastEntryDate">{displayMonth}</h1><h1 className="LastEntryDate">{displayDay}</h1></div>
                        <div className="EntrysubDivSmiley"><img className="smileys" src={entryFeelsImg}/></div>
                        <div className="EntrysubDivTitle"><h1>{entryTitle}</h1></div>                  
                    </div>
                <div className="SubtagDiv">{entrySubtags.map((subtag)=><div className="Subtags MaterialShadow">{subtag}</div>)}</div>
                {entryImg&&
                    <div className="EntryImageContainer"><img className="EntryImg" src={entryImg} onClick={()=>{window.location.href=entryImg}}/></div>
                }
                <div className="EntryTextContentDiv"><h2 className="ViewEntryTextContent">{entryTextContent}</h2></div>
            </div>
            <div className={JWTErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <p>You are not logged in. Returning to login page.</p>
                </div>
            </div>
            <div className={deleteDialogName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <h2 className="dialogh2">Delete Entry?</h2>
                    <div className="EntryNavigation">
                        <button className="Active" onClick={handleActualDelete}>Delete</button>
                        <button onClick={handleNeverMind}>Never mind</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewEntry;