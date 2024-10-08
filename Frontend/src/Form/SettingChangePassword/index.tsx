import { Box, Fieldset, Group, rem } from "@mantine/core";
import Btn from "../../Components/Btn";
import { UseSettingChangePassword } from "./UseSettingChangePassword";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";
import { getStrength } from "../../Helpers/Password";
import PassInput from "../../Components/PassInput/indext";
import { IconLock } from "@tabler/icons-react";

function SettingsChangePassword() {
  const { Submit, SubmitOnEnter, ChangePasswordProp, passwordState } =
    UseSettingChangePassword();
  const bothPasswordFieldPassReq =
    getStrength(passwordState.newPassword) !== 100 &&
    getStrength(passwordState.newRePassword) !== 100;

  return (
    <form
      onKeyDown={(e) => {
        if (!bothPasswordFieldPassReq) {
          SubmitOnEnter(e);
        }
      }}
    >
      <Fieldset
        legend="Change password"
        style={{ textAlign: "start" }}
        mt={"md"}
      >
        <Box mt={"xs"}>
          <PassInput
            label="New password"
            password={passwordState.newPassword}
            onChangeAction={(e) =>
              ChangePasswordProp(e.target.value, "newPassword")
            }
            lefIcon={<IconLock style={{ width: rem(18), height: rem(18) }} />}
          />
        </Box>
        <Box mt={"md"}>
          <PassInput
            label="Confirm new password"
            password={passwordState.newRePassword}
            onChangeAction={(e) =>
              ChangePasswordProp(e.target.value, "newRePassword")
            }
            lefIcon={<IconLock style={{ width: rem(18), height: rem(18) }} />}
          />
        </Box>
        <Group justify="flex-end" mt="md">
          <Btn
            title="Submit"
            disabled={bothPasswordFieldPassReq}
            onClick={() => OpenPasswordConfirmationModal(Submit)}
          />
        </Group>
      </Fieldset>
    </form>
  );
}

export default SettingsChangePassword;
