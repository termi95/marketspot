import { Button, Input, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { Link } from "react-router-dom";

function LoginForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  return (
    <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
      <Input.Wrapper label="E-mail" style={{ textAlign: "start" }}>
        <TextInput
          placeholder="Your email"
        ></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="Password" style={{ textAlign: "start" }}>
        <PasswordInput placeholder="********"></PasswordInput>
      </Input.Wrapper>
      <Link
        to={"/forget-password"}
        style={{ textAlign: "start" }}
        color={"ocean-blue"}
      >
        Forget your password?
      </Link>
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

export default LoginForm;
