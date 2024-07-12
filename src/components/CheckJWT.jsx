import {jwtDecode} from "jwt-decode";
function CheckJWT(){
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.accessToken
    const decodedToken = jwtDecode(token);
    const now = new Date();
    if(decodedToken.exp<(now.getTime()/1000)){
        return false;
    }
    else{
        return true;
    }
}
export default CheckJWT;