import { Box, Flex, Image, rem, SimpleGrid, Text } from "@mantine/core";
import ActionHeartIcon from "../ActionHeartIcon";
import { useNavigate } from "react-router-dom";

interface Props {
  Id: string;
  UserId: string;
  LikeId: string;
  Icon: string;
  Tittle: string;
  Price: string;
  AddedAt: string;
}

function SingleOfferOnMainView({
  Id,
  UserId,
  LikeId,
  Icon,
  Price,
  Tittle,
  AddedAt,
}: Props) {
  const navigate = useNavigate();
  return (
    <Flex
      key={Id}
      ml={rem(8)}
      mr={rem(8)}
      style={{ backgroundColor: "white" }}
      w={"60%"}
    >
      <Box>
        <Image
          src={Icon}
          w={250}
          width={200}
          p={rem(8)}
          className="pointer"
          onClick={() => navigate(`/offer/${Id}`)}
          loading="lazy"
        />
      </Box>
      <SimpleGrid cols={1} w={"100%"}>
        <Box
          w={"100%"}
          h={"100%"}
          mt={rem(4)}
          className="pointer"
          onClick={() => navigate(`/offer/${Id}`)}
        >
          <SimpleGrid cols={2} w={"100%"} h={"100%"}>
            <Flex w={"100%"} mt={rem(4)}>
              <Box ml={rem(4)}>
                <Text size="xl">{Tittle}</Text>
              </Box>
            </Flex>
            <Flex
              w={"100%"}
              mt={rem(4)}
              align={"flex-start"}
              justify={"flex-end"}
            >
              <Box mr={rem(8)}>
                <Text size="xl">{Price} zł</Text>
              </Box>
            </Flex>
          </SimpleGrid>
        </Box>
        <Box w={"100%"} h={"100%"} mb={rem(4)} p={rem(8)}>
          <SimpleGrid cols={2} w={"100%"} h={"100%"}>
            <Flex w={"100%"} mt={rem(4)} align={"flex-end"}>
              <Box>{AddedAt}</Box>
            </Flex>
            <Flex
              w={"100%"}
              mt={rem(4)}
              align={"flex-end"}
              justify={"flex-end"}
            >
              <Box>
                <ActionHeartIcon id={Id} likeId={LikeId} userId={UserId} />
              </Box>
            </Flex>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Flex>
  );
}

export default SingleOfferOnMainView;
