import { Box, Flex, Title } from "@mantine/core";
import Btn from "../Btn";
import { useNavigate } from "react-router-dom";
import { INotyfication } from "../../Types/Notyfication";
import { modals } from "@mantine/modals";
import { Api } from "../../Helpers/Api/Api";

interface Props {
  id: string;
  tittle: string;
}

const MarkAsBoughtEndpoint = "Offer/mark-as-bought";
const OrderNotification: INotyfication = {
  Title: "Change status",
  Message: "Success.",
  SuccessMessage: "Successfully changed offer status status."
};

function MarkAsBoughtSection({ id, tittle }: Props) {
  const navigate = useNavigate();
  const { PostRequest } = Api();
  async function MarkAsBought() {
    modals.openConfirmModal({
      title: "Set offer as bought",
      children: `Are you sure you want to set this offer ${tittle} as bought`,
      labels: { confirm: "Set as bought", cancel: "Cancel" },
      confirmProps: { color: "var(--main-color)" },
      onConfirm: async () => {
        const reqResult = await PostRequest(MarkAsBoughtEndpoint, { id, OrderNotification });
        if (!reqResult.isError && reqResult.result !== undefined) {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/"); // fallback
          }
        }
      },
    });
  };
  return (
    <Box
      p={"md"}
      bg="var(--mantine-color-body)"
      style={{
        border:
          "calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-3)",
      }}
    >
      <Flex align={"center"} pb={"sm"}>
        <Title order={4}>Mark your offer as bought</Title>
      </Flex>
      <Btn title="Mark" fullWidth onClick={MarkAsBought} />
    </Box>
  );
}

export default MarkAsBoughtSection;
