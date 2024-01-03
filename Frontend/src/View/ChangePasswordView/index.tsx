import { Box, Center, Container, Flex, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../State/store";
import ChangePasword from "../../Form/ChangePasword";

function ChangePasswordView() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const { id } = useParams<{ id: string }>();
  console.log(id);
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
          h={"80%"}
          pb={isMobile ? "15%" : "5%"}
        >
          <Flex justify={"start"} p={"15px"}>
            <Link to={"/login"}>
              <IconChevronLeft size={"4rem"} color="black" />
            </Link>
          </Flex>
          <Text fw={700} size="xl" p={"10px"} pt={"5%"}>
            Please enter your new password.
          </Text>
          <ChangePasword id={id} key={id} />
        </Box>
      </Center>
    </Container>
  );
}

export default ChangePasswordView;
