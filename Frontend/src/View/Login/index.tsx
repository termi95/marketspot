import { Box, Button, Center, Container, Group, Text } from "@mantine/core";
import { useState } from "react";
import styles from "./loginView.module.css";
import LoginForm from "../../Form/Login";
import RegisterForm from "../../Form/Register";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";

function LoginView() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const [isLoginTabActive, setIsLoginTabActive] = useState(true);
  return (
    <Container
      bg={"var(--main-color)"}
      w={"100vw"}
      maw={"100vw"}
      mih={"100vh"}
      m={"0px"}
    >
      <Center mih={"100vh"} pt={"20px"}>
        <Box
          bg={"white"}
          style={{ borderRadius: "3%" }}
          w={isMobile ? "100%" : "25%"}
          pb={isMobile ? "15%" : "5%"}
        >
          <Text fw={700} p={"10px"} size="xl" pb={"10%"} pt={"5%"}>
            Market Spot
          </Text>
          <Group justify="space-between" align="stretch" grow gap={"0"}>
            <Box className="pointer" onClick={() => setIsLoginTabActive(true)}>
              <Button
                size="compact-lg"
                variant="transparent"
                c={"black"}
                className={isLoginTabActive ? styles.activeTabBorder : ""}
              >
                Sign in
              </Button>
              <Box
                className={isLoginTabActive ? styles.activeTab : styles.tab}
                ml={"5%"}
              />
            </Box>
            <Box className="pointer" onClick={() => setIsLoginTabActive(false)}>
              <Button
                size="compact-lg"
                variant="transparent"
                c={"black"}
                className={!isLoginTabActive ? styles.activeTabBorder : ""}
              >
                Register
              </Button>

              <Box
                className={isLoginTabActive ? styles.tab : styles.activeTab}
                mr={"5%"}
              />
            </Box>
          </Group>
          {isLoginTabActive ? <LoginForm /> : <RegisterForm />}
        </Box>
      </Center>
    </Container>
  );
}

export default LoginView;
