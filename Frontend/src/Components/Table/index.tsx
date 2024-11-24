import {
  Container,
  Image,
  Loader,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Th from "../TableHeader";
import { UseCustomTable } from "./UseCustomTable";

interface Props<T> {
  RowData: T[] | null;
  Columns: (keyof T)[];
  Action: (Id:string) => JSX.Element;
}

function CustomTable<T>({ RowData, Columns, Action }: Props<T>) {
  const {
    handleSearchChange,
    setSorting,
    convertBase64ToBlob,
    sortedData,
    search,
    sortBy,
    reverseSortDirection,
  } = UseCustomTable(RowData);

  const photoColumn = (key: string, base64: string) => {
    return (
      <Table.Td key={key}>
        <Image
          src={URL.createObjectURL(convertBase64ToBlob(base64))}
          radius={"lg"}
          h={100}
          w="auto"
          fit="contain"
          alt="Offer image"
        />
      </Table.Td>
    );
  };
  
  const rows = sortedData !== null ? sortedData.map((row, rowIndex) => {
    const rowId = row["id" as keyof T];
    return (
      <Table.Tr
        key={rowId !== undefined && rowId !== null ? String(rowId) : rowIndex}
      >
        {Columns.map((column) => {
          let value;
          switch (column.toString()) {
            case "photo":
              value =
                String(row[column]).length > 0
                  ? photoColumn(String(column), String(row[column]))
                  : "";
              break;
            case "action":
              value = <Table.Td key={String(column)}>{Action(rowId as string)}</Table.Td>
              break;
              case "price":
                value = <Table.Td key={String(column)} style={{ textAlign: "start" }} >PLN {row[column] !== null && row[column] !== undefined
                  ? String(row[column])
                  : ""}</Table.Td>
                break;
            default:
              value = (
                <Table.Td key={String(column)} style={{ textAlign: "start" }} >
                  {row[column] !== null && row[column] !== undefined
                    ? String(row[column])
                    : ""}
                </Table.Td>
              );
              break;
          }
          return value;
        })}
      </Table.Tr>
    );
  }) : [];

  const nothingFound = (
    <Table.Tr>
      <Table.Td colSpan={Columns.length}>
        <Text fw={500} ta="center">
          Nothing found
        </Text>
      </Table.Td>
    </Table.Tr>
  );

  const loader = (
    <Table.Tr>
      <Table.Td colSpan={Columns.length}>
        <Loader color="blue" />
      </Table.Td>
    </Table.Tr>
  );

  const tableHeader = Columns.map((x) => {
    return (
      <Th
        key={String(x)}
        sorted={sortBy === x}
        reversed={reverseSortDirection}
        onSort={() => setSorting(x as keyof T)}
      >
        {(x as string).charAt(0).toUpperCase() + (x as string).slice(1)}
      </Th>
    );
  });

  return (
    <Container miw={"100%"} mt={"md"}>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
          highlightOnHover
          striped
          withColumnBorders
          withRowBorders={false}
        >
          <Table.Tbody>
            <Table.Tr>{tableHeader}</Table.Tr>
          </Table.Tbody>
          <Table.Tbody>{RowData !== null ? rows.length > 0 ? rows : nothingFound : loader}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}

export default CustomTable;
