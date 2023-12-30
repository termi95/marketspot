import { Button, Container } from "@mantine/core";
import { IconLogin2 } from "@tabler/icons-react";
import { rem, Text, Space } from "@mantine/core";

function SignInButton() {
  return (
    <Container m="10">
      <Button radius="xs" variant="outline" color="White">
        <Text size="md">Sign in</Text>
        <Space w="xs" />
        <IconLogin2 style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </Button>
    </Container>
  );
}

export default SignInButton;
