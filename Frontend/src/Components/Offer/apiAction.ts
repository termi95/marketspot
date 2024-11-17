import { Api } from "../../Helpers/Api/Api";
import { Helper } from "../../Types/Helper";

const LikeEndpoint = "Like/";
function ApiAction() {
  const { PostRequest } = Api();
  async function HandleLikes(likeId: string, offerId: string): Promise<string> {
    let result = Helper.EmptyGuid.toString();
    if (likeId == Helper.EmptyGuid) {
      const reqResult = await PostRequest<string>(
        LikeEndpoint + "Add",
        { offerId },
        undefined
      );
      if (!reqResult.isError && reqResult.result !== undefined) {
        result = reqResult.result;
      }
    } else {
      const reqResult = await PostRequest(
        LikeEndpoint + "Delete",
        { id:likeId },
        undefined
      );
      if (reqResult.isError) {
        result = likeId;
      }
    }
    return result;
  }

  return { HandleLikes };
}

export default ApiAction;
