import { Button, PasswordInput, Stack, TextInput, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconAt, IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function LoginForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  return (
    <form>
      <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
        <TextInput
          style={{ textAlign: "start" }}
          // value={name}
          placeholder="Your email"
          label="E-mail"
          leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} />}
          required
          // onChange={(event) => setName(event.currentTarget.value)}
        />
        <PasswordInput
          style={{ textAlign: "start" }}
          // value={name}
          label="Password"
          placeholder="********"
          leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} />}
          required
          // onChange={(event) => setName(event.currentTarget.value)}
        />
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
    </form>
  );
}

export default LoginForm;
