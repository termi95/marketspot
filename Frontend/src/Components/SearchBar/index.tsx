import { useState } from "react";
import { Input, Button, Container, Flex } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { rem } from "@mantine/core";
function SearchBar() {
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
    <Container mr={"5%"} ml={"5%"} w={"100%"}>
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
        <Button
          onClick={handleSearchClick}
          radius="xs"
          variant="outline"
          color="White"
          w="100px"
        >
          Search
        </Button>
      </Flex>
    </Container>
  );
}

export default SearchBar;
