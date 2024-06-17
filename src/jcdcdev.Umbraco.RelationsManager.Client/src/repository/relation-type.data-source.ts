import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecuteAndNotify} from "@umbraco-cms/backoffice/resources";
import {getUmbracoRelationsmanagerApiV1TreeItemNull, getUmbracoRelationsmanagerApiV1TreeRoot, GetUmbracoRelationsmanagerApiV1TreeRootResponse} from "../api";
import {UmbTreeRootItemsRequestArgs} from "@umbraco-cms/backoffice/tree";


export class RelationTypeDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async getRoot(args: UmbTreeRootItemsRequestArgs): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1TreeRootResponse>> {
		return await tryExecuteAndNotify(this.#host, getUmbracoRelationsmanagerApiV1TreeRoot({skip: args.skip, take: args.take}));
	}

	
	async getChildren(skip: number = 0, take: number = 999): Promise<UmbDataSourceResponse<GetUmbracoRelationsmanagerApiV1TreeRootResponse>> {
		return await tryExecuteAndNotify(this.#host, getUmbracoRelationsmanagerApiV1TreeItemNull({
			skip: skip,
			take: take
		}));

	}
}
