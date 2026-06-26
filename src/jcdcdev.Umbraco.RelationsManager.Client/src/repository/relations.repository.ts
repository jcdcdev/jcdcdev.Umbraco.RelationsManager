import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {RelationsManagerDataSource, IRelationsManagerDataSource} from "./relations.data-source.ts";
import {
	CreateRelationResponse,
	CreateRequestModel, RelationTypeModel
} from "../api";

export class RelationsManagerRepository extends UmbControllerBase {
	#resource: IRelationsManagerDataSource;

	constructor(host: UmbControllerHost) {
		super(host);
		this.#resource = new RelationsManagerDataSource(host);
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<CreateRelationResponse>> {
		return await this.#resource.create(request);
	}

	async delete(id: number): Promise<UmbDataSourceResponse> {
		return await this.#resource.delete(id);
	}

	async get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<RelationTypeModel>> {
		return await this.#resource.get(id, page, take, sort, desc);
	}
}

