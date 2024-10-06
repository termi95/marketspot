import { useEffect, useState } from "react";

export function UseCustomTable<T>(data: T[] | null) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [data, sortBy, reverseSortDirection, search]);

  function filterData(data: T[], search: string) {
    const query = search.toLowerCase().trim();
    if (!data.length) return data;

    return data.filter((item) =>
      Object.keys(item as object).some((key) => {
        const value = String(item[key as keyof T]);
        return value.toLowerCase().includes(query);
      })
    );
  }

  function sortData(
    data: T[] | null,
    payload: { sortBy: keyof T | null; reversed: boolean; search: string }
  ) {
    const { sortBy } = payload;
    if (data !== null) {
      if (!sortBy) {
        return filterData(data, payload.search);
      }

      return filterData(
        [...data].sort((a, b) => {
          const valueA = a[sortBy];
          const valueB = b[sortBy];

          if (typeof valueA === "string" && typeof valueB === "string") {
            return payload.reversed
              ? valueB.localeCompare(valueA)
              : valueA.localeCompare(valueB);
          }

          if (valueA > valueB) return payload.reversed ? -1 : 1;
          if (valueA < valueB) return payload.reversed ? 1 : -1;
          return 0;
        }),
        payload.search
      );
    }
    return null;
  }

  const setSorting = (field: keyof T) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  function convertBase64ToBlob(base64Image: string) {
    const parts = base64Image.split(";base64,");
    const imageType = parts[0].split(":")[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  return {
    setSorting,
    handleSearchChange,
    convertBase64ToBlob,
    sortedData,
    search,
    sortBy,
    reverseSortDirection,
  };
}
