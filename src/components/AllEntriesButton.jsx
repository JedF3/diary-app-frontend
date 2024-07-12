import { useNavigate } from "react-router-dom";

function AllEntriesButton(){
    let navigate = useNavigate();
    function goBack(){
        navigate("/allEntries");
    }
    return (
        <button className="BackButtonClass" onClick={()=>{goBack()}}>All Entries</button>
    );
}
export default AllEntriesButton;