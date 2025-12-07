import { AspectRatio, Image, Card, rem, Modal, Box } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useState } from "react";

interface Props {
  images: string[];
}

function CardsCarousel({ images }: Props) {
  const [opened, setOpened] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
          style={{ cursor: "pointer" }}
          onClick={() => {
            setCurrentIndex(index);
            setOpened(true);
          }}
        />
      </AspectRatio>
    </Carousel.Slide>
  ));

  const fullscreenSlides = images.map((item, index) => (
    <Carousel.Slide key={index}>
      <Box
        w="100%"
        h="100vh"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <Image
          src={URL.createObjectURL(convertBase64ToBlob(item))}
          fit="contain"
          h="100%"
          w="100%"
          fallbackSrc="https://placehold.co/1200x800?text=Placeholder"
        />
      </Box>
    </Carousel.Slide>
  ));

  return (
    <>
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
          slideGap="sm"
        >
          {slides}
        </Carousel>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="100%"
        padding={0}
        fullScreen
        withCloseButton={false}
        styles={{
          body: { padding: 0, backgroundColor: "black" },
        }}
      >
        <Carousel
          key={currentIndex}
          height="100vh"
          initialSlide={currentIndex}
          withIndicators
          controlSize={40}
          emblaOptions={{
            loop: true,
            align: "center",
            dragFree: false,
          }}
          styles={{
            control: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "var(--mantine-shadow-sm)",
              borderRadius: "50%",
            },
            indicator: {
              width: rem(8),
              height: rem(8),
            },
          }}
        >
          {fullscreenSlides}
        </Carousel>
      </Modal>

    </>
  );
}

export default CardsCarousel;
