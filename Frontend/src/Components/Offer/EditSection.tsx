import { Box, Flex, Title } from "@mantine/core";
import Btn from "../Btn";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
}

function EditSection({ id }: Props) {
  const navigate = useNavigate();
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
        <Title order={4}>You can always edit your offer </Title>
      </Flex>
      <Btn title="Edit" fullWidth onClick={() => navigate(`/offer/update/${id}`)}/>
    </Box>
  );
}

export default EditSection;
