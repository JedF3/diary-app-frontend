import { useState } from "react";
import UserContext from "./UserContext";

// function loginTokenChecker(){
//     const previousLogin = localStorage.getItem("user")?true:false;
//     if(previousLogin){

//     }
//     else{
//         return false;
//     }
// }

const UserContextProvider = (props)=>{
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("user") ? true : false
      );
    const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    );

    const state = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    };
    return(
        <UserContext.Provider value = {state}>{props.children}</UserContext.Provider>
    );


}

export default UserContextProvider;