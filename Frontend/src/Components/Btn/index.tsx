import { Button, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";

interface ButtonProps {
  onClick?: ()=>void;
  title: string;
  fullWidth?: boolean;
  disabled?: boolean;
  styles?: React.CSSProperties | undefined;
}

function Btn({onClick, title, fullWidth, disabled, styles}:ButtonProps) {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  return (
    <Button
      color={"var(--main-color)"}
      variant={hovered ? "outline" : "filled"}
      ref={ref}
      style={{
        transition: "300ms",
        height: rem(42), ...styles
      }}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {title}
    </Button>
  );
}

export default Btn;
