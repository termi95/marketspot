import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import SignInButton from "../SignInButton";
import { Container } from "@mantine/core";
import style from "./bottombar.module.css";

function BottomBar() {
  const { isLogin, isMobile } = useSelector((state: RootState) => state.user);
  if (!isMobile) return null;

  return (
    <Container
      maw="100vw"
      w="100vw"
      className={style.bottom_bar}
      p={10}
    >
      {isLogin ? null : <SignInButton />}
    </Container>
  );
}

export default BottomBar;
