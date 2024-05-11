import { Button, PasswordInput, Popover, Progress, Stack } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useState } from "react";
import { requirements, getStrength } from "../../Helpers/Password";
import PasswordRequirement from "../../Components/PasswordRequirement";
import { UseChangePassword } from "./UseChangePassword";

interface Props {
  id: string | undefined;
}

function ChangePasword({ id }: Props) {
  console.log(id);
  const _PasswordChangeToken: string = id === undefined ? "" : id!;
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState("");
  const { ChangePassword, ChangePasswordOnEnter } = UseChangePassword();
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
    <form onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
      await ChangePasswordOnEnter({ Password: value, PasswordChangeToken: _PasswordChangeToken }, e)
    }}>
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
              meets={value.length > 7}
            />
            {checks}
          </Popover.Dropdown>
        </Popover>
        <Button
          color={"var(--main-color)"}
          variant={hovered ? "outline" : "filled"}
          ref={ref}
          onClick={async () =>
            await ChangePassword({ Password: value, PasswordChangeToken: _PasswordChangeToken })
          }
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}

export default ChangePasword;
