import { Button, Container, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconCategory,
  IconChevronDown,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import DropDownAction from "./Action/DropDownAction";
import { Link } from "react-router-dom";

function AdminDropDown() {
  const { LogOut } = DropDownAction();
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
          <Link to={"/add-category"}>
            <Menu.Item
              leftSection={
                <IconCategory
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              Add category
            </Menu.Item>
          </Link>
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
export default AdminDropDown;
