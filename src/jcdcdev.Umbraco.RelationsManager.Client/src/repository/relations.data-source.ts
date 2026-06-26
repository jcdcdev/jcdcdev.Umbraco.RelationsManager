import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecute} from "@umbraco-cms/backoffice/resources";
import {
	CreateRelationResponse,
	CreateRequestModel, RelationsManager, RelationTypeModel
} from "../api";

export class RelationsManagerDataSource implements IRelationsManagerDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<CreateRelationResponse>> {
		return await tryExecute(this.#host, RelationsManager.postRelation({body: request}));
	}

	async delete(id: number): Promise<UmbDataSourceResponse> {
		return await tryExecute(this.#host, RelationsManager.deleteRelation({
			path: {
				id: id,
			}
		}));
	}

	async get(id: string, page ?: number, take ?: number, sort ?: string, desc ?: boolean): Promise<UmbDataSourceResponse<RelationTypeModel>> {
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
		return await tryExecute(this.#host, RelationsManager.getRelationById(options))
	}
}

export interface IRelationsManagerDataSource {
	get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<RelationTypeModel>>;

	delete(id: number): Promise<UmbDataSourceResponse>;

	create(request: CreateRequestModel): Promise<UmbDataSourceResponse<CreateRelationResponse>>;
}

