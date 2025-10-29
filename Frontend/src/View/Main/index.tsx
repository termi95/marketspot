import { useEffect, useState } from "react";
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

type MainViewState = {
  loading: boolean;
  categories: ICategory[];
  offers: SimpleOfferList[];
  searchQuery: SearchQuery;
};

const defaultState: MainViewState = {
  loading: false,
  categories: [{ id: Helper.EmptyGuid, name: "Main", parentId: Helper.EmptyGuid },],
  offers: [],
  searchQuery: {
    page: 1,
    searchText: "",
    sortDescending: false,
    sortBy: "",
    categoryId: Helper.EmptyGuid.toString(),
    maxPrice: null,
    minPrice: null,
  }
}


function MainView() {
  const { PostRequest } = Api();
  const [data, setData] = useState<MainViewState>(defaultState);
  const startLoading = () => setData(prev => ({ ...prev, loading: true }));
  const stopLoading = () => setData(prev => ({ ...prev, loading: false }));
  const resetOffers = () => setData(prev => ({ ...prev, offers: [] }));
  const getBreadcrumbsHierarchy = (index: number) => {
    const copy = [...data.categories];
    const keep = index + 1;
    return copy.slice(0, keep);
  }

  function addCategory(value: ICategory) {
    setData(prev => ({ ...prev, categories: [...prev.categories, value], searchQuery:{...prev.searchQuery, categoryId: value.id, page: 1}}));
  }

  async function GetOffers(signal: AbortSignal) {
    try {
      startLoading();
      const reqResult = await PostRequest<SimpleOfferList[]>(
        GetUserOffersEndpoint,
        { page: data.searchQuery.page, categoryId: data.searchQuery.categoryId},
        undefined,
        signal
      );
      if (
        !reqResult.isError
      ) {
        const items = reqResult.result;
        if (items) {
          setData(prev => ({ ...prev, offers: items }));
        }
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      if (!signal.aborted) {
        stopLoading()
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    GetOffers(signal);

    return () => {
      controller.abort();
    };
  }, [data.searchQuery]);

  const items = data.categories.map((item) => (
    <Box
      key={item.id}
      className="pointer"
      onClick={() => {
        const index = data.categories.findIndex((x) => x.id === item.id);
        const newCategories = getBreadcrumbsHierarchy(index);
        const newCurrentId =
          newCategories.length > 0 ? newCategories[newCategories.length - 1].id : Helper.EmptyGuid;

        setData(prev => ({
          ...prev,
          categories: newCategories,
          searchQuery: { ...prev.searchQuery, categoryId: newCurrentId, page: 1 },
        }));
        resetOffers();
      }}
    >
      {item.name}
    </Box>
  ));
  return (
    <MainPanel>
      <Flex align={"center"} justify={"center"}>
        <SimpleGrid cols={1} w={"80%"}>
          <CategoryPicker key={`${data.searchQuery.categoryId}-${data.categories.length}`} getLastPickCategoryId={addCategory} id={data.searchQuery.categoryId} />
          <SimpleGrid cols={2} w={"100%"}>
            <Flex align={"self-start"} justify={"start"}>
              <Breadcrumbs>{items}</Breadcrumbs>
            </Flex>
          </SimpleGrid>
        </SimpleGrid>
      </Flex>
      <Divider my="sm" />
      <SimpleGrid cols={1} w={"100%"}>
        {data.offers.map((x) => (
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
          {data.loading && <Loader color="blue" />}
        </Flex>
      </SimpleGrid>
    </MainPanel>
  );
}

export default MainView;
