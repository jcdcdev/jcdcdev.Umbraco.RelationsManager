import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";
import {tryExecute} from "@umbraco-cms/backoffice/resources";
import {PagedRelationTypeTreeItemResponseModel, RelationsManager} from "../api";
import {UmbTreeRootItemsRequestArgs} from "@umbraco-cms/backoffice/tree";
import {isOffsetPaginationRequest} from "@umbraco-cms/backoffice/utils";

export class RelationTypeDataSource {

	#host: UmbControllerHost;

	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	async getRoot(args: UmbTreeRootItemsRequestArgs): Promise<UmbDataSourceResponse<PagedRelationTypeTreeItemResponseModel>> {
		let skip = 0;
		let take = 100;
		if (args.paging !== undefined && isOffsetPaginationRequest(args.paging)) {
			skip = args.paging.skip;
			take = args.paging.take;
		}

		const options = {
			query: {
				skip: skip,
				take: take,
			}
		}

		return await tryExecute(this.#host, RelationsManager.getTreeRoot(options));
	}


	async getChildren(skip: number = 0, take: number = 999): Promise<UmbDataSourceResponse<PagedRelationTypeTreeItemResponseModel>> {
		const options = {
			query: {
				skip: skip,
				take: take,
			}
		}
		return await tryExecute(this.#host, RelationsManager.getTreeItemNull(options));
	}
}