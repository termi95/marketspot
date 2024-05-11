import { Box, Group, Image, Text } from "@mantine/core";
import logo from "../../assets/logo.svg";
import styles from "./logo.module.css";
function Logo() {
  return (
    <>
      <Group>
        <Image src={logo} alt="Market spot logo" className={styles.logo} />
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
