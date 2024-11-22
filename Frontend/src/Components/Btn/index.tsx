import { Button, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";

interface ButtonProps {
  onClick?: ()=>void;
  title: string;
  fullWidth?: boolean;
  disabled?: boolean;
  invert?: boolean;
  styles?: React.CSSProperties | undefined;
}

function Btn({onClick, title, fullWidth, disabled, styles, invert}:ButtonProps) {
  const { hovered, ref } = useHover<HTMLButtonElement>();
  const variant = () => hovered ? "outline" : "filled";
  const invertVariant = () =>  "outline";
  return (
    <Button
      color={invert ? "White" : "var(--main-color)"}
      variant={invert ? invertVariant() : variant()}
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
