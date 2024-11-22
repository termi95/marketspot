import { useDispatch } from "react-redux";
import { Api } from "../../../Helpers/Api/Api";
import { setIsLogin } from "../../../State/User/userSlice";
import { useNavigate } from "react-router-dom";

function DropDownAction() {
  const { RemoveToken } = Api();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function LogOut() {
    try {
      RemoveToken();
      dispatch(setIsLogin(false));
      navigate("/")
    } catch (error) {
      /* empty */
    }
  }
  function NavigateTo(route: string) {
    return navigate(route);
  }
  return { LogOut, NavigateTo };
}

export default DropDownAction;
