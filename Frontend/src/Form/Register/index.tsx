import {
  Button,
  PasswordInput,
  Popover,
  Progress,
  Stack,
  TextInput,
  rem,
} from "@mantine/core";
import { useHover, useValidatedState } from "@mantine/hooks";
import PasswordRequirement from "../../Components/PasswordRequirement";
import { getStrength } from "../../Helpers/Password";
import { useState } from "react";
import { UseRegisterForm } from "./UseRegisterForm";
import { IUserRegister } from "../../Types/User";
import { IconAt, IconLock, IconUser } from "@tabler/icons-react";
import { PasswordReqChecker } from "../../Components/PasswordReqChecker";

interface Props {
  toggleForm: (flag: boolean) => void;
}

function RegisterForm({ toggleForm }: Props) {
  const { Register, RegisterOnEnter } = UseRegisterForm({
    toggleForm,
  });
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [{ value, valid }, setEmail] = useValidatedState(
    "",
    (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
    true
  );
  const checks = PasswordReqChecker(password);

  const strength = getStrength(password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  return (
    <form
      onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
        if (
          await RegisterOnEnter({Password: password,Email: value,Name: name,Surname: surname,},e)
        ) {
          toggleForm(true);
        }
      }}
    >
      <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
        <TextInput
          style={{ textAlign: "start" }}
          value={name}
          placeholder="First name"
          label="First name"
          leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} />}
          required
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <TextInput
          style={{ textAlign: "start" }}
          value={surname}
          placeholder="Last name"
          label="Last name"
          leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} />}
          onChange={(event) => setSurname(event.currentTarget.value)}
        />
        <TextInput
          style={{ textAlign: "start" }}
          value={value}
          error={!valid}
          placeholder="Your email"
          label="E-mail"
          required
          leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} />}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <Popover
          opened={popoverOpened}
          position="bottom"
          width="target"
          transitionProps={{ transition: "pop" }}
        >
          <Popover.Target>
            <div
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
            >
              <div style={{ textAlign: "start" }}>
                <PasswordInput
                  withAsterisk
                  label="Your password"
                  placeholder="Your password"
                  value={password}
                  leftSection={
                    <IconLock style={{ width: rem(18), height: rem(18) }} />
                  }
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </div>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress color={color} value={strength} size={5} mb="xs" />
            <PasswordRequirement
              label="Includes at least 8 characters"
              meets={password.length > 7}
            />
            {checks}
          </Popover.Dropdown>
        </Popover>
        <Button
          color={"var(--main-color)"}
          variant={hovered ? "outline" : "filled"}
          ref={ref}
          onClick={async () => {
            await Register({
              Password: password,
              Email: value,
              Name: name,
              Surname: surname,
            } as IUserRegister);
          }}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default RegisterForm;
