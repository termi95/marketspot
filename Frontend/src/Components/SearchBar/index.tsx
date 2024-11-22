import { useState } from "react";
import { Input, Container, Flex } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import Btn from "../Btn";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
function SearchBar() {
  const { isMobile } = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    console.log(`Searching for "${searchQuery}"...`);
  };

  return (
    <Container mr={"5%"} ml={"5%"} w={"100%"} m={isMobile ? 15 : 0}>
      <Flex>
        <Input
          placeholder="Search"
          leftSection={
            <IconSearch
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          }
          value={searchQuery}
          onChange={handleSearchInputChange}
          radius="xs"
          w={"100%"}
        />
        <Btn title="Search" onClick={handleSearchClick} invert styles={{height:"", width:"100px", borderRadius: "var(--mantine-radius-xs)"}}/>
      </Flex>
    </Container>
  );
}

export default SearchBar;
