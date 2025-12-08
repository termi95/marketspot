import { Box, Card, Container, Divider, Grid, Stack, Title, } from "@mantine/core";
import { useParams } from "react-router-dom";
import CardsCarousel from "../CardsCarousel";
import { UserInfoAction } from "./userInfoAction";
import TitleOfer from "./tittle";
import ReturnBtn from "../ReturnBtn";
import OrderSection from "./orderSection";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { DeliveryType, DeliveryTypeToNumber, MainOfferView, } from "../../Types/Offer";
import EditSection from "./EditSection";
import PuckupSection from "./PickupSection";
import MarkAsBoughtSection from "./MarkAsBoughtSection";
import DOMPurify from "dompurify";

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
    } catch {
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

  if (!offer) {
    return null;
  }

  const showOrderSection =
    !offer.isBought &&
    offer.deliveryType !== DeliveryTypeToNumber[DeliveryType.LocalPickup];

  const showEditSection = GetUserId() === offer.user.id && !offer.isBought;

  const showDeliverySection =
    offer.deliveryType === DeliveryTypeToNumber[DeliveryType.LocalPickup];

  return (
    <>
      <ReturnBtn />
      <Container fluid px="md">
        <Box mt="md" mb="md">
          <TitleOfer offer={offer}/>

          <Divider my="sm" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap="md">
                <Card
                  withBorder
                  shadow="sm"
                  radius="md"
                  p="md"
                  style={{ backgroundColor: "var(--mantine-color-white)" }}
                >
                  <CardsCarousel images={offer.photos} />
                </Card>

                <Card
                  withBorder
                  shadow="sm"
                  radius="md"
                  p="lg"
                  style={{ backgroundColor: "var(--mantine-color-white)" }}
                >
                  <Title order={3} mb="md" ta="left">
                    Description
                  </Title>

                  <Divider mb="md" />

                  <Box
                    style={{
                      lineHeight: 1.6,
                      maxWidth: "100%",
                      textAlign: "justify",
                      fontSize: "16px",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(offer.description),
                    }}
                  />
                </Card>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <Box h="100%">
                <Stack gap="md">
                  <UserInfoAction user={offer.user} />

                  {showOrderSection && <OrderSection offer={offer} />}

                  {showDeliverySection && (
                    <PuckupSection address={offer.pickupAddress} />
                  )}

                  {showEditSection && (
                    <>
                      <EditSection id={offer.id} />
                      <MarkAsBoughtSection
                        id={offer.id}
                        tittle={offer.tittle}
                      />
                    </>
                  )}
                </Stack>
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Offer;
