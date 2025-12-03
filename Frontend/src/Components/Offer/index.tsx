import { Box, Card, Container, Divider, Grid, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import CardsCarousel from "../CardsCarousel";
import { UserInfoAction } from "./userInfoAction";
import TitleOfer from "./tittle";
import ReturnBtn from "../ReturnBtn";
import OrderSection from "./orderSection";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { DeliveryType, DeliveryTypeToNumber, MainOfferView } from "../../Types/Offer";
import EditSection from "./EditSection";
import PuckupSection from "./PickupSection";

const GetUserOffersEndpoint = "Offer/Get-by-id";
function Offer() {
  const { id } = useParams<{ id: string }>();

  const { PostRequest, GetUserId } = Api();
  const [offer, setOffer] = useState<MainOfferView>();
  async function GetOffer(signal: AbortSignal) {
    try {
      const reqResult = await PostRequest<MainOfferView>(
        GetUserOffersEndpoint,
        { id },
        undefined,
        signal
      );
      if (!reqResult.isError && reqResult.result !== undefined) {
        setOffer(reqResult.result);
      }
    } catch (error) {
      /* empty */
    }
  }


  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    GetOffer(signal);
    return () => {
      controller.abort();
    };
  }, []);

  if (offer === undefined) {
    return;
  }

  const showOrderSection = !offer.isBought && offer.deliveryType !== DeliveryTypeToNumber[DeliveryType.LocalPickup];
  const showEditSection = GetUserId() === offer.user.id && !offer.isBought;
  const showDeliverySection = offer.deliveryType === DeliveryTypeToNumber[DeliveryType.LocalPickup];
  return (
    <>
      <ReturnBtn />
      <Container fluid px="md">
        <Box mt={"md"} mb={"md"}>
          <TitleOfer
            date={offer.creationDate}
            tittle={offer.tittle}
            likeId={offer.likeId}
            offerId={offer.id}
            isBought={offer.isBought}
          />
          <Divider my="sm" />
          <Grid>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <CardsCarousel images={offer.photos} />
            </Grid.Col><Grid.Col span={{ base: 12, md: 3 }}>
              <Box h={"100%"}>
                <Stack gap="md">
                  <UserInfoAction user={offer.user} />

                  {showOrderSection && (
                    <OrderSection offer={offer} />
                  )}

                  {showDeliverySection && (
                    <PuckupSection address={offer.pickupAddress} />
                  )}

                  {showEditSection && (
                    <EditSection id={offer.id} />
                  )}
                </Stack>
              </Box>
            </Grid.Col>

          </Grid>
          <Divider my="xl" />

          <Card
            withBorder
            shadow="sm"
            radius="md"
            p="lg"
            mt="lg"
            mb="xl"
            style={{ backgroundColor: "var(--mantine-color-white)" }}
          >
            <Title order={3} mb="md" ta="left">
              Description
            </Title>

            <Divider mb="md" />

            <Text
              size="md"
              ta="justify"
              style={{
                lineHeight: 1.6,
                maxWidth: "100%",
              }}
            >
              {offer.description}
            </Text>
          </Card>

        </Box>
      </Container>
    </>
  );
}

export default Offer;
