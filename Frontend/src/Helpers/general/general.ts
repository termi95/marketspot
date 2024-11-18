import { useDispatch } from "react-redux";
import { Api } from "../Api/Api";
import { setIsLogin, setUserRole } from "../../State/User/userSlice";

function GeneralHelper() {
    const dispatch = useDispatch();
    const { isTokenExpired, GetUserRole } = Api();
    function isLogin() {
        if (!isTokenExpired()) {
          dispatch(setIsLogin(true));
          dispatch(setUserRole(GetUserRole()));
        } else {
          dispatch(setIsLogin(false));
        }
      }
      return {isLogin}
}

export default GeneralHelper
