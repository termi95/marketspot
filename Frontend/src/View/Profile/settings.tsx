import { Container } from "@mantine/core";
import PersonalInformation from "../../Form/PersonalInformation/personalInformation";
import SettingsChangePassword from "../../Form/SettingChangePassword";

function Settings() {
  return (
    <Container miw={"100%"} mt={"md"}>
      <PersonalInformation />
      <SettingsChangePassword />
    </Container>
  );
}

export default Settings;
