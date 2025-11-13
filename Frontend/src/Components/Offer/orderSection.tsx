import { Box, Flex, rem, Text, Title } from "@mantine/core";
import Btn from "../Btn";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../State/store";
import { Api } from "../../Helpers/Api/Api";
import { CheckoutOffer } from "../../Types/Offer";

interface Props {
  offer: CheckoutOffer;
}

function OrderSection({ offer }: Props) { 
  const { GetUserId } = Api();
  const { isLogin } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const link = isLogin ? () => navigate(`/checkout`, {state: { offer }}) : () =>  navigate(`/login`, { state: { fromOffer: true, offer } });
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
        <Title order={4}>Price: </Title>
        <Text size={rem(18)}>{offer.price} PLN</Text>
      </Flex>
      <Btn title="Buy" fullWidth disabled={GetUserId() === offer.user.id} onClick={link}/>
    </Box>
  );
}

export default OrderSection;
