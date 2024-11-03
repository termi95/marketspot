import { Box, Flex, rem, Text, Title } from "@mantine/core";
import Btn from "../Btn";

interface Props {
  price: number;
}

function OrderSection({ price }: Props) {
  return (
    <Box
      p={"md"}
      bg="var(--mantine-color-body)"
      style={{
        border:
          "calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-3)",
      }}
    >
      <Flex align={"center"} pb={"sm"}>
        <Title order={4}>Price: </Title>
        <Text size={rem(18)}>{price} PLN</Text>
      </Flex>
      <Btn title="Buy" fullWidth />
    </Box>
  );
}

export default OrderSection;
