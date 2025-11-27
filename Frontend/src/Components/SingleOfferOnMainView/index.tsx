import { Card, Flex, Image, Text, Stack, Box, Tooltip } from "@mantine/core";
import ActionHeartIcon from "../ActionHeartIcon";
import { useNavigate } from "react-router-dom";
import { Condytion, DeliveryType, NumberToCondytion, NumberToDeliveryType, SimpleOfferList } from "../../Types/Offer";
import { IconPackage, IconSparkles, IconTruck, IconWalk } from "@tabler/icons-react";
interface Props {
  offer: SimpleOfferList;
}
function SingleOfferOnMainView({ offer }: Props) {
  const { id, tittle, price, creationDate, userId, likeId, photo, likesCount } = offer;
  const navigate = useNavigate();
  const openOffer = () => navigate(`/offer/${id}`);
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      w="70%"
      mx="auto"
      mb="md"
      p="sm"
      style={{ cursor: "pointer" }}
      onClick={openOffer}
    >
      <Flex justify="space-between" gap="md" align="center">
        <Image
          src={photo}
          width={180}
          w={180}
          height={130}
          h={130}
          fit="cover"
          radius="md"
          loading="lazy"
          alt={tittle}
          style={{ flexShrink: 0 }}
          onClick={() => navigate(`/offer/${id}`)}
        />
        <Stack gap={"xl"} justify="space-between">
          <Tooltip label={NumberToCondytion[offer.condytion] === Condytion.New ? "Item is new.": "Item is used."}>
            {NumberToCondytion[offer.condytion] === Condytion.New ? <IconSparkles size={25}/> : <IconPackage size={25}/>}
          </Tooltip>
          <Tooltip label={NumberToDeliveryType[offer.deliveryType] === DeliveryType.Shipping ? "Shiping is available.": "Local pickup."}>
            {NumberToDeliveryType[offer.deliveryType] === DeliveryType.Shipping ? <IconTruck size={25}/> : <IconWalk size={25}/> }
          </Tooltip>
        </Stack>

        <Stack gap={"lg"} style={{ flex: 1 }}>
          <Text size="lg" fw={600} lineClamp={1}>
            {tittle}
          </Text>
          <Text size="xs" c="dimmed">
            {creationDate}
          </Text>
        </Stack>

        <Stack gap={8} align="flex-end" style={{ flexShrink: 0 }}>
          <Text fw={700} size="lg">
            {price} zł
          </Text>
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionHeartIcon id={id} likeId={likeId} userId={userId} />
          </Box>
          {likesCount > 0 && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Text size="sm" c="dimmed">
                {likesCount === 1
                  ? "1 person likes this offer"
                  : `${likesCount} people like this offer`}
              </Text>
            </Box>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}

export default SingleOfferOnMainView;
