import { Space } from "@mantine/core";
import MainPanel from "../../Components/MainPanel"
import AddOrUpdateOfferForm from "../../Form/AddOrUpdateOffer";
import { useParams } from "react-router-dom";

function UpdateOfferView() {
    const { id } = useParams<{ id: string }>();
  
    return (
      <MainPanel>
        <Space h="md" />
        <AddOrUpdateOfferForm id={id} />
      </MainPanel>
    );
}

export default UpdateOfferView