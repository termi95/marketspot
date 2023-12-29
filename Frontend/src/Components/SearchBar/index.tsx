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
    <Container>
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
          radius="md"
        />
        <Button onClick={handleSearchClick} radius="md">
          Search
        </Button>
      </Flex>
    </Container>
  );
}

export default SearchBar;
