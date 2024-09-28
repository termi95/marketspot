import { useState } from "react";
import { Box, TextInput } from "@mantine/core";
import Btn from "../Btn";
import { modals } from "@mantine/modals";

interface Props {
  onClick: (password: string) => void;
}

function PasswordConfirmationAction({ onClick }: Props) {
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onClick(password);
      modals.closeAll();
    }
  }

  return (
    <>
      <form onKeyDown={handleSubmit}>
        <Box style={{ textAlign: "start" }}>
          <TextInput
            label="Confirm with your current password."
            placeholder="********"
            type="password"
            data-autofocus
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Box mt="md">
            <Btn
              title="Submit"
              fullWidth
              onClick={() => {
                onClick(password);
                modals.closeAll();
              }}
            />
          </Box>
        </Box>
      </form>
    </>
  );
}

export function OpenPasswordConfirmationModal(onClick: (password: string) => void) {
  modals.open({
    title: "Confirmation",
    children: <PasswordConfirmationAction onClick={onClick} />,
  });
}

export default OpenPasswordConfirmationModal;
