import { useNavigate } from "react-router-dom";

function ViewAllEntryDashItem(){
    let navigate=useNavigate();
    return(
        <div className="DashItemDiv" onClick={()=>{navigate("/allEntries")}}>
            <h1>View all Entries</h1>
        </div>
    );
}

export default ViewAllEntryDashItem;