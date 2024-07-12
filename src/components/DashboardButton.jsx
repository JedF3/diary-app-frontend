import { useNavigate } from "react-router-dom";

function DashboardButton(){
    let navigate = useNavigate();
    function goBack(){
        navigate("/");
    }
    return (
        <button className="BackButtonClass" onClick={()=>{goBack()}}>Dashboard</button>
    );
}
export default DashboardButton;