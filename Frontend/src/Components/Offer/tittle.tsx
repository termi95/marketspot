import { Box, Flex, rem, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

interface Props {
  date: string;
  tittle: string;
}

function TitleOfer({ date, tittle }: Props) {
  return (
    <Box>
      <Flex m={"md"} align={"start"} direction={"column"}>
        <Flex align={"center"}>
          <Title order={2}>{tittle}</Title>
          <IconHeart
            color="var(--mantine-color-gray-9)"
            fill="red"
            className="pointer"
            style={{ marginLeft: rem(12) }}
          />
        </Flex>
        <Text c="dimmed" fz="sm">
          Offer add: {date}
        </Text>
      </Flex>
    </Box>
  );
}
export default TitleOfer;
