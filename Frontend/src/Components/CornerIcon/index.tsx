import { ActionIcon, Box } from "@mantine/core";
import { IconTrashFilled } from "@tabler/icons-react";
import { useState } from "react";
interface Props {
  Action: (value: string) => void;
  value: string;
  children: React.ReactNode;
}
function CornerIcon({ Action, value, children }: Props) {
  const [xVisibility, setXVisibility] = useState<boolean>(false);
  const [sizeTrash, setSizeTrash] = useState<string>("xs");
  return (
    <>
      <Box
        className="pos-rel"
        style={{ marginBottom: "10px" }}
        onMouseEnter={() => setXVisibility(true)}
        onMouseLeave={() => setXVisibility(false)}
      >
        {children}
        <ActionIcon
          className="pos-abs"
          style={{
            top: "0",
            right: "0",
            visibility: xVisibility ? "visible" : "hidden",
            transform: "translate(50%,-50%)",
            transition: "300ms"
          }}
          variant="transparent"
          color="red"
          aria-label="Trash"
          size={sizeTrash}
        >
          <IconTrashFilled
            onMouseEnter={() => setSizeTrash("md")}
            onMouseLeave={() => setSizeTrash("xs")}
            onClick={() => Action(value)}         
          />
        </ActionIcon>
      </Box>
    </>
  );
}
export default CornerIcon;
