import { Box, Divider, Grid, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import CardsCarousel from "../CardsCarousel";
import { UserInfoAction } from "./userInfoAction";
import TitleOfer from "./tittle";
import ReturnBtn from "../ReturnBtn";
import OrderSection from "./orderSection";
import { useEffect, useState } from "react";
import { Api } from "../../Helpers/Api/Api";
import { MainOfferView } from "../../Types/Offer";

const GetUserOffersEndpoint = "Offer/Get-by-id";
function Offer() {
  const { id } = useParams<{ id: string }>();

  const border = { borderColor: "red", padding: 0 };
  const { PostRequest } = Api();
  const [offer, setOffer] = useState<MainOfferView>();
  async function GetOffer(signal: AbortSignal) {
    try {
      const reqResult = await PostRequest<MainOfferView>(
        GetUserOffersEndpoint,
        {id},
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

  if (offer === undefined)
  {
    return;
  }

  return (
    <>
      <ReturnBtn />
      <Box style={border} mt={"md"} mb={"md"}>
        <TitleOfer
          date={offer.creationDate}
          tittle={offer.tittle}
          likeId={offer.likeId}
          offerId={offer.id}
        />
        <Divider my="md" />
        <Grid>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <CardsCarousel images={offer.photos}/>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Box style={border} h={"100%"}>
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <Box>
                    <UserInfoAction user={offer.user}/>
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                  <OrderSection price={offer.price} />
                </Grid.Col>
              </Grid>
            </Box>
          </Grid.Col>
        </Grid>
        <Divider my="md" />
        <Box className="text-start">
          <label>
            <Title order={3} m={"md"}>
              Description:
            </Title>
            <Text m={"md"}>
              {offer.description}
            </Text>
          </label>
        </Box>
      </Box>
    </>
  );
}

export default Offer;
