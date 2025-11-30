import { AspectRatio, Image, Card, rem } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

interface Props {
  images: string[];
}

function CardsCarousel({ images }: Props) {
  function convertBase64ToBlob(base64Image: string) {
    const parts = base64Image.split(";base64,");
    const imageType = parts[0].split(":")[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  if (!images || images.length === 0) {
    return null;
  }

  const slides = images.map((item, index) => (
    <Carousel.Slide key={index}>
      <AspectRatio ratio={16 / 9}>
        <Image
          src={URL.createObjectURL(convertBase64ToBlob(item))}
          fit="contain"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          mah={400}
        />
      </AspectRatio>
    </Carousel.Slide>
  ));

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p="md"
      style={{ backgroundColor: "var(--mantine-color-white)" }}
    >
      <Carousel
        height={400}
        emblaOptions={{
          loop: true,
          dragFree: false,
          align: "center",
        }}
        withIndicators
        controlSize={32}
        controlsOffset="xs"
        styles={{
          control: {
            backgroundColor: "var(--mantine-color-white)",
            boxShadow: "var(--mantine-shadow-sm)",
            borderRadius: "50%",
            "&:hover": {
              transform: "scale(1.05)",
            },
          },
          indicator: {
            width: rem(8),
            height: rem(8),
          },
        }}
      >
        {slides}
      </Carousel>
    </Card>
  );
}

export default CardsCarousel;
