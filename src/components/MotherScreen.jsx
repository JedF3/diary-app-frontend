import { useContext } from "react";
import UserContext from "./context/UserContext";
import { Outlet, useNavigate } from "react-router-dom";

function MotherScreen(){
    const {user, isLoggedIn} = useContext(UserContext);
    let navigate = useNavigate();
    function handleLogout(){
        localStorage.removeItem("user");
        navigate("/login");
    }
    return(
        <div className="container">
            <header className="TitleBar MaterialShadow"><h2>Mental Health Diary</h2> 
                <div className="usernameLogoutToo">
                    <div className="LogoutButton" onClick={handleLogout}>
                        <h2>Logout</h2>
                    </div>
                    <div className="username">
                        <h2>{user.username}</h2>
                    </div>
                </div>
            </header>
            <Outlet/>
        </div>
    );
}
export default MotherScreen;