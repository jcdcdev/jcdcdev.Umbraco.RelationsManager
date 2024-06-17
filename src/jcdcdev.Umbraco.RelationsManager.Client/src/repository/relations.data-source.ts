import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecuteAndNotify} from "@umbraco-cms/backoffice/resources";
import {
	DeleteUmbracoRelationsmanagerApiV1RelationByIdData, DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse,
	GetUmbracoRelationsmanagerApiV1RelationByIdData,
	GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	postUmbracoRelationsmanagerApiV1Relation,
	deleteUmbracoRelationsmanagerApiV1RelationById,
	getUmbracoRelationsmanagerApiV1RelationById,
	PostUmbracoRelationsmanagerApiV1RelationData, PostUmbracoRelationsmanagerApiV1RelationResponse
} from "../api";

export class RelationsManagerDataSource implements IRelationsManagerDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async create(request: PostUmbracoRelationsmanagerApiV1RelationData): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await tryExecuteAndNotify(this.#host, postUmbracoRelationsmanagerApiV1Relation(request))
	}

	async delete(request: DeleteUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await tryExecuteAndNotify(this.#host, deleteUmbracoRelationsmanagerApiV1RelationById(request))
	}

	async get(request: GetUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await tryExecuteAndNotify(this.#host, getUmbracoRelationsmanagerApiV1RelationById(request))
	}
}

export interface IRelationsManagerDataSource {
	get(request: GetUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>>;

	delete(request: DeleteUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>>;

	create(request: PostUmbracoRelationsmanagerApiV1RelationData): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>>;
}

