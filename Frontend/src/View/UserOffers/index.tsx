import { useParams } from "react-router-dom";
import MainPanel from "../../Components/MainPanel";

function UserOffersView() {
    const { id } = useParams<{ id: string }>();
    return (
      <MainPanel>
        <p>Oferty usera o id: {id}</p>
      </MainPanel>
    );
}

export default UserOffersView