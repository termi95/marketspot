import { useSelector } from "react-redux";
import { UserRole } from "../../Types/User";
import UserDropDown from "./UserDropDown";
import { RootState } from "../../State/store";
import AdminDropDown from "./AdminDropDown";

function AccountDropDown() {
  const { userRole } = useSelector((state: RootState) => state.user);

  switch (+userRole) {
    case UserRole.User:
      return <UserDropDown />;
      case UserRole.Admin:
        return <AdminDropDown />;
        default:
      return <UserDropDown />;
  }
}

export default AccountDropDown;
