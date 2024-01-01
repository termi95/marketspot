import { Button, Container, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconCalendar,
  IconChevronDown,
  IconPackage,
  IconSquareCheck,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";

function UserAccountDropDown() {
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
            rightSection={
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Ctrl + P
              </Text>
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
            rightSection={
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Ctrl + T
              </Text>
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
            rightSection={
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Ctrl + U
              </Text>
            }
          >
            Team
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconCalendar
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            rightSection={
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Ctrl + E
              </Text>
            }
          >
            Event
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Container>
  );
}

export default UserAccountDropDown;
