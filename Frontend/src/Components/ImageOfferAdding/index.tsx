import { ActionIcon, Box, Image } from "@mantine/core";
import { IconTrashFilled} from "@tabler/icons-react";
import { useState } from "react";
interface Props {
  index: number;
  imageUrl: string;
  removePhoto: (index: number) => void;
}
function ImageOfferAdding({ index, imageUrl, removePhoto }: Props) {
  const [xVisibility, setXVisibility] = useState<boolean>(false);
  const [sizeTrash, setSizeTrash] = useState<string>("xs");
  return (
    <>
      <Box className="pos-rel" style={{marginBottom: "10px"}} onMouseEnter={() => setXVisibility(true)} onMouseLeave={()=> setXVisibility(false)}>
        <Image
          key={index}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          className="pointer"
        />
        <ActionIcon
          className="pos-abs"
          style={{
            top: "0",
            right: "0",
            visibility: xVisibility ? "visible" : "hidden",
            transform: "translate(50%,-50%)",
          }}
          variant="transparent"
          color="red"
          aria-label="Like post"
          size={sizeTrash}
        >
          <IconTrashFilled onMouseEnter={() => setSizeTrash("md")} onMouseLeave={()=> setSizeTrash("xs")} onClick={()=>removePhoto(index)}/>
        </ActionIcon>
      </Box>
    </>
  );
}

export default ImageOfferAdding;
