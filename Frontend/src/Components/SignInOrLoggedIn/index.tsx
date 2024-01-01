import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import SignInButton from "../SignInButton";
import UserAccountDropDown from "../UserAccountDropDown";
import { Box } from "@mantine/core";

function SignInOrLoggedIn() {
  const { isLogin, isMobile } = useSelector((state: RootState) => state.user);
  if (isMobile) return <Box p="5px"/>;
  return isLogin ? <UserAccountDropDown /> : <SignInButton />;
}

export default SignInOrLoggedIn;
