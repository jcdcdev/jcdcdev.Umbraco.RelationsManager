import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecute} from "@umbraco-cms/backoffice/resources";
import {GetUmbracoRelationsmanagerApiV1TreeRootResponse, RelationTypeService} from "../api";
import {UmbTreeRootItemsRequestArgs} from "@umbraco-cms/backoffice/tree";

export class RelationTypeDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async getRoot(args: UmbTreeRootItemsRequestArgs): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1TreeRootResponse>> {
		const options = {
			query: {
				skip: args.skip,
				take: args.take,
			}
		}
		return await tryExecute(this.#host, RelationTypeService.getUmbracoRelationsmanagerApiV1TreeRoot(options));
	}


	async getChildren(skip: number = 0, take: number = 999): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1TreeRootResponse>> {
		const options = {
			query: {
				skip: skip,
				take: take,
			}
		}
		return await tryExecute(this.#host, RelationTypeService.getUmbracoRelationsmanagerApiV1TreeItemNull(options));
	}
}