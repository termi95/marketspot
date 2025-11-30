import { Box, Flex, Text, Title, Stack, rem } from "@mantine/core";
import { IconMapPin, IconPhone } from "@tabler/icons-react";
import { OfferAddress } from "../../Types/Offer";

interface Props {
  address: OfferAddress;
}

function PickupSection({ address }: Props) {
  return (
    <Box
      p="md"
      bg="var(--mantine-color-body)"
      style={{
        border:
          "calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-3)",
        borderRadius: rem(6),
      }}
    >
      <Title order={4} mb="xs">
        Pickup details
      </Title>

      <Stack gap={4}>
        <Flex align="center" gap="xs">
          <IconMapPin size={18} />
          <Text size="md">
            {address.street}, {address.city}
          </Text>
        </Flex>

        <Flex align="center" gap="xs">
          <IconPhone size={18} />
          <Text size="md">{address.phone}</Text>
        </Flex>
      </Stack>
    </Box>
  );
}

export default PickupSection;
