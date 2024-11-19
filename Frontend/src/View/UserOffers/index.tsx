import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../../Components/MainPanel";
import CustomTable from "../../Components/Table";
import { Api } from "../../Helpers/Api/Api";
import { UserOfferList } from "../../Types/Offer";
import { ActionIcon, rem, SimpleGrid } from "@mantine/core";
import { IconEye, IconHeart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ReturnBtn from "../../Components/ReturnBtn";
import ApiAction from "../../Components/Offer/apiAction";
import { Helper } from "../../Types/Helper";

const GetUserOffersEndpoint = "Offer/Get-User-Offers";
function UserOffersView() {
  const { id } = useParams<{ id: string }>();                
  const navigate = useNavigate();
  const { PostRequest } = Api();
  const { HandleLikes } = ApiAction();
  const [data, setData] = useState<UserOfferList[] | null>(null);
  const getColor = (id: string) => (id != Helper.EmptyGuid ? "red" : "white");
  async function GetUser(signal: AbortSignal) {
    try {
      const reqResult = await PostRequest<UserOfferList[]>(
        GetUserOffersEndpoint,
        {id},
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
  async function handleLike(id: string) {
    await HandleLikes(data!.find(x=> x.id === id)!.likeId, id);
    const controller = new AbortController();
    const signal = controller.signal;
    await GetUser(signal); 
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
              <IconEye style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
            </ActionIcon>                        
            <ActionIcon
              size={42}
              variant="transparent"
              color="red"
              aria-label="Remove like"
              onClick={async ()=> await handleLike(id)}
              >
              <IconHeart fill={getColor(data!.find(x=> x.id === id)!.likeId)} style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
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
    <MainPanel>
    <ReturnBtn />
    <CustomTable
      RowData={data}
      Columns={["photo", "tittle", "description", "price", "action"]}
      Action={action}
    />
      </MainPanel>
  );
}

export default UserOffersView