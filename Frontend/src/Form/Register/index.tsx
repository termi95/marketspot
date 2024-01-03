import {
  Button,
  Input,
  PasswordInput,
  Popover,
  Progress,
  Stack,
  TextInput,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import PasswordRequirement from "../../Components/PasswordRequirement";
import { getStrength, requirements } from "../../Helpers/Password";
import { useState } from "react";

function RegisterForm() {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState("");
  const checks = requirements().map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  return (
    <Stack w={"90%"} m={"auto"} pt={"15px"} pb={"25px"}>
      <Input.Wrapper label="First name" style={{ textAlign: "start" }} required>
        <TextInput placeholder="First name"></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="Last name" style={{ textAlign: "start" }}>
        <TextInput placeholder="Last name"></TextInput>
      </Input.Wrapper>
      <Input.Wrapper label="E-mail" style={{ textAlign: "start" }} required>
        <TextInput placeholder="Your email"></TextInput>
      </Input.Wrapper>
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
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
              />
            </div>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress color={color} value={strength} size={5} mb="xs" />
          <PasswordRequirement
            label="Includes at least 8 characters"
            meets={value.length > 7}
          />
          {checks}
        </Popover.Dropdown>
      </Popover>
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
