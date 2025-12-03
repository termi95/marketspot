import { useEffect, useState } from "react";
import CustomTable from "../../Components/Table";
import { Api } from "../../Helpers/Api/Api";
import { UserOfferList } from "../../Types/Offer";
import { ActionIcon, rem, SimpleGrid, Tooltip } from "@mantine/core";
import { IconEdit, IconEye, IconPigMoney, IconTrash } from "@tabler/icons-react";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { INotyfication } from "../../Types/Notyfication";

const GetUserOffersEndpoint = "Offer/Get-User-Offers";
const SoftDeleteEndpoint = "Offer/Soft-delete";
const MarkAsBoughtEndpoint = "Offer/mark-as-bought";

const OrderNotification: INotyfication = {
    Title: "Change status",
    Message: "Success.",
    SuccessMessage: "Successfully changed offer status status."
};

function MyOffer() {
  const navigate = useNavigate();
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

  async function Refresh() {
    const controller = new AbortController();
    const signal = controller.signal;
    await GetUser(signal);
  }


  async function SoftDelete(password: string, id: string) {
    const reqResult = await PostRequest(SoftDeleteEndpoint, {
      password,
      id,
    });
    if (!reqResult.isError && reqResult.result !== undefined) {
      await Refresh();
    }
  }

  async function MarkAsBought(id: string) {
    var offer = data?.find(x => x.id === id);
    if (!offer) {
      return
    }

    modals.openConfirmModal({
      title: "Set offer as bought",
      children: `Are you sure you want to set this offer ${offer.tittle} as bought`,
      labels: { confirm: "Set as bought", cancel: "Cancel" },
      confirmProps: { color: "var(--main-color)" },
      onConfirm: async () => {
        const reqResult = await PostRequest(MarkAsBoughtEndpoint, { id , OrderNotification});
        if (!reqResult.isError && reqResult.result !== undefined) {
          await Refresh();
        }
      },
    });
  };
  const iconsStyle = { width: rem(24), height: rem(24) };
  const stroke = 1.5;
  const actionIconSize = 42;

  const action = (id: string) => {
    return (
      <ActionIcon.Group>
        <SimpleGrid cols={4} w={"100%"}>
          <ActionIcon
            size={actionIconSize}
            variant="transparent"
            color="lime"
            aria-label="Open"
            onClick={() => {
              return navigate(`/offer/${id}`);
            }}
          >
            <Tooltip label={"View"}>
              <IconEye
                style={iconsStyle}
                stroke={stroke}
              />
            </Tooltip>
          </ActionIcon>
          <ActionIcon
            size={actionIconSize}
            variant="transparent"
            aria-label="Edit"
            onClick={() => navigate(`/offer/update/${id}`)}
          >
            <Tooltip label={"Edit"}>
              <IconEdit
                style={iconsStyle}
                stroke={stroke}
              />
            </Tooltip>
          </ActionIcon>
          <ActionIcon
            size={actionIconSize}
            variant="transparent"
            aria-label="Mark as bought"
            color="#ff9eaf"
            onClick={async () => await MarkAsBought(id)}
          >
            <Tooltip label={"Mark as bought"}>
              <IconPigMoney
                style={iconsStyle}
                stroke={stroke}
              />
            </Tooltip>
          </ActionIcon>
          <ActionIcon
            size={actionIconSize}
            variant="transparent"
            color="red"
            aria-label="Trash"
            onClick={() =>
              OpenPasswordConfirmationModal(async (password: string) => {
                await SoftDelete(password, id);
              })
            }
          >
            <Tooltip label={"Remove"}>
              <IconTrash
                style={iconsStyle}
                stroke={stroke}
              />
            </Tooltip>
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
