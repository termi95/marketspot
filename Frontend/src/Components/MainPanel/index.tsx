import { Container, Flex } from "@mantine/core";
import TopBar from "../TopBar";
import BottomBar from "../BottomBar";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";

function MainPanel({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSelector((state: RootState) => state.user);
  return (
    <Flex justify="space-between" direction="column" style={{ gap: "unset" }} mih={"100dvh"}>
      <TopBar />
      <Container
        w={isMobile ? "99dvw":"95dvw"}
        p={0}
        bg={"var(--background-color)"}
        maw={isMobile ? "99dvw":"95dvw"}
        flex={1}
      >
        {children}
      </Container>
      <BottomBar />
    </Flex>
  );
}

export default MainPanel;
