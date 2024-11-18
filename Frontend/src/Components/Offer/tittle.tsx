import { Box, Flex, rem, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { Helper } from "../../Types/Helper";
import ApiAction from "./apiAction";
import { useState } from "react";
import { Api } from "../../Helpers/Api/Api";

interface Props {
  date: string;
  tittle: string;
  likeId: string;
  offerId: string;
}

function TitleOfer({ date, tittle, likeId, offerId }: Props) {
  const { isTokenExpired } = Api();
  const getColor = (id: string) => (id != Helper.EmptyGuid ? "red" : "white");
  const InvertColor = (color: string) => (color != "red" ? "red" : "white");
  const [heartColor, setColor] = useState<{ id: string; color: string }>({
    id: likeId,
    color: getColor(likeId),
  });
  const { HandleLikes } = ApiAction();

  async function handleLike() {
    if (isTokenExpired()) {
      return;
    }
    setColor({ id: heartColor.id, color: InvertColor(heartColor.color) });
    const id = await HandleLikes(heartColor.id, offerId);
    setColor({ id: id, color: getColor(id) });
  }
  return (
    <Box>
      <Flex m={"md"} align={"start"} direction={"column"}>
        <Flex align={"center"}>
          <Title order={2}>{tittle}</Title>
          <IconHeart
            color="var(--mantine-color-gray-9)"
            fill={heartColor.color}
            className="pointer"
            style={{ marginLeft: rem(12) }}
            onClick={handleLike}
          />
        </Flex>
        <Text c="dimmed" fz="sm">
          Offer added: {date}
        </Text>
      </Flex>
    </Box>
  );
}
export default TitleOfer;
