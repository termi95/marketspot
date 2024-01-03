import { Container, Stack } from "@mantine/core";
import BottomBar from "../../Components/BottomBar";
import TopBar from "../../Components/TopBar";

function MainView() {
  return (
    <>
      <Stack
        justify="space-between"
        w="100vw"
        style={{ gap: "unset" }}
      >
        <TopBar />
        <Container
          h="100vh"
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

export default MainView;
