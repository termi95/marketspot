import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import SignInButton from "../SignInButton";
import { Box } from "@mantine/core";
import AccountDropDown from "../UserAccountDropDown";

function SignInOrLoggedIn() {
  const { isLogin, isMobile } = useSelector((state: RootState) => state.user);
  const buttonOrDropdonw = () =>
    isLogin ? <AccountDropDown /> : <SignInButton />;
  if (isMobile) {
    return <Box p="5px">{buttonOrDropdonw()}</Box>;
  }
  return buttonOrDropdonw();
}

export default SignInOrLoggedIn;
