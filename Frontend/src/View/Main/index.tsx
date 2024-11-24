import { useEffect, useRef, useState } from "react";
import MainPanel from "../../Components/MainPanel";
import SingleOfferOnMainView from "../../Components/SingleOfferOnMainView";
import { Api } from "../../Helpers/Api/Api";
import { SimpleOfferList } from "../../Types/Offer";
import { Flex, Loader, rem, SimpleGrid } from "@mantine/core";

const GetUserOffersEndpoint = "Offer/get-recent";

function MainView() {
  const { PostRequest } = Api();
  const [data, setData] = useState<SimpleOfferList[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const afterFirstFetch = useRef(false);

  async function GetOffers(signal: AbortSignal, pageNumber: number) {
    try {
      setLoading(true);
      const reqResult = await PostRequest<SimpleOfferList[]>(
        GetUserOffersEndpoint,
        { page: pageNumber },
        undefined,
        signal
      );
      if (
        !reqResult.isError &&
        reqResult.result !== undefined &&
        reqResult.result.length > 0
      ) {
        setData((prevData) => [...prevData, ...reqResult.result!]);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
        afterFirstFetch.current = true;
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    GetOffers(signal, page);

    return () => {
      controller.abort();
    };
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && afterFirstFetch) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <MainPanel>
      <p>Lista</p>
      <SimpleGrid cols={1} w={"100%"}>
        {data.map((x) => (
          <Flex align={"center"} justify={"center"} key={x.id}>
            <SingleOfferOnMainView
              Id={x.id}
              LikeId={x.likeId}
              Tittle={x.tittle}
              Price={x.price}
              AddedAt={x.creationDate}
              Icon={x.photo}
            />
          </Flex>
        ))}
        <Flex align={"center"} justify={"center"} m={rem(12)}>
          {loading && <Loader color="blue" />}
        </Flex>
        {!loading && <div ref={observerRef} style={{ height: "1px" }} />}
      </SimpleGrid>
    </MainPanel>
  );
}

export default MainView;
