import { ActionIcon, rem, Tooltip } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import ApiAction from "../Offer/apiAction";
import { Api } from "../../Helpers/Api/Api";
import { Helper } from "../../Types/Helper";
import { useState } from "react";
interface Props {
  action?: () => void;
  likeId: string;
  id: string;
}
function ActionHeartIcon({ action, likeId, id }: Props) {
  const { HandleLikes } = ApiAction();
  const { isTokenExpired } = Api();
  const getColor = () => (likeId != Helper.EmptyGuid ? "red" : "white");
  const InvertColor = () => (heartColor != "red" ? "red" : "white");
  const [heartColor, setColor] = useState<string>(getColor());

  async function handleLike() {
    if (isTokenExpired()) return;
    setColor(InvertColor());
    await HandleLikes(likeId, id);
    if (action) action();
  }
  return (
    <ActionIcon
      id={id}
      size={42}
      variant="transparent"
      color="red"
      aria-label="Remove like"
      onClick={async () => await handleLike()}
      style={{ backgroundColor: "transparent" }}
      disabled={isTokenExpired()}
    >
      <Tooltip label={isTokenExpired() ? "You have to be login to like offerts." : "Like"}>
        <IconHeart
          fill={heartColor}
          style={{ width: rem(24), height: rem(24) }}
          stroke={1.5}
        />
      </Tooltip>
    </ActionIcon>
  );
}
export default ActionHeartIcon;
