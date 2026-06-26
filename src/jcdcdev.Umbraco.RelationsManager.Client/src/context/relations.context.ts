import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";
import {RelationsManagerRepository} from "../repository/relations.repository.ts";
import {
	CreateRelationResponse,
	CreateRequestModel, RelationTypeModel,
} from "../api";

export class RelationsManagerContext extends UmbControllerBase {
	#repository: RelationsManagerRepository;

	constructor(host: UmbControllerHost) {
		super(host);
		this.provideContext(RELATIONS_MANAGER_CONTEXT_TOKEN, this);
		this.#repository = new RelationsManagerRepository(this);
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<CreateRelationResponse>> {
		return await this.#repository.create(request);
	}

	async delete(id: number): Promise<UmbDataSourceResponse> {
		return await this.#repository.delete(id);
	}

	async get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<RelationTypeModel>> {
		return await this.#repository.get(id, page, take, sort, desc);
	}
}

export const RELATIONS_MANAGER_CONTEXT_TOKEN = new UmbContextToken<RelationsManagerContext>("RelationsManagerContext");