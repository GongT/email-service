import {JsonApiHandler} from "@gongt/ts-stl-server/express/api-handler";
import {ApiRequest, ApiResponse} from "@gongt/ts-stl-library/request/protocol";
import {ERequestType} from "@gongt/ts-stl-library/request/request";

interface CancelBody extends ApiRequest {
}
const rawSendApi = new JsonApiHandler<CancelBody, {}&ApiResponse>(ERequestType.TYPE_POST, '/send/queue/cancel');
rawSendApi.setHandler((context) => {
	throw new Error('not-impl');
});

export default rawSendApi;
