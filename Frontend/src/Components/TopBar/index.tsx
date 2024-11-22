import { Flex, Grid } from "@mantine/core";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import SignInOrLoggedIn from "../SignInOrLoggedIn";
import { RootState } from "../../State/store";
import { useSelector } from "react-redux";

function TopBar() {  
  const { isMobile } = useSelector((state: RootState) => state.user);
  return (
    <nav style={{backgroundColor:"var(--main-color)"}}>
    <Grid align="center" justify="center" overflow="hidden">
      <Grid.Col span={{base: 6, sm: 6, md: 4}} order={{base: 1, xs:1, sm: 1, md: 1 }}>
        <Logo />
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 4}} offset={isMobile ? -1 : 0}  order={{base: 3, xs:3,  sm: 3, md: 2 }}>
        <SearchBar />
      </Grid.Col>
      <Grid.Col span={{base: 4, sm: 6, md: 4}}  order={{base: 2, xs:2, sm: 2, md: 3 }}>
        <Flex justify={ isMobile ? "center" : "flex-end"}>
        <SignInOrLoggedIn />
        </Flex>
      </Grid.Col>
    </Grid>
    </nav>
  );
}

export default TopBar;
