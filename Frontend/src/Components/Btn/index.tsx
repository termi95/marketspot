import { Button, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";

// to do Make your own custom button
function Btn() {
    const { hovered, ref } = useHover<HTMLButtonElement>();
    return (           
        <Button
          color={"var(--main-color)"}
          variant={hovered ? "outline" : "filled"}
          ref={ref}          
          style={{
            transition: "300ms",
            height: rem(42),
          }}
        >
          Chose your category
        </Button> );
}

export default Btn;