import { Button, Stack, TextInput, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { UseForgetForm } from "./UseForgetForm";
import { IconAt } from "@tabler/icons-react";
import { IUserChangePasswordRequest } from "../../Types/User";

function ForgetPasswordForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const { SendRequest, SendRequestOnEnter, setEmail, email } = UseForgetForm();
  return (
    <form
      onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
        await SendRequestOnEnter(
          {
            Email: email,
          } as IUserChangePasswordRequest,
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
        <Button
          color={"var(--main-color)"}
          variant={hovered ? "outline" : "filled"}
          ref={ref}
          onClick={async () => {
            await SendRequest({
              Email: email,
            } as IUserChangePasswordRequest);
          }}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default ForgetPasswordForm;
