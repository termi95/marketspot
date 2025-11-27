import { useDispatch } from "react-redux";
import { Api } from "../Api/Api";
import { setIsLogin, setUserRole } from "../../State/User/userSlice";

function GeneralHelper() {
    const dispatch = useDispatch();
    const { isTokenExpired, GetUserRole, RemoveToken } = Api();
    function isLogin() {
        if (!isTokenExpired()) {
          dispatch(setIsLogin(true));
          dispatch(setUserRole(GetUserRole()));
        } else {
          dispatch(setIsLogin(false));
          RemoveToken();
        }
      }
      function IsNullOrEmpty(value:string | null | undefined):boolean {
        return value == "" || value == undefined || value == null;
      }
      return {isLogin, IsNullOrEmpty}
}

export default GeneralHelper
