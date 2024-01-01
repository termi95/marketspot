import { Button, Input, Stack, TextInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";

function ForgetPasswordForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  return (
    <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
      <Input.Wrapper label="E-mail" style={{ textAlign: "start" }}>
        <TextInput placeholder="Your email"></TextInput>
      </Input.Wrapper>
      <Button
        color={"var(--main-color)"}
        variant={hovered ? "outline" : "filled"}
        ref={ref}
      >
        Submit
      </Button>
    </Stack>
  );
}

export default ForgetPasswordForm;
