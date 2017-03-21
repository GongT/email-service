import {JsonApiHandler} from "typescript-common-library/server/express/api-handler";
import {ApiResponse, ApiRequest} from "typescript-common-library/server/express/protocol";
import {ERequestType} from "typescript-common-library/server/express/base/types";

interface CancelBody extends ApiRequest {
}
const rawSendApi = new JsonApiHandler<CancelBody ,{} & ApiResponse>(ERequestType.TYPE_POST, '/send/queue/cancel');
rawSendApi.setHandler((context) => {
	throw new Error('not-impl');
});

export default rawSendApi;
