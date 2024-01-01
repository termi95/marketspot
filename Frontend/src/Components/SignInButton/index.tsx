import { Button, Container } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import { rem, Text, Space } from "@mantine/core";
import { RootState } from "../../State/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SignInButton() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  return (
    <Container mr={isMobile ? "auto" : "15px"} ml={isMobile ? "auto" : "15px"}>
      <Button
        radius="xs"
        variant="outline"
        color="White"
        onClick={() => navigate("/login")}
      >
        <Text size="md">Sign in</Text>
        <Space w="xs" />
        <IconLogin2 style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </Button>
    </Container>
  );
}

export default SignInButton;
