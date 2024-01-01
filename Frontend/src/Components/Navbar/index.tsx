import { Group } from "@mantine/core";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import styles from "./navbar.module.css";
import SignInOrLoggedIn from "../SignInOrLoggedIn";

function Navbar() {
  return (
    <nav className={`${styles.navigation_bar}`}>
      <Group>
        <Logo />
        <SearchBar />
        <SignInOrLoggedIn />
      </Group>
    </nav>
  );
}

export default Navbar;
