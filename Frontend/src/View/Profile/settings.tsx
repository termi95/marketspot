import { Container } from "@mantine/core";
import PersonalInformation from "../../Form/PersonalInformation/personalInformation";
import SettingsChangePassword from "../../Form/SettingChangePassword";
import AdressDetails from "../../Form/AdressDetails/AdressDetails";

function Settings() {
  return (
    <Container miw={"100%"} mt={"md"}>
      <PersonalInformation />
      <AdressDetails />
      <SettingsChangePassword />
    </Container>
  );
}

export default Settings;
