import { Button, Container, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconChevronDown,
  IconFilePlus,
  IconLogout,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import DropDownAction from "./Action/DropDownAction";

function UserDropDown() {
    const { LogOut, NavigateTo } = DropDownAction();
  return (
    <Container mr="15px">
      <Menu
        transitionProps={{ transition: "pop-top-right" }}
        position="top-end"
        width={220}
        withinPortal
      >
        <Menu.Target>
          <Button radius="xs" variant="outline" color="White">
            <Group gap="xs">
              <IconUserCircle />
              <Text>Your account</Text>
              <IconChevronDown />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconFilePlus
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={() => NavigateTo("/adding")}
          >
            Add offer
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconUser
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={() => NavigateTo("/profile")}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={LogOut}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Container>);
}
export default UserDropDown