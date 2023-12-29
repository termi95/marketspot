import { Group } from "@mantine/core";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import styles from "./navbar.module.css";
import SignInButton from "../SignInButton";
import UserAccountDropDown from "../UserAccountDropDown";

function Navbar() {
  return (
    <nav className={`${styles.navigation_bar}`}>
      <Group>
        <Logo />
        <SearchBar />
        <SignInButton/>
        <UserAccountDropDown/>
      </Group>
    </nav>
  );
}

export default Navbar;
