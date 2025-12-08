import { useEffect, useState } from "react";
import MainPanel from "../../Components/MainPanel";
import SingleOfferOnMainView from "../../Components/SingleOfferOnMainView";
import { Api } from "../../Helpers/Api/Api";
import { SearchQuery, SimpleOfferList, SortBy } from "../../Types/Offer";
import {
  ActionIcon,
  Autocomplete,
  Box,
  Breadcrumbs,
  Combobox,
  Divider,
  Flex,
  Group,
  Input,
  InputBase,
  Loader,
  MultiSelect,
  rem,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { Helper } from "../../Types/Helper";
import CategoryPicker from "../../Form/CategoryPicker";
import { ICategory } from "../../Types/Category";
import { IconArrowLeft, IconArrowNarrowDown, IconArrowRight, IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

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

const conditionOptions = [
  { value: "0", label: "New" },
  { value: "1", label: "Used" },
];

const deliveryTypeOptions = [
  { value: "0", label: "Shipping" },
  { value: "1", label: "Local pickup" },
];

const basePriceOptions = ["50", "100", "150", "250", "350", "500", "700", "1000", "1500", "2500"];

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
    deliveryType: [],
    condytion: [],
  }
}

const iconSearch = <IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />;

function MainView() {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, minPrice: numberValue, page: 1 } }));
    }
  };

  const setMaxPrice = (value: string) => {
    const numberValue = value === '' ? undefined : Number.parseInt(value);
    if (numberValue != data.searchQuery.maxPrice) {
      setData(prev => ({ ...prev, searchQuery: { ...prev.searchQuery, maxPrice: numberValue, page: 1 } }));
    }
  };
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
  const setConditions = (values: number[]) => {
    setData(prev => ({
      ...prev,
      searchQuery: {
        ...prev.searchQuery,
        condytion: values,
        page: 1,
      },
    }));
  };

  const setDeliveryTypes = (values: number[]) => {
    setData(prev => ({
      ...prev,
      searchQuery: {
        ...prev.searchQuery,
        deliveryType: values,
        page: 1,
      },
    }));
  };

  const clearFilters = () => {
    if (JSON.stringify(data.searchQuery) !== JSON.stringify(defaultState.searchQuery)) {
      setData(prev => ({ ...prev, searchQuery: { ...defaultState.searchQuery } }))
    }
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

    const timeoutId = setTimeout(() => {
      GetOffers(signal);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
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
    <Group
      justify={isMobile ? "center" : "space-between"}
      align="center"
      mt="md"
      mb="md"
      w={isMobile ? "100%" : "80%"}
      mx="auto"
      wrap="wrap"
      gap="xs"
    >
      <Group gap="xs">
        <Text size={isMobile ? "xs" : "sm"}>Items per page:</Text>
        <Select
          data={["2", "5", "10", "50"]}
          value={data.searchQuery.itemPerPage.toString()}
          onChange={setItemPerPage}
          w={80}
        />
      </Group>

      <Group gap="xs">
        {data.searchQuery.page > 1 && (
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
        )}

        <Text size={isMobile ? "xs" : "sm"}>Page: {data.searchQuery.page}</Text>

        {canGoNext && (
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
        )}
      </Group>
    </Group>
  );


  const loader = (<Flex align={"center"} justify={"center"} m={rem(12)}><Loader color="blue" /></Flex>);
  const offers = data.offers.map((x) => {
    return (
      <Flex align={"center"} justify={"center"} key={x.id}>
        <SingleOfferOnMainView offer={x} />
      </Flex>
    )
  })

  return (
    <MainPanel>
      <Flex align={"center"} justify={"center"}>
        <SimpleGrid cols={1} w={isMobile ? "100%" : "80%"} px={isMobile ? "md" : 0}>
          <Box
            p={isMobile ? "sm" : "md"}
            mt="sm"
            style={{
              backgroundColor: "white",
              borderRadius: rem(8),
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <CategoryPicker
              key={`${data.searchQuery.categoryId}-${data.categories.length}`}
              getLastPickCategoryId={addCategory}
              id={data.searchQuery.categoryId}
            />

            <Group
              className="text-start"
              align="stretch"
              gap="sm"
              grow={!isMobile}
              justify="flex-start"
              style={{ flexDirection: isMobile ? "column" : "row" }}
              mt="sm"
            >
              <Autocomplete
                label="Price from"
                data={basePriceOptions}
                placeholder="From"
                clearable
                value={data.searchQuery.minPrice != null ? data.searchQuery.minPrice.toString() : ""}
                onChange={(val) => setMinPrice(val)}
              /><Autocomplete
                label="Price to"
                data={basePriceOptions}
                placeholder="To"
                clearable
                value={data.searchQuery.maxPrice != null ? data.searchQuery.maxPrice.toString() : ""}
                onChange={(val) => setMaxPrice(val)}
              />
              <MultiSelect
                label="Condition"
                data={conditionOptions}
                value={(data.searchQuery.condytion ?? []).map(x => x.toString())}
                onChange={(values) => {
                  const nums = values.map(v => Number(v));
                  setConditions(nums);
                }}
                clearable
                searchable
                placeholder="Select condition"
              />

              <MultiSelect
                label="Delivery type"
                data={deliveryTypeOptions}
                value={(data.searchQuery.deliveryType ?? []).map(x => x.toString())}
                onChange={(values) => {
                  const nums = values.map(v => Number(v));
                  setDeliveryTypes(nums);
                }}
                clearable
                searchable
                placeholder="Select delivery type"
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
              onChange={(e) => setSearchText(e.target.value)}
              leftSection={iconSearch}
              w={"100%"}
              placeholder="Search"
              mt="xs"
              size="md"
               />
            <SimpleGrid cols={1} w="100%">
              <Flex
                align={isMobile ? "stretch" : "center"}
                justify="space-between"
                w="100%"
                direction={isMobile ? "column" : "row"}
                gap={isMobile ? "xs" : 0}
                mt="xs"
              >
                <Breadcrumbs>{items}</Breadcrumbs>
                <Text
                  size="sm"
                  c="dimmed"
                  className="pointer"
                  onClick={clearFilters}
                  style={{ textAlign: isMobile ? "left" : "right" }}
                >
                  Clear filters
                </Text>
              </Flex>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Flex>
      <Divider my="sm" />
      {!isMobile && pagination}
      <SimpleGrid cols={1} w={"100%"}>
        {data.loading ? loader : offers}
      </SimpleGrid>
      {pagination}
    </MainPanel>
  );
}

export default MainView;
