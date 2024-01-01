import { Container, Stack } from "@mantine/core";
import BottomBar from "../../Components/BottomBar";
import TopBar from "../../Components/TopBar";

function MainPage() {
  return (
    <>
      <Stack
        justify="space-between"
        w="100vw"
        h="100vh"
        style={{ gap: "unset" }}
      >
        <TopBar />
        <Container
          h="100%"
          w="95vw"
          p={0}
          bg={"var(--background-color)"}
          maw="95vw"
        >
          <p>dupa</p>
        </Container>
        <BottomBar />
      </Stack>
    </>
  );
}

export default MainPage;
