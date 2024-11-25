import { Space } from "@mantine/core";
import MainPanel from "../../Components/MainPanel";
import AddOrUpdateOfferForm from "../../Form/AddOrUpdateOffer";

function AddingOferView() {
  return (
    <MainPanel>
      <Space h="md" />
      <AddOrUpdateOfferForm id={null} />
    </MainPanel>
  );
}
export default AddingOferView;
