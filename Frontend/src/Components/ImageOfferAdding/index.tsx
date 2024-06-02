import { Box, Image, rem } from "@mantine/core";
import DropArea from "../DropArea";
import CornerIcon from "../CornerIcon";
import { openDeleteModal } from "../Modal";
interface Props {
  index: number;
  imageUrl: string;
  fileName: string;
  removePhoto: (index: number) => void;
  setDragingPhoto: React.Dispatch<React.SetStateAction<number | null>>;
}
function ImageOfferAdding({
  index,
  imageUrl,
  fileName,
  removePhoto,
  setDragingPhoto,
}: Props) {
  const action = () => removePhoto(index);
  const title = "Question";
  const confirmationText = `Are you sure you want to delete photo: ${fileName}`;

  return (
    <>
      <DropArea />
      <Box
        className="pos-rel"
        mb={rem(10)}
        draggable
        onDragStart={() => {console.log("drag start"); setDragingPhoto(index)}}
        onDragEnd={() => setDragingPhoto(null)}
      >
      <CornerIcon Action={()=>openDeleteModal(action, title , confirmationText)} value={fileName}>        
        <Image
          key={index}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          className="pointer"
        />
        </CornerIcon>
      </Box>
      <DropArea />
    </>
  );
}

export default ImageOfferAdding;
