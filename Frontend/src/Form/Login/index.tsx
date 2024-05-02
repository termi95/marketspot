import { Button, PasswordInput, Stack, TextInput, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconAt, IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { UseLoginForm } from "./UseLoginForm";
import { IUserLogin } from "../../Types/User";

function LoginForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const { Login, LoginOnEnter, setEmail, setPassword, password, email } =
    UseLoginForm();
  return (
    <form
      onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
        await LoginOnEnter(
          {
            Password: password,
            Email: email,
          } as IUserLogin,
          e
        );
      }}
    >
      <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
        <TextInput
          style={{ textAlign: "start" }}
          value={email}
          placeholder="Your email"
          label="E-mail"
          leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} />}
          required
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          style={{ textAlign: "start" }}
          value={password}
          label="Password"
          placeholder="********"
          leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} />}
          required
          onChange={(event) => setPassword(event.currentTarget.value)}
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
          onClick={async () => {
            await Login({
              Password: password,
              Email: email,
            } as IUserLogin);
          }}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default LoginForm;
