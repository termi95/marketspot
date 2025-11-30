import { Container } from "@mantine/core";
import PersonalInformation from "../../Form/PersonalInformation/personalInformation";
import SettingsChangePassword from "../../Form/SettingChangePassword";
import AddressesManager from "../../Components/AddressesManager/AddressesManager";

function Settings() {
  return (
    <Container miw={"100%"} mt={"md"}>
      <PersonalInformation />
      <AddressesManager />
      <SettingsChangePassword />
    </Container>
  );
}

export default Settings;
