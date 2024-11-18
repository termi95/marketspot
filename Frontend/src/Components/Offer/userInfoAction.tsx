import { Avatar, Text, Paper, Box } from "@mantine/core";
import Btn from "../Btn";
import { BasicUserInfo } from "../../Types/User";
import { useNavigate } from "react-router-dom";
interface Props {
  user: BasicUserInfo;
}
export function UserInfoAction({ user }: Props) {
  const navigate = useNavigate();
  const fullName = () => `${user.name} ${user.surname}`;
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
        On <Text component="span">Market Spot</Text> from {user.creationDate}
      </Text>
      <Box pt={"sm"}>
        <Btn
          title="User offers"
          fullWidth
          onClick={() => {
            return navigate(`/offers/${user.id}`);
          }}
        />
      </Box>
    </Paper>
  );
}
