import { Group } from "@mantine/core";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import styles from "./navbar.module.css";
import SignInOrLoggedIn from "../SignInOrLoggedIn";
import { RootState } from "../../State/store";
import { useSelector } from "react-redux";

function TopBar() {  
  const { isMobile } = useSelector((state: RootState) => state.user);
  return (
    <nav className={`${styles.navigation_bar}`}>
      <Group gap="xs" grow preventGrowOverflow={!isMobile}>
        <Logo />
        <SearchBar />
        <SignInOrLoggedIn />
      </Group>
    </nav>
  );
}

export default TopBar;
