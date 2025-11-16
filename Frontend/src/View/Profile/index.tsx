import { rem, Tabs } from "@mantine/core";
import MainPanel from "../../Components/MainPanel";
import { IconBasket, IconPhoto, IconReportMoney, IconSettings } from "@tabler/icons-react";
import Settings from "./settings";
import MyOffer from "./myOffer";
import { useNavigate, useParams } from "react-router-dom";
import Likes from "./Likes";

function ProfileView() {
  const iconStyle = { width: rem(22), height: rem(22) };
  const navigate = useNavigate();
  const { tabValue } = useParams();

  return (    
    <MainPanel>
      <Tabs variant="outline" defaultValue="liked" activateTabWithKeyboard={false} keepMounted={false}  value={tabValue} onChange={(value) => navigate(`/profile/${value}`)} >
      <Tabs.List >
        <Tabs.Tab value="liked" leftSection={<IconPhoto style={iconStyle} />}>
          Liked Offer
        </Tabs.Tab>
        <Tabs.Tab value="my-offer" leftSection={<IconReportMoney style={iconStyle} />}>
          My offer
        </Tabs.Tab>
        <Tabs.Tab value="Bought" leftSection={<IconBasket style={iconStyle} />}>
          Bought
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="liked">
        <Likes/>
      </Tabs.Panel>

      <Tabs.Panel value="my-offer">
        <MyOffer/>
      </Tabs.Panel>

      <Tabs.Panel value="Bought">
        <Settings/>
      </Tabs.Panel>

      <Tabs.Panel value="settings">
        <Settings/>
      </Tabs.Panel>
    </Tabs>
    </MainPanel>
  );
}

export default ProfileView;
