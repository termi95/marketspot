import { Center, Container, Loader } from "@mantine/core";

interface Props {
  setBg: boolean;
}

function CustomLoader({ setBg }: Props) {
  return (
    <>
      <Container
        bg= {setBg ? "var(--main-color)" : ""}
        w={"100vw"}
        maw={"100vw"}
        mih={"100vh"}
        m={"0px"}
      >
        <Center mih={"100vh"}>
          <Loader color="blue" />
        </Center>
      </Container>
    </>
  );
}

export default CustomLoader;
