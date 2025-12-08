import { Card, Flex, Image, Text, Stack, Box, Tooltip } from "@mantine/core";
import ActionHeartIcon from "../ActionHeartIcon";
import { useNavigate } from "react-router-dom";
import { Condytion, DeliveryType, NumberToCondytion, NumberToDeliveryType, SimpleOfferList, } from "../../Types/Offer";
import { IconPackage, IconSparkles, IconTruck, IconWalk } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Helper } from "../../Types/Helper";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  offer: SimpleOfferList;
}

function SingleOfferOnMainView({ offer }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [localOffer, setLocalOffer] = useState(offer);

  useEffect(() => {
    setLocalOffer(offer);
  }, [offer]);

  const { id, tittle, price, creationDate, userId, likeId, photo, likesCount } = localOffer;
  const navigate = useNavigate();
  const openOffer = () => navigate(`/offer/${id}`);

  const conditionIsNew = NumberToCondytion[offer.condytion] === Condytion.New;
  const isShipping = NumberToDeliveryType[offer.deliveryType] === DeliveryType.Shipping;
  const conditionElement =
    <Tooltip label={conditionIsNew ? "Item is new." : "Item is used."}>
      {conditionIsNew ? <IconSparkles size={24} /> : <IconPackage size={24} />}
    </Tooltip>
  const shipingElement =
    <Tooltip label={isShipping ? "Shipping is available." : "Local pickup."}>
      {isShipping ? <IconTruck size={24} /> : <IconWalk size={24} />}
    </Tooltip>
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      w={isMobile ? "100%" : "70%"}
      mx="auto"
      mb="md"
      p="sm"
      style={{ cursor: "pointer" }}
      onClick={openOffer}
    >
      <Flex
        gap="md"
        align={isMobile ? "flex-start" : "center"}
        direction={isMobile ? "column" : "row"}
      >
        <Image
          src={photo}
          w={isMobile ? "100%" : 180}
          h={isMobile ? 200 : 130}
          fit="cover"
          radius="md"
          loading="lazy"
          alt={tittle}
          style={{ flexShrink: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/offer/${id}`);
          }}
        />
        <Flex
          gap="md"
          align={isMobile ? "center" : "flex-start"}
          justify="space-between"
          style={{ flex: 1 }}
          direction={isMobile ? "column" : "row"}
          w={"100%"}
        >
          {isMobile ? (
            <Flex gap="sm" justify="space-between" w="100%">
              {conditionElement}
              {shipingElement}
            </Flex>
          ) : (
            <Stack gap="xs" align="center" justify="center">
              {conditionElement}
              {shipingElement}
            </Stack>
          )}

          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Text size="lg" fw={600} lineClamp={isMobile ? 2 : 1}>
              {tittle}
            </Text>
            <Text size="xs" c="dimmed">
              {creationDate}
            </Text>
          </Stack>
        </Flex>

        {isMobile ? (
          <Flex justify="space-between" align="center" w="100%">
            <Text fw={700} size="lg">
              {price} zł
            </Text>

            <Box
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ActionHeartIcon
                id={id}
                likeId={likeId}
                userId={userId}
                action={(newLikeId: string) => {
                  setLocalOffer((prev) => ({
                    ...prev,
                    likeId: newLikeId,
                    likesCount:
                      newLikeId !== Helper.EmptyGuid
                        ? prev.likesCount + 1
                        : Math.max(0, prev.likesCount - 1),
                  }));
                }}
              />
            </Box>
          </Flex>
        ) : (
          <Stack gap={8} align="flex-end" style={{ flexShrink: 0 }}>
            <Text fw={700} size="lg">
              {price} zł
            </Text>

            <Stack gap={0} align="flex-end">
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ActionHeartIcon
                  id={id}
                  likeId={likeId}
                  userId={userId}
                  action={(newLikeId: string) => {
                    setLocalOffer((prev) => ({
                      ...prev,
                      likeId: newLikeId,
                      likesCount:
                        newLikeId !== Helper.EmptyGuid
                          ? prev.likesCount + 1
                          : Math.max(0, prev.likesCount - 1),
                    }));
                  }}
                />
              </Box>

              <Text
                size="sm"
                c="dimmed"
                style={{
                  visibility: likesCount > 0 ? "visible" : "hidden",
                  marginTop: "-2px",
                }}
              >
                {likesCount === 1
                  ? "1 person likes this offer"
                  : `${likesCount} people like this offer`}
              </Text>
            </Stack>
          </Stack>
        )}
      </Flex>
    </Card>
  );
}

export default SingleOfferOnMainView;
