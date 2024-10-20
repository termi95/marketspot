import { useEffect, useState } from "react";
import CustomTable from "../../Components/Table";
import { Api } from "../../Helpers/Api/Api";
import { UserOfferList } from "../../Types/Offer";
import { ActionIcon, rem, SimpleGrid } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";

const GetUserOffersEndpoint = "Offer/Get-User-Offers";
const SoftDeleteEndpoint = "Offer/Soft-delete";
function MyOffer() {
  const { PostRequest } = Api();
  const [data, setData] = useState<UserOfferList[] | null>(null);
  async function GetUser(signal: AbortSignal) {
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

  async function SoftDelete(password: string, id: string) {
    const reqResult = await PostRequest(SoftDeleteEndpoint, {
      password,
      id,
    });
    if (!reqResult.isError && reqResult.result !== undefined) {
      const controller = new AbortController();
      const signal = controller.signal;
      GetUser(signal);
    }
  }

  const action = (id: string) => {
    console.log(id);
    return (
      <ActionIcon.Group>
        <SimpleGrid cols={3} w={"100%"}>
          <ActionIcon
            size={42}
            variant="transparent"
            color="lime"
            aria-label="Open"
            onClick={() => {}}
          >
            <IconEye style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size={42}
            variant="transparent"
            aria-label="Edit"
            onClick={() => {}}
          >
            <IconEdit
              style={{ width: rem(24), height: rem(24) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            size={42}
            variant="transparent"
            color="red"
            aria-label="Trash"
            onClick={() =>
              OpenPasswordConfirmationModal(async (password: string) => {
                await SoftDelete(password, id);
              })
            }
          >
            <IconTrash
              style={{ width: rem(24), height: rem(24) }}
              stroke={1.5}
            />
          </ActionIcon>
        </SimpleGrid>
      </ActionIcon.Group>
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    GetUser(signal);
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
