import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {UmbControllerBase} from "@umbraco-cms/backoffice/class-api";
import {RelationsManagerDataSource, IRelationsManagerDataSource} from "./relations.data-source.ts";
import {
	PostUmbracoRelationsmanagerApiV1RelationResponse,
	DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse,
	GetUmbracoRelationsmanagerApiV1RelationByIdResponse,
	PostUmbracoRelationsmanagerApiV1RelationData, DeleteUmbracoRelationsmanagerApiV1RelationByIdData, GetUmbracoRelationsmanagerApiV1RelationByIdData
} from "../api";

export class RelationsManagerRepository extends UmbControllerBase {
	#resource: IRelationsManagerDataSource;

	constructor(host: UmbControllerHost) {
		super(host);
		this.#resource = new RelationsManagerDataSource(host);
	}

	async create(request: PostUmbracoRelationsmanagerApiV1RelationData): Promise<UmbDataSourceResponse<PostUmbracoRelationsmanagerApiV1RelationResponse>> {
		return await this.#resource.create(request);
	}

	async delete(request: DeleteUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<DeleteUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#resource.delete(request);
	}

	async get(request: GetUmbracoRelationsmanagerApiV1RelationByIdData): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1RelationByIdResponse>> {
		return await this.#resource.get(request);
	}
}

