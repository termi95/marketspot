import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import SignInButton from "../SignInButton";
import { Container } from "@mantine/core";

function BottomBar() {
  const { isLogin, isMobile } = useSelector((state: RootState) => state.user);
  if (!isMobile) return null;

  return (
    <Container
      maw="100vw"
      w="100vw"
      p={10}
      bg={"var(--main-color)"}
    >
      {isLogin ? null : <SignInButton />}
    </Container>
  );
}

export default BottomBar;
