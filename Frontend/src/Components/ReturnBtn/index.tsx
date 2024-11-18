import { ActionIcon, Flex, Grid, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function ReturnBtn() {
  const navigate = useNavigate();
  return (
    <Grid>
      <Grid.Col span={1}>
        <Flex align="center" className="pointer" onClick={() => navigate(-1)}>
          <ActionIcon
            size="xl"
            variant="transparent"
            color="Black"
            aria-label="Return"
            >
            <IconArrowLeft />
          </ActionIcon>
          <Title order={4}>Return</Title>
        </Flex>
      </Grid.Col>      
      <Grid.Col span={11}></Grid.Col>
    </Grid>
  );
}

export default ReturnBtn;
