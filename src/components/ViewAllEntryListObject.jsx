import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewAllEntryListObject(entry){
    let tempDate = new Date(entry.entry.ForDate);
    let [displayMonth, setDisplayMonth] = useState(null);
    let [displayDay, setDisplayDay] = useState(null);
    let [entryFeelsImg, setEntryFeelsImg] = useState(entry.entry.mainTag.image.path);
    let [entryTitle, setEntryTitle] = useState(entry.entry.entryTitle);
    let navigate = useNavigate();
    useEffect(()=>{
        setDisplayMonth(tempDate.getMonth()+1);
        setDisplayDay(tempDate.getDate());
    },[])
    return(
        <div className="DashItemDiv" onClick={()=>{navigate("/viewEntry/"+entry.entry._id)}}>
            <div className="EntrysubDivDate"><h1 className="LastEntryDate">{displayMonth}</h1><h1 className="LastEntryDate">{displayDay}</h1></div>
            <div className="EntrysubDivSmiley"><img className="smileys" src={entryFeelsImg}/></div>
            <div className="EntrysubDivTitle"><h1 className="LastEntryTitle">{entryTitle}</h1></div>
        </div>
    );
}

export default ViewAllEntryListObject;