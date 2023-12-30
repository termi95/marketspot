import { Group } from "@mantine/core";
import logo from "../../assets/logo.svg";
import styles from "./logo.module.css";
function Logo() {
  return (
    <>
      <Group>
        <img src={logo} alt="Market spot logo" className={styles.logo} />
        <span>
          <h1 className="text-white">Market Spot</h1>
        </span>
      </Group>
    </>
  );
}

export default Logo;
