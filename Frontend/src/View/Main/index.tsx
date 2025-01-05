import { useEffect, useRef, useState } from "react";
import MainPanel from "../../Components/MainPanel";
import SingleOfferOnMainView from "../../Components/SingleOfferOnMainView";
import { Api } from "../../Helpers/Api/Api";
import { SearchQuery, SimpleOfferList } from "../../Types/Offer";
import {
  Box,
  Breadcrumbs,
  Divider,
  Flex,
  Loader,
  rem,
  SimpleGrid,
} from "@mantine/core";
import { Helper } from "../../Types/Helper";
import CategoryPicker from "../../Form/CategoryPicker";
import { ICategory } from "../../Types/Category";

const GetUserOffersEndpoint = "Offer/get-recent";

function MainView() {
  const { PostRequest } = Api();
  const [data, setData] = useState<SimpleOfferList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    page: 1,
    searchText: "",
    sortDescending: false,
    sortBy: "",
    categoryId: Helper.EmptyGuid.toString(),
    maxPrice: null,
    minPrice: null,
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([
    { id: Helper.EmptyGuid, name: "Main", parentId: Helper.EmptyGuid },
  ]);
  const afterFirstFetch = useRef(false);

  function setCategoryId(value: string) {
    setSearchQuery((prev) => {
      return { ...prev, categoryId: value };
    });
  }

  function addCategory(value: ICategory) {
    setCategoryId(value.id);
    setCategories((prev) => [...prev, value]);
    setSearchQuery((prev) => {
      return { ...prev, page: 1 };
    });
    setData([]);
  }

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

    GetOffers(signal, searchQuery.page);

    return () => {
      controller.abort();
    };
  }, [searchQuery.page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && afterFirstFetch) {
          setSearchQuery((prev) => {
            return { ...prev, page: prev.page + 1 };
          });
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

  const items = categories.map((item) => (
    <Box
      key={item.id}
      className="pointer"
      onClick={() => {
        const index = categories.findIndex((x) => x.id === item.id);
        setCategories(categories.splice(0, index+1));
        setCategoryId(categories[categories.length-1].id);
        setData([]);
      }}
    >
      {item.name}
    </Box>
  ));
  return (
    <MainPanel>
      <Flex align={"center"} justify={"center"}>
        <SimpleGrid cols={1} w={"80%"}>
          <CategoryPicker getLastPickCategoryId={addCategory} />
          <SimpleGrid cols={2} w={"100%"}>
            <Flex align={"self-start"} justify={"start"}>
              <Breadcrumbs>{items}</Breadcrumbs>
            </Flex>
          </SimpleGrid>
        </SimpleGrid>
      </Flex>
      <Divider my="sm" />
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
