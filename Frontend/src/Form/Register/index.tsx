import { Stack, TextInput, rem } from "@mantine/core";
import { useValidatedState } from "@mantine/hooks";
import { useState } from "react";
import { UseRegisterForm } from "./UseRegisterForm";
import { IUserRegister } from "../../Types/User";
import { IconAt, IconLock, IconUser } from "@tabler/icons-react";
import PassInput from "../../Components/PassInput/indext";
import Btn from "../../Components/Btn";

interface Props {
  toggleForm: (flag: boolean) => void;
}

function RegisterForm({ toggleForm }: Props) {
  const { Register, RegisterOnEnter } = UseRegisterForm({
    toggleForm,
  });
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [{ value, valid }, setEmail] = useValidatedState(
    "",
    (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
    true
  );
  return (
    <form
      onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
        if (
          await RegisterOnEnter(
            { Password: password, Email: value, Name: name, Surname: surname },
            e
          )
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
        <PassInput
          label="Your password"
          placeholder="Your password"
          password={password}
          onChangeAction={(event) => setPassword(event.currentTarget.value)}
          lefIcon={<IconLock style={{ width: rem(18), height: rem(18) }} />}
        />
        <Btn
          title="Submit"
          onClick={async () => {
            await Register({
              Password: password,
              Email: value,
              Name: name,
              Surname: surname,
            } as IUserRegister);
          }}
        />
      </Stack>
    </form>
  );
}

export default RegisterForm;
