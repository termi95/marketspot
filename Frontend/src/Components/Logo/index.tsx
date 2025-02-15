import { Box, Group, Image, Text, rem } from "@mantine/core";
import logo from "../../assets/logo.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import { useNavigate } from "react-router-dom";
function Logo() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  return (
    <>
      <Group className="pointer" onClick={() => navigate("/")}>
        <Image src={logo} alt="Market spot logo" h={rem(80)} w={rem(80)} />
        <Box>
          <Text size={rem(isMobile ? 16 : 24)} fw={900} className="text-white">
            Market Spot
          </Text>
        </Box>
      </Group>
    </>
  );
}

export default Logo;
