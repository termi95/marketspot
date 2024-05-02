import { useDispatch } from "react-redux";
import { Api } from "../../Helpers/Api/Api";
import { setIsLogin } from "../../State/User/userSlice";

function UseUserAccountDropDown() {
    const { RemoveToken } = Api();
    const dispatch = useDispatch();
  function LogOut() {
    try {
        RemoveToken();
        dispatch(setIsLogin(false));        
    } catch (error) { /* empty */ }
  }
  return { LogOut };
}

export default UseUserAccountDropDown;
