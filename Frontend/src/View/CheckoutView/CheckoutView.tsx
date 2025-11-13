import MainPanel from "../../Components/MainPanel";
import CheckoutForm from "../../Form/CheckoutForm/CheckoutForm";
import { Navigate, useLocation } from "react-router-dom";
import { CheckoutOffer } from "../../Types/Offer";
import { Api } from "../../Helpers/Api/Api";

function CheckoutView() {
    const { state } = useLocation();
    const { GetUserId } = Api();
    const offer = (state as { offer?: CheckoutOffer })?.offer;

    if (offer === undefined || offer!.user.id === GetUserId()) {
        return <Navigate to="/" replace />;
    }

    return (
        <MainPanel>
            <CheckoutForm offer={offer} />
        </MainPanel>)
}
export default CheckoutView;