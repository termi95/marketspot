import { useEffect, useState } from "react";
import MainPanel from "../../Components/MainPanel";
import SingleOfferOnMainView from "../../Components/SingleOfferOnMainView";
import { Api } from "../../Helpers/Api/Api";
import { SimpleOfferList } from "../../Types/Offer";
import { Flex, Loader, rem, SimpleGrid } from "@mantine/core";

const GetUserOffersEndpoint = "Offer/get-recent";
function MainView() {
  const { PostRequest } = Api();
  const [data, setData] = useState<SimpleOfferList[] | null>(null);
  const [loading, setLoading] = useState(false);
  async function GetOffers(signal: AbortSignal) {
    setLoading(true);
    try {
      const reqResult = await PostRequest<SimpleOfferList[]>(
        GetUserOffersEndpoint,
        {},
        undefined,
        signal
      );
      if (!reqResult.isError && reqResult.result !== undefined) {
        setData(reqResult.result);
        setLoading(false);
      }
    } catch (error) {
      /* empty */
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    GetOffers(signal);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <MainPanel>
      <p>lista</p>
      <SimpleGrid cols={1} w={"100%"}>
        {data?.map((x) => (
          <Flex align={"center"} justify={"center"}>
            <SingleOfferOnMainView
              key={x.id}
              Id={x.id}
              LikeId={x.likeId}
              Tittle={x.tittle}
              Price={x.price}
              AddedAt={x.creationDate}
              Icon={x.photo}
            />
          </Flex>
        ))}
        <Flex align={"center"} justify={"center"} m={rem(12)}>{loading && <Loader color="blue" />}</Flex>
      </SimpleGrid>
    </MainPanel>
  );
}

export default MainView;
