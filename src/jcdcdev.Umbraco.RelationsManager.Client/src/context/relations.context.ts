import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";
import {RelationsManagerRepository} from "../repository/relations.repository.ts";
import {
	DeleteUmbracoRelationsmanagerApiV1RelationByIdData,
	DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse, GetUmbracoRelationsmanagerApiV1RelationByIdData, GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	PostUmbracoRelationsmanagerApiV1RelationData,
	PostUmbracoRelationsmanagerApiV1RelationResponse
} from "../api";

export class RelationsManagerContext extends UmbControllerBase {
	#repository: RelationsManagerRepository;

	constructor(host: UmbControllerHost) {
		super(host);
		this.provideContext(RELATIONS_MANAGER_CONTEXT_TOKEN, this);
		this.#repository = new RelationsManagerRepository(this);
	}

	async create(request: PostUmbracoRelationsmanagerApiV1RelationData): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await this.#repository.create(request);
	}

	async delete(request: DeleteUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#repository.delete(request);
	}

	async get(request: GetUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#repository.get(request);
	}

}

export const RELATIONS_MANAGER_CONTEXT_TOKEN =
	new UmbContextToken<RelationsManagerContext>("RelationsManagerContext");