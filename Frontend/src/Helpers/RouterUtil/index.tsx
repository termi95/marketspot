import { Navigate, Outlet } from "react-router-dom";
import { Api } from "../Api/Api";

function PrivateRoutes() {
    const { isTokenExpired } = Api();
    return !isTokenExpired() ? <Outlet/> : <Navigate to={'/'}/>    
}
export default PrivateRoutes