import { Box, Flex, rem, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { Helper } from "../../Types/Helper";
import ApiAction from "./apiAction";
import { useState } from "react";

interface Props {
  date: string;
  tittle: string;
  likeId: string;
  offerId: string;
}

function TitleOfer({ date, tittle, likeId, offerId}: Props) {
  const getColor = (id:string) => id !=  Helper.EmptyGuid  ? "red" : "white";
  const [heartColor, setColor] = useState<{id:string, color:string}>({id:likeId, color:getColor(likeId)});
  const {HandleLikes} = ApiAction();
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
            onClick={async ()=> {const id = await HandleLikes(heartColor.id,offerId); setColor({id:id, color:getColor(id)});}}            
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
