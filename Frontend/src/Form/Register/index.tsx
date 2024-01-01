import { Button, Input, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";

function RegisterForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  return (
    <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
      <Input.Wrapper label="First name" style={{ textAlign: "start" }}>
        <TextInput placeholder="First name"></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="Last name" style={{ textAlign: "start" }}>
        <TextInput placeholder="Last name"></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="E-mail" style={{ textAlign: "start" }}>
        <TextInput placeholder="Your email"></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="Password" style={{ textAlign: "start" }}>
        <PasswordInput placeholder="********"></PasswordInput>
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

export default RegisterForm;
