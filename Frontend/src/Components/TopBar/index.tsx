import { Group } from "@mantine/core";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import SignInOrLoggedIn from "../SignInOrLoggedIn";
import { RootState } from "../../State/store";
import { useSelector } from "react-redux";

function TopBar() {  
  const { isMobile } = useSelector((state: RootState) => state.user);
  return (
    <nav style={{backgroundColor:"var(--main-color)"}}>
      <Group gap="xs" grow preventGrowOverflow={!isMobile}>
        <Logo />
        <SearchBar />
        <SignInOrLoggedIn />
      </Group>
    </nav>
  );
}

export default TopBar;
