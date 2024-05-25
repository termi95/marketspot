import { Box, Group, Image, Text, rem } from "@mantine/core";
import logo from "../../Assets/logo.svg";
function Logo() {
  return (
    <>
      <Group>
        <Image src={logo} alt="Market spot logo" h={rem(80)} w={rem(80)} />
        <Box>
          <Text size="xl" fw={900} className="text-white">
            Market Spot
          </Text>
        </Box>
      </Group>
    </>
  );
}

export default Logo;
