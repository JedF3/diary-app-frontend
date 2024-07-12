import { useContext, useEffect, useRef, useState } from "react";
import AllEntriesButton from "./AllEntriesButton";
import DashboardButton from "./DashboardButton";
import EntryDashDisplayItem from "./EntryDashDisplayItem";
import UserContext from "./context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckJWT from "./CheckJWT";

function AddEntryScreen(){
    let {user, isLoggedIn} = useContext(UserContext);
    let defaultClass = "EmotionDivs RoundedCorner";
    let highlightClass = "HighlightedEmotionImages RoundedCorner"
    let defaultDateClass = "DateButton RoundedCorner";
    let highlightDateClass = "HighlightedDateButton RoundedCorner";
    let defaultImgURL="https://res.cloudinary.com/dmqffmafb/image/upload/v1720783947/diary_app/img/ujul9hmuspjbtkbonckt.png"
    let defaultEmotionErrorClassName = "confirmWindowBackdrop hide";
    let showEmotionErrorClassName = "confirmWindowBackdrop show"
    let [anxiousClass, setAnxiousClass] = useState(defaultClass)
    let [angryClass, setAngryClass] = useState(defaultClass)
    let [sadClass, setSadClass] = useState(defaultClass)
    let [neutralClass, setNeutralClass] = useState(defaultClass)
    let [happyClass, setHappyClass] = useState(defaultClass)
    let [excitedClass, setExcitedClass] = useState(defaultClass)
    let [feelingAwesomeClass, setFeelingAwesomeClass] = useState(defaultClass)
    let [selectedEmotion, setSelectedEmotion] = useState(null);
    let [emotionErrorClassName, setEmotionErrorClassName] = useState(defaultEmotionErrorClassName);
    let [todayClass, setTodayClass] = useState(defaultDateClass);
    let [yesterdayClass, setYesterdayClass] = useState(defaultDateClass);
    let [selectedDate, setSelectedDate] = useState(null);
    let [selectedImg, setSelectedImg] = useState(null);
    let [imgAdded, setImgAdded] = useState(false);
    let [subtagValue, setSubtagsValue] = useState([]);
    let [entryContentValue, setEntryContentValue] =  useState("");
    let [entryTitle, setEntryTitle] = useState("");
    let [displayImg, setDisplayImg] = useState(defaultImgURL);
    let [updateMode, setUpdateMode] = useState(false);
    let [ImgRemoveButtonClass, setImgRemoveButtonClass] = useState("Inactive");
    let [JWTErrorClassName, setJWTErrorClassName] = useState("confirmWindowBackdrop hide")
    let [JWTError, setJWTErrorStatus] = useState(false);
    let firstRun = useRef(true);
    const navigate = useNavigate();
    const location = useLocation();
    function handleEmotions(target){
        setAnxiousClass(defaultClass);
        setAngryClass(defaultClass);
        setSadClass(defaultClass);
        setNeutralClass(defaultClass);
        setHappyClass(defaultClass);
        setExcitedClass(defaultClass);
        setFeelingAwesomeClass(defaultClass);
        setSelectedEmotion(target);
        switch(target){
            case 0:
                setAnxiousClass(highlightClass);
            break;
            case 1:
                setAngryClass(highlightClass);
            break;
            case 2:
                setSadClass(highlightClass);
            break;
            case 3:
                setNeutralClass(highlightClass);
            break;
            case 4:
                setHappyClass(highlightClass);
            break;
            case 5:
                setExcitedClass(highlightClass);
            break;
            case 6:
                setFeelingAwesomeClass(highlightClass);
            break;
        }
    }
    function handleDate(e, target){
        setTodayClass(defaultDateClass);
        setYesterdayClass(defaultDateClass);
        switch(target){
            case 0:
                setTodayClass(highlightDateClass);
                setSelectedDate(new Date());
            break;
            case 1:
                setYesterdayClass(highlightDateClass);
                setSelectedDate(new Date()-1)
            break;
        }
    }
    function getImgPath(e){
        if(e.target.files&&e.target.files[0]){
            setDisplayImg(URL.createObjectURL(e.target.files[0]));
            setSelectedImg(e.target.files[0]);
            setImgAdded(true);
        }
    }
    async function handleSubmit(e){
        e.preventDefault();
        const data = new FormData();
        let newEntry;
        let condition
        if(updateMode){
            condition = selectedEmotion&&entryTitle&&entryContentValue&&subtagValue;
        }
        else{
            condition=selectedEmotion&&selectedDate&&entryTitle&&entryContentValue&&subtagValue;
        }
        if(condition){
            data.append("emotionID", selectedEmotion);
            subtagValue.forEach((subtag)=>{data.append("subtags", subtag)})
            data.append("entryTitle", entryTitle);
            data.append("entryContent", entryContentValue);
            data.append("ForDate", selectedDate);
            if(selectedImg){
                data.append("entry-img", selectedImg);
            }
            if(!updateMode){
                axios.post("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/api/v1/entries/addEntry", data, { headers: { Authorization: `Bearer ${user.accessToken}` } })
                .then((result)=>{
                    newEntry=result.data.data._id;
                    navigate(`../viewEntry/${newEntry}`);
                }).catch((error)=>{
                    console.log(error);
                });
            }
            else{
                axios.put("https://diary-app-backend-5dk0wdw5k-jedidiah-franciscos-projects.vercel.app/api/v1/entries/edit/"+location.state._id, data, { headers: { Authorization: `Bearer ${user.accessToken}` } })
                .then((result)=>{
                    newEntry=result.data.id;
                    navigate(`../viewEntry/${newEntry}`);
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }
        else{
            setEmotionErrorClassName(showEmotionErrorClassName);
        }
    }
    function getImgForEdit(){
        axios({
            url: location.state.image.path, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            // let ImgtoSet = new File([response], response);
            setSelectedImg(response.data);
            setImgRemoveButtonClass("Active");
        });
    }
    function handleRemoveImgButton(){
        if(selectedImg){
        setSelectedImg(null);
        setDisplayImg(defaultImgURL);
        setImgRemoveButtonClass("Inactive");
        }
    }
    useEffect(()=>{
        if(location.state){
            setUpdateMode(true);
        }
        if(!isLoggedIn){
            navigate("/login")
        }
        else{
            let JWTValidity = CheckJWT();
            if(!JWTValidity){
                setJWTErrorClassName("confirmWindowBackdrop show");
            }
        }
    },[])
    useEffect(()=>{
        if(updateMode){
            let subtags = JSON.stringify(location.state.subtags)
            setEntryTitle(location.state.entryTitle);
            setSubtagsValue(location.state.subtags);
            setEntryContentValue(location.state.entryContent)
            if(location.state.image){
                setDisplayImg(location.state.image.path)
                setImgRemoveButtonClass("Active");
                getImgForEdit();
            }
            handleEmotions(location.state.mainTag.emotionID);
        }
    },[updateMode]);
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
        <form className="DisplayDiv" onSubmit={(e)=>{handleSubmit(e)}}>
            <div className="EntryNavigation"><AllEntriesButton/><DashboardButton/></div>
            <EntryDashDisplayItem displayItem={
                <div className="AddEntryQA">
                    <h2>Entry Title</h2>
                    <input type="text" className="AddEntryTitleInput useFont" onChange={(e)=>{setEntryTitle(e.target.value)}} value={entryTitle} required></input>
                </div>
            }/>
            <EntryDashDisplayItem displayItem={
                <div className="AddEntryQA">
                <h2>How do we feel about today?</h2>
                <div className="AddSelectButtons">
                    <div className={anxiousClass} onClick={()=>{handleEmotions(0)}}><img className="EmotionImages" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173193/diary_app/emotions/hbgwm8wqit95u5qtwmmz.png"/></div>
                    <div className={angryClass} onClick={()=>{handleEmotions(1)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173197/diary_app/emotions/j5ylqefjsfpjplx4ayfq.png"/></div>
                    <div className={sadClass} onClick={()=>{handleEmotions(2)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173193/diary_app/emotions/zyjqnlsvr37zhgpj2q7q.png"/></div>
                    <div className={neutralClass} onClick={()=>{handleEmotions(3)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173194/diary_app/emotions/blzsaitsznpbxabxxlfg.png"/></div>
                    <div className={happyClass} onClick={()=>{handleEmotions(4)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173196/diary_app/emotions/xazudjqrk2frxyygk4kd.png"/></div>
                    <div className={excitedClass} onClick={()=>{handleEmotions(5)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173197/diary_app/emotions/we3xqll5tbq6xgcurzi7.png"/></div>
                    <div className={feelingAwesomeClass} onClick={()=>{handleEmotions(6)}}><img className="EmotionImages RoundedCorner" src="https://res.cloudinary.com/dmqffmafb/image/upload/v1718173197/diary_app/emotions/fa91b19lix2sarygubpg.png"/></div>
                </div>
            </div>
            }/>
            {!updateMode &&
                <EntryDashDisplayItem displayItem={
                    <div className="AddEntryQA">
                        <h2>When is this entry for?</h2>
                        <div className="AddSelectButtons">
                            <div className={todayClass} onClick={(e)=>{handleDate(e, 0)}}><h3>Today</h3></div>
                            <div className={yesterdayClass} onClick={(e)=>{handleDate(e, 1)}}><h3>Yesterday</h3></div>
                        </div>
                    </div>
                }/>
            }
            <EntryDashDisplayItem displayItem={
                <div className="AddEntryQA">
                    <h2>Add subtags to make it easier to look for in the future(Separate with ",")</h2>
                    <input type="text" onChange={(e)=>{setSubtagsValue(e.target.value.split(","))}} value={subtagValue} required></input>
                </div>
            }/>
            <EntryDashDisplayItem displayItem={
                <div className="AddEntryQA">
                    <h2>Want to add an image?</h2>
                    <input type="file" id="imgUpload" onChange={(e)=>{getImgPath(e)}}></input>
                    <label htmlFor="imgUpload">
                        <div className="EntryImageContainer"><img className="AddanImage" src={displayImg}/></div>
                    </label>
                    <button type="button" className={ImgRemoveButtonClass} onClick={()=>{handleRemoveImgButton()}}>Remove Image</button>
                </div>
            }/>
            <EntryDashDisplayItem displayItem={
                <div className="AddEntryQA">
                    <h2>Write it all out</h2>
                    <textarea className="AddEntryTextArea useFont" onChange={(e)=>{setEntryContentValue(e.target.value)}} value={entryContentValue} required></textarea>
                </div>
            }/>
            <button type="submit" className="SubmitAddEditButton">{updateMode? "Edit":"Submit"}</button>
            <div className={JWTErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <p>You are not logged in. Returning to login page.</p>
                </div>
            </div>
            <div className={emotionErrorClassName}>
                <div className="LoginForm MaterialShadow RoundedCorner">
                    <h2 className="dialogh2">All fields except image is required</h2>
                    <button type="button" onClick={()=>{setEmotionErrorClassName(defaultEmotionErrorClassName)}}>OK</button>
                </div>
            </div>
        </form>
    );
}
export default AddEntryScreen;