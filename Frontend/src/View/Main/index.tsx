import { useEffect, useState } from "react";
import MainPanel from "../../Components/MainPanel";
import SingleOfferOnMainView from "../../Components/SingleOfferOnMainView";
import { Api } from "../../Helpers/Api/Api";
import { SearchQuery, SimpleOfferList, SortBy } from "../../Types/Offer";
import {
  ActionIcon,
  Box,
  Breadcrumbs,
  Combobox,
  Divider,
  Flex,
  Group,
  Input,
  InputBase,
  Loader,
  NumberInput,
  rem,
  Select,
  SimpleGrid,
  TextInput,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { Helper } from "../../Types/Helper";
import CategoryPicker from "../../Form/CategoryPicker";
import { ICategory } from "../../Types/Category";
import { IconArrowLeft, IconArrowNarrowDown, IconArrowRight, IconSearch } from "@tabler/icons-react";

const GetUserOffersEndpoint = "Offer/get-recent";

type MainViewState = {
  loading: boolean;
  categories: ICategory[];
  offers: SimpleOfferList[];
  searchQuery: SearchQuery;
};
const sortOptions: { label: string; value: string }[] = [
  { label: '🔻 Price high → low', value: 'PriceDesc' },
  { label: '🔺 Price low → high', value: 'PriceAsc' },
  { label: '🆕 Newest first', value: 'CreatedDateDesc' },
  { label: '📆 Oldest first', value: 'CreatedDateAsc' },
  { label: '🔎 Alfabetycznie Z → A', value: 'SearchTextDesc' },
  { label: '🔎 Alfabetycznie A → Z', value: 'SearchTextAsc' },
];

const defaultState: MainViewState = {
  loading: false,
  categories: [{ id: Helper.EmptyGuid, name: "Main", parentId: Helper.EmptyGuid },],
  offers: [],
  searchQuery: {
    itemPerPage: 2,
    page: 1,
    searchText: "",
    sortBy: "CreatedDateDesc",
    categoryId: Helper.EmptyGuid.toString(),
    maxPrice: undefined,
    minPrice: undefined,
  }
}

const iconSearch = <IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />;

function MainView() {
  const { PostRequest } = Api();
  const [data, setData] = useState<MainViewState>(defaultState);
  const startLoading = () => setData(prev => ({ ...prev, loading: true }));
  const stopLoading = () => setData(prev => ({ ...prev, loading: false }));
  const resetOffers = () => setData(prev => ({ ...prev, offers: [] }));
  const setNextPage = () => setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, page: prev.searchQuery.page + 1 } }));
  const setPrevPage = () => setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, page: Math.max(1, prev.searchQuery.page - 1) } }));
  const addCategory = (value: ICategory) => setData(prev => ({ ...prev, categories: [...prev.categories, value], searchQuery: { ...prev.searchQuery, categoryId: value.id, page: 1 } }));
  const getSortLabelByValue = (value: string) => sortOptions.find(x => x.value === value)?.label ?? '🆕 Newest first';
  const setMinPrice = (value: string) => {
    const numberValue = value === '' ? undefined : Number.parseInt(value);
    if (numberValue != data.searchQuery.minPrice) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, minPrice: numberValue } }));
    }
  }
  const setMaxPrice = (value: string) => {
    const numberValue = value === '' ? undefined : Number.parseInt(value);
    if (numberValue != data.searchQuery.maxPrice) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, maxPrice: numberValue } }));
    }
  }
  const setSortBy = (value: SortBy) => {
    if (value != data.searchQuery.sortBy) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, sortBy: value, page: 1 } }));
    }
  }
  const setSearchText = (value: string) => {
    if (value != data.searchQuery.searchText) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, searchText: value, page: 1 } }));
    }
  }
  const setItemPerPage = (value: string | null) => {
    if (!value) return;
    const valueNumber = Number(value);
    if (!isNaN(valueNumber) && valueNumber != data.searchQuery.itemPerPage) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, itemPerPage: valueNumber, page: 1 } }));
    }
  }
  const getBreadcrumbsHierarchy = (index: number) => {
    const copy = [...data.categories];
    const keep = index + 1;
    return copy.slice(0, keep);
  }

  async function GetOffers(signal: AbortSignal) {
    try {
      startLoading();
      const payload = { ...data.searchQuery }
      const reqResult = await PostRequest<SimpleOfferList[]>(
        GetUserOffersEndpoint,
        payload,
        undefined,
        signal
      );
      if (
        !reqResult.isError
      ) {
        const items = reqResult.result;
        if (items && items.length > 0) {
          setData(prev => ({ ...prev, offers: items }));
        }
        else if (items && items.length === 0 && data.searchQuery.page > 1) {
          setPrevPage();
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

  const items = data.categories.map((item) => {
    return (<Box
      key={item.id}
      className={data.searchQuery.categoryId !== item.id ? "pointer" : undefined}
      onClick={() => {
        const index = data.categories.findIndex((x) => x.id === item.id);
        const newCategories = getBreadcrumbsHierarchy(index);
        const newCurrentId = newCategories.length > 0 ? newCategories[newCategories.length - 1].id : Helper.EmptyGuid;
        if (newCurrentId != data.searchQuery.categoryId) {
          setData(prev => ({
            ...prev,
            categories: newCategories,
            searchQuery: { ...prev.searchQuery, categoryId: newCurrentId, page: 1 },
          }));
          resetOffers();
        }
      }}
    >
      {item.name}
    </Box>);
  });
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });


  const options = sortOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value} style={{ textAlign: "left" }}>
      {item.label}
    </Combobox.Option>
  ));

  const canGoNext = data.offers.length >= data.searchQuery.itemPerPage;
  const pagination = (
    <Group justify="space-between" align="center" mt="md" mb="md" w="80%" mx="auto">
      <Group gap="xs">
        <span>Items per page:</span>
        <Select
          data={["2", "5", "10", "50"]}
          value={data.searchQuery.itemPerPage.toString()}
          onChange={setItemPerPage}
          w={80}
        />
      </Group>

      <Group gap="xs">
        {data.searchQuery.page > 1 &&
          <Tooltip label="Previous page">
            <ActionIcon
              variant="light"
              radius="xl"
              size="lg"
              disabled={data.searchQuery.page <= 1}
              onClick={data.searchQuery.page > 1 ? setPrevPage : undefined}
            >
              <IconArrowLeft size={18} />
            </ActionIcon>
          </Tooltip>
        }

        <span>Page: {data.searchQuery.page}</span>

        {canGoNext &&
          <Tooltip label="Next page">
            <ActionIcon
              variant="light"
              radius="xl"
              size="lg"
              disabled={!canGoNext}
              onClick={canGoNext ? setNextPage : undefined}
            >
              <IconArrowRight size={25} />
            </ActionIcon>
          </Tooltip>
        }
      </Group>
    </Group>
  );

  const loader = (<Flex align={"center"} justify={"center"} m={rem(12)}><Loader color="blue" /></Flex>);
  const offers = data.offers.map((x) => {
    return (
      <Flex align={"center"} justify={"center"} key={x.id}>
        <SingleOfferOnMainView offer={x}/>
      </Flex>
    )
  })

  return (
    <MainPanel>
      <Flex align={"center"} justify={"center"}>
        <SimpleGrid cols={1} w={"80%"}>
          <CategoryPicker key={`${data.searchQuery.categoryId}-${data.categories.length}`} getLastPickCategoryId={addCategory} id={data.searchQuery.categoryId} />
          <Group align="center" gap={"xs"} grow>
            <NumberInput
              label="Price from"
              value={data.searchQuery.minPrice}
              onBlur={(e) => setMinPrice(e.target.value)}
              min={0}
              decimalSeparator="."
              hideControls
            />
            <NumberInput
              label="Price to"
              value={data.searchQuery.maxPrice}
              onBlur={(e) => setMaxPrice(e.target.value)}
              min={0}
              decimalSeparator="."
              hideControls
            />
            <Combobox
              store={combobox}
              onOptionSubmit={(val) => {
                setSortBy(val as SortBy);
                combobox.closeDropdown();
              }}
            >
              <Combobox.Target>
                <InputBase
                  label="Sort by"
                  component="button"
                  type="button"
                  pointer
                  rightSection={<IconArrowNarrowDown />}
                  rightSectionPointerEvents="none"
                  onClick={() => combobox.toggleDropdown()}
                >
                  {getSortLabelByValue(data.searchQuery.sortBy) || <Input.Placeholder>Sort by</Input.Placeholder>}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Group>
          <TextInput
            value={data.searchQuery.searchText}
            onBlur={(e) => setSearchText(e.target.value)}
            leftSection={iconSearch}
            w={"100%"}
            placeholder="Search" />
          <SimpleGrid cols={2} w={"100%"}>
            <Flex align={"self-start"} justify={"start"}>
              <Breadcrumbs>{items}</Breadcrumbs>
            </Flex>
          </SimpleGrid>
        </SimpleGrid>
      </Flex>
      <Divider my="sm" />
      {pagination}
      <SimpleGrid cols={1} w={"100%"}>
        {data.loading ? loader : offers}
      </SimpleGrid>
      {pagination}
    </MainPanel>
  );
}

export default MainView;
