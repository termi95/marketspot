import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import SignInButton from "../SignInButton";
import { Box } from "@mantine/core";
import AccountDropDown from "../UserAccountDropDown";

function SignInOrLoggedIn() {
  const { isLogin, isMobile } = useSelector((state: RootState) => state.user);
  if (isMobile) return <Box p="5px"/>;
  return isLogin ? <AccountDropDown /> : <SignInButton />;
}

export default SignInOrLoggedIn;
