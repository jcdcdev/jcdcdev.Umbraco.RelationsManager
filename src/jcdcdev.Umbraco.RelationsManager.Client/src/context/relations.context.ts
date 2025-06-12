import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";
import {RelationsManagerRepository} from "../repository/relations.repository.ts";
import {
	CreateRequestModel,
	DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse,
	GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	PostUmbracoRelationsmanagerApiV1RelationResponse
} from "../api";

export class RelationsManagerContext extends UmbControllerBase {
	#repository: RelationsManagerRepository;

	constructor(host: UmbControllerHost) {
		super(host);
		this.provideContext(RELATIONS_MANAGER_CONTEXT_TOKEN, this);
		this.#repository = new RelationsManagerRepository(this);
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await this.#repository.create(request);
	}

	async delete(id: number): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#repository.delete(id);
	}

	async get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#repository.get(id, page, take, sort, desc);
	}

}

export const RELATIONS_MANAGER_CONTEXT_TOKEN =
	new UmbContextToken<RelationsManagerContext>("RelationsManagerContext");