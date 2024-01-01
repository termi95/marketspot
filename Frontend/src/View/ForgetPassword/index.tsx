import { Box, Center, Container, Flex, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import ForgetPasswordForm from "../../Form/ForgetPassword";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function ForgetPasswordView() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  return (
    <Container
      bg={"var(--main-color)"}
      w={"100vw"}
      maw={"100vw"}
      h={"100vh"}
      m={"0px"}
    >
      <Center h={"100%"}>
        <Box
          bg={"white"}
          style={{ borderRadius: "3%" }}
          w={isMobile ? "100%" : "25%"}
          h={"80%"}
        >
          <Flex justify={"start"} p={"15px"}>
            <Link to={"/login"}>
              <IconChevronLeft size={"4rem"} color="black" />
            </Link>
          </Flex>
          <Text fw={700} size="xl" p={"10px"} pt={"5%"}>
            Did you forget you password?
          </Text>
          <Text p={"10px"} pb={"5%"} pt={"5%"}>
            Don't worry! The password reset link will been sent to your email
            address, allowing you to regain control of your account quickly and
            easily.
          </Text>
          <ForgetPasswordForm />
        </Box>
      </Center>
    </Container>
  );
}

export default ForgetPasswordView;
