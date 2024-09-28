import { rem, Tabs } from "@mantine/core";
import MainPanel from "../../Components/MainPanel";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import Settings from "./settings";

function ProfileView() {
  const iconStyle = { width: rem(22), height: rem(22) };
  return (
    
    <MainPanel>
      <Tabs variant="outline" defaultValue="gallery" activateTabWithKeyboard={false} keepMounted={false} >
      <Tabs.List >
        <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
          Gallery
        </Tabs.Tab>
        <Tabs.Tab value="messages" leftSection={<IconMessageCircle style={iconStyle} />}>
          Messages
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="messages">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings">
        <Settings/>
      </Tabs.Panel>
    </Tabs>
    </MainPanel>
  );
}

export default ProfileView;
