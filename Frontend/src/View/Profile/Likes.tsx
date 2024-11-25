import { useEffect, useState } from "react";
import CustomTable from "../../Components/Table";
import { ActionIcon, rem, SimpleGrid, Tooltip } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { UserOfferList } from "../../Types/Offer";
import { Api } from "../../Helpers/Api/Api";
import { useNavigate } from "react-router-dom";
import ActionHeartIcon from "../../Components/ActionHeartIcon";

const GetUserLikedOffersEndpoint = "Like/Get-all";
function Likes() {
  const navigate = useNavigate();
  const { PostRequest } = Api();
  const [data, setData] = useState<UserOfferList[] | null>(null);
  async function GetUser(signal: AbortSignal) {
    try {
      const reqResult = await PostRequest<UserOfferList[]>(
        GetUserLikedOffersEndpoint,
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

  const action = (id: string) => {
    return (
      <ActionIcon.Group>
        <SimpleGrid cols={3} w={"100%"}>
          <ActionIcon
            size={42}
            variant="transparent"
            color="lime"
            aria-label="Open"
            onClick={() => {
              return navigate(`/offer/${id}`);
            }}
          >
            <Tooltip label={"View"}>
              <IconEye style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
            </Tooltip>
          </ActionIcon>
          <ActionHeartIcon
            id={id}
            likeId={data!.find((x) => x.id === id)!.likeId}
            action={() => {
              const controller = new AbortController();
              const signal = controller.signal;
              GetUser(signal);
            }}
          />
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

export default Likes;
