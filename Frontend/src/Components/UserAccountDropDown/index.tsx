import { Button, Container, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconPackage,
  IconSquareCheck,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import UseUserAccountDropDown from "./useUserAccountDropDown";

function UserAccountDropDown() {
  const { LogOut } = UseUserAccountDropDown();
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
              <IconPackage
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Project
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSquareCheck
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Task
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconUser
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Team
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
    </Container>
  );
}

export default UserAccountDropDown;
