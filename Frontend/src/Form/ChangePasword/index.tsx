import { Button, PasswordInput, Popover, Progress, Stack } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useState } from "react";
import { requirements, getStrength } from "../../Helpers/Password";
import PasswordRequirement from "../../Components/PasswordRequirement";

interface Props {
  id: string | undefined;
}

function ChangePasword({ id }: Props) {
  console.log(id);
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
            meets={value.length > 5}
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

export default ChangePasword;
