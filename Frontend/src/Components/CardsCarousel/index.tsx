import { AspectRatio, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

interface Props {
  images: string[]
}

function CardsCarousel({images}:Props) {
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
    <Carousel
      height={400}
      // slideSize="33.333333%"
      align="center"
      // slidesToScroll={mobile ? 1 : 2}
      withIndicators
    >
      {slides}
    </Carousel>
  );
}

export default CardsCarousel;
