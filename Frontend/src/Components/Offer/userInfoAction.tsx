import { Avatar, Text, Paper, Box } from "@mantine/core";
import Btn from "../Btn";
import { BasicUserInfo } from "../../Types/User";
interface Props {
  user: BasicUserInfo;
}
export function UserInfoAction({ user }: Props) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
const fullName = () => `${user.name} ${user.surname}`
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
        size={120}
        radius={120}
        mx="auto"
      />
      <Text ta="center" fz="lg" fw={500} mt="md">
        {fullName()}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        On <Text component="span">Market Spot</Text> from
        {yyyy + "/" + mm + "/" + dd}
      </Text>

      <Box pt={"sm"}>
        <Btn title="User offers" fullWidth />
      </Box>
    </Paper>
  );
}
