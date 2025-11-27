import { Box, Button, Flex, Grid, rem, Tooltip } from "@mantine/core";
import Logo from "../Logo";
import SignInOrLoggedIn from "../SignInOrLoggedIn";
import { RootState } from "../../State/store";
import { useSelector } from "react-redux";
import { IconHeart } from "@tabler/icons-react";
import { Api } from "../../Helpers/Api/Api";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { isTokenExpired } = Api();

  const heart = (
    <Tooltip label={"Offer you liked"}>
      <Button bg={"var(--main-color)"} onClick={() => navigate(`/profile/liked`)}>
        <IconHeart style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      </Button>
    </Tooltip>)

  return (
    <nav style={{ backgroundColor: "var(--main-color)" }}>
      <Grid align="center" justify="center" overflow="hidden">
        <Grid.Col span={{ base: 6, sm: 6, md: 4 }} order={{ base: 1, xs: 1, sm: 1, md: 1 }}>
          <Logo />
        </Grid.Col>
        <Grid.Col span={{ base: 4, sm: 6, md: 4 }} order={{ base: 2, xs: 2, sm: 2, md: 3 }}>
          <Flex justify="flex-end">
            {!isTokenExpired() && heart}
            <Box>
              <SignInOrLoggedIn />
            </Box>
          </Flex>
          <Flex justify={isMobile ? "center" : "flex-end"}>
          </Flex>
        </Grid.Col>
      </Grid>
    </nav>
  );
}

export default TopBar;
