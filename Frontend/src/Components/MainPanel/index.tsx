import { Container, Flex } from "@mantine/core";
import TopBar from "../TopBar";
import BottomBar from "../BottomBar";
import React from "react";

function MainPanel({ children }: { children: React.ReactNode }) {
  return (
    <Flex justify="space-between" direction="column" style={{ gap: "unset" }} mih={"100dvh"}>
      <TopBar />
      <Container
        w={"99dvw"}
        p={0}
        bg={"var(--background-color)"}
        maw={"99dvw"}
        flex={1}
      >
        {children}
      </Container>
      <BottomBar />
    </Flex>
  );
}

export default MainPanel;
