import { ActionIcon, Box, Flex, Popover, rem, Text, Title, Tooltip } from "@mantine/core";
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
  userId: string;
  isBought?: boolean;
}

function TitleOfer({ date, tittle, likeId, offerId, isBought, userId }: Props) {
  const [opened, setOpened] = useState<boolean>(false);
  const { isTokenExpired,GetUserId } = Api();
  const isYourId = userId === GetUserId(); 
  const getColor = (id: string) => (id != Helper.EmptyGuid ? "red" : "white");
  const InvertColor = (color: string) => (color != "red" ? "red" : "white");
  const [heartColor, setColor] = useState<{ id: string; color: string }>({ id: likeId, color: getColor(likeId) });
  const { HandleLikes } = ApiAction();

  const labelText = heartColor.color === "red"
                      ? "Remove from favourites"
                      : "Add to favourites"
  async function handleLike() {
    if (isTokenExpired()) {
      setOpened(true);
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
          <Title
            order={2}
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {tittle}
          </Title>

          {(!isBought && !isYourId) && (
            <Popover
              width={220}
              trapFocus
              opened={opened}
              position="bottom"
              offset={4}
              disabled={!isTokenExpired()}
              onChange={setOpened}
            >
              <Popover.Target>
                <Tooltip label={labelText}><ActionIcon
                  size={36}
                  radius="xl"
                  variant="subtle"
                  color={heartColor.color === "red" ? "red" : "gray"}
                  ml={rem(12)}
                  onClick={handleLike}
                >
                    <IconHeart
                      size={20}
                      fill={heartColor.color}
                    />
                  </ActionIcon>

                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="xs">You have to be logged in to like offers.</Text>
              </Popover.Dropdown>
            </Popover>
          )}
        </Flex>

        <Text c="dimmed" fz="sm">
          Offer added: {date}
        </Text>
      </Flex>
    </Box>
  );
}
export default TitleOfer;
