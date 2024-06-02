import { Box } from "@mantine/core";
import { useState } from "react";

function DropArea() {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <Box
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
    >
      {showDrop ? "DropArea" : ""}
    </Box>
  );
}

export default DropArea;
