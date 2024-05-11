import { Container, Stack } from "@mantine/core";
import TopBar from "../TopBar";
import BottomBar from "../BottomBar";
import React from "react";

function MainPanel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stack justify="space-between" w="100vw" style={{ gap: "unset" }}>
        <TopBar />
        <Container
          mih={"100vh"}
          w="95vw"
          p={0}
          bg={"var(--background-color)"}
          maw="95vw"
        >
          {children}
        </Container>
        <BottomBar />
      </Stack>
    </>
  );
}

export default MainPanel;
