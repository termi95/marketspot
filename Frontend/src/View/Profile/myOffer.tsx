import { useEffect, useState } from "react";
import CustomTable from "../../Components/Table";
import { Api } from "../../Helpers/Api/Api";
import { UserOfferList } from "../../Types/Offer";
import { ActionIcon, rem, SimpleGrid } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

const GetUserOffersEndpoint = "Offer/Get-User-Offers";
function MyOffer() {
  const { PostRequest } = Api();
  const [data, setData] = useState<UserOfferList[] | null>(null);

  const action = (id: string) => {
    console.log(id);
    return (
      <ActionIcon.Group>
         <SimpleGrid cols={3} w={"100%"}>
        <ActionIcon size={42} variant="filled" color="gray" aria-label="Open">
          <IconEye style={{ width: rem(24), height: rem(24) }}  stroke={1.5} />
        </ActionIcon>
        <ActionIcon size={42} variant="filled" aria-label="Edit">
          <IconEdit style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon size={42} variant="filled" color="red" aria-label="Trash">
          <IconTrash style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
        </ActionIcon>
        </SimpleGrid>
      </ActionIcon.Group>
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function GetUser() {
      try {
        const reqResult = await PostRequest<UserOfferList[]>(
          GetUserOffersEndpoint,
          {},
          undefined,
          signal
        );
        if (!reqResult.isError && reqResult.result !== undefined) {
          setData(reqResult.result);
        }
      } catch (error) {
        /* empty */
      }
    }
    GetUser();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <CustomTable
      RowData={data}
      Columns={["photo", "tittle", "description", "price", "action"]}
      Action={action}
    />
  );
}

export default MyOffer;
