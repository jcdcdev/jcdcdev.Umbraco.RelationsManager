import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecute} from "@umbraco-cms/backoffice/resources";
import {
	DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse,
	GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	PostUmbracoRelationsmanagerApiV1RelationResponse, CreateRequestModel, RelationsManagerService, RelationService
} from "../api";

export class RelationsManagerDataSource implements IRelationsManagerDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await tryExecute(this.#host, RelationService.postUmbracoRelationsmanagerApiV1Relation({body: request}))
	}

	async delete(id: number): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await tryExecute(this.#host, RelationService.deleteUmbracoRelationsmanagerApiV1RelationById({
			path: {
				id: id,
			}
		}))
	}

	async get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		const options = {
			path: {
				id: id,
			},
			query: {
				page: page,
				take: take,
				sort: sort,
				desc: desc,
			}
		};
		return await tryExecute(this.#host, RelationsManagerService.getUmbracoRelationsmanagerApiV1RelationById(options))
	}
}

export interface IRelationsManagerDataSource {
	get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>>;

	delete(id: number): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>>;

	create(request: CreateRequestModel): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>>;
}

