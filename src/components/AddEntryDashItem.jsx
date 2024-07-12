import { useNavigate } from "react-router-dom";

function AddEntryDashItem(){
    let navigate=useNavigate();
    return(
        <div className="DashItemDiv" onClick={()=>{navigate("/addEntry")}}>
            <h1>Add an entry</h1>
        </div>
    );
}

export default AddEntryDashItem;