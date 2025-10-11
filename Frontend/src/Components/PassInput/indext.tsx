import { PasswordInput, Popover, Progress } from "@mantine/core";
import PasswordRequirement from "../PasswordRequirement";
import { ReactNode, useState } from "react";
import { getStrength } from "../../Helpers/Password";
import { PasswordReqChecker } from "../PasswordReqChecker";

interface Props {
  label: string;
  placeholder?: string;
  password: string;
  onChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lefIcon?: ReactNode;
}

function PassInput({ label, password, placeholder, onChangeAction, lefIcon }: Props) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const strengthPassword = getStrength(password);
  const checkPassword = PasswordReqChecker(password);
  const colorNewPassword =
    strengthPassword === 100
      ? "teal"
      : strengthPassword > 50
      ? "yellow"
      : "red";
  return (
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
          <PasswordInput
            label={label}
            type="password"
            placeholder={placeholder ? placeholder :"********"}
            value={password}
            onChange={onChangeAction}
            style={{ textAlign: "start" }}
            leftSection={lefIcon}
          />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Progress
          color={colorNewPassword}
          value={strengthPassword}
          size={5}
          mb="xs"
        />
        <PasswordRequirement
          label="Includes at least 8 characters"
          meets={password.length > 7}
        />
        {checkPassword}
      </Popover.Dropdown>
    </Popover>
  );
}

export default PassInput;
