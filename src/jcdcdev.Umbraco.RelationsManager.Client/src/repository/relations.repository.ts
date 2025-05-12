import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {RelationsManagerDataSource, IRelationsManagerDataSource} from "./relations.data-source.ts";
import {
	PostUmbracoRelationsmanagerApiV1RelationResponse,
	DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse,
	GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	CreateRequestModel
} from "../api";

export class RelationsManagerRepository extends UmbControllerBase {
	#resource: IRelationsManagerDataSource;

	constructor(host: UmbControllerHost) {
		super(host);
		this.#resource = new RelationsManagerDataSource(host);
	}

	async create(request: CreateRequestModel): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await this.#resource.create(request);
	}

	async delete(id: number): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#resource.delete(id);
	}

	async get(id: string, page?: number, take?: number, sort?: string, desc?: boolean): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#resource.get(id, page, take, sort, desc);
	}
}

