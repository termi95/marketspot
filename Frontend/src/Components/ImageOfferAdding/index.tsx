import { Box, Image, rem } from "@mantine/core";
import CornerIcon from "../CornerIcon";
import { openDeleteModal } from "../Modal";
interface Props {
  index: number;
  imageUrl: string;
  fileName: string;
  removePhoto: (index: number) => void;
}
function ImageOfferAdding({ index, imageUrl, fileName, removePhoto }: Props) {
  const action = () => removePhoto(index);
  const title = "Question";
  const confirmationText = `Are you sure you want to delete photo: ${fileName}`;

  return (
    <Box className="pos-rel">
      <CornerIcon
        Action={() => openDeleteModal(action, title, confirmationText)}
        value={fileName}
        active={true}
      >
        <Image
          id={fileName}
          key={index}
          alt="Offert images"
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
          className="pointer"
          mb={rem(10)}
        />
      </CornerIcon>
    </Box>
  );
}

export default ImageOfferAdding;
