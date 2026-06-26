import {UmbTreeAncestorsOfRequestArgs, UmbTreeChildrenOfRequestArgs, UmbTreeRootItemsRequestArgs, UmbTreeServerDataSourceBase} from "@umbraco-cms/backoffice/tree";
import {RelationTypeTreeItemResponseModel} from "../api";
import {isOffsetPaginationRequest} from "@umbraco-cms/backoffice/utils";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {RelationTypeDataSource} from "../repository/relation-type.data-source.ts";
import {RELATION_TYPE_TREE_ITEM_TYPE, RELATION_TYPE_TREE_ROOT_ITEM_TYPE, RelationTypeTreeItemModel} from "./types.ts";
import {UmbDataSourceResponse, UmbTargetPagedModel} from "@umbraco-cms/backoffice/repository";

export class RelationTypeTreeServerDataSource extends UmbTreeServerDataSourceBase<RelationTypeTreeItemResponseModel, RelationTypeTreeItemModel> {

	constructor(host: UmbControllerHost) {
		const resource = new RelationTypeDataSource(host);

		const getRootItems = async (args: UmbTreeRootItemsRequestArgs): Promise<UmbDataSourceResponse<UmbTargetPagedModel<RelationTypeTreeItemResponseModel>>> => {
			const results = await resource.getRoot(args);
			const items = results.data?.items || [];
			let total = 0;
			if (results.data?.total) {
				total = parseInt(results.data.total.toString());
			}
			const totalAfter = args.paging && isOffsetPaginationRequest(args.paging) ? args.paging.skip + args.paging.take < total ? total - (args.paging.skip + args.paging.take) : 0 : 0;
			const totalBefore = args.paging && isOffsetPaginationRequest(args.paging) ? args.paging.skip : 0;
	
			return {
				data: {
					items: items,
					total: total,
					totalAfter: totalAfter,
					totalBefore: totalBefore
				}
			}
		};

		const getChildrenOf = async (args: UmbTreeChildrenOfRequestArgs): Promise<UmbDataSourceResponse<UmbTargetPagedModel<RelationTypeTreeItemResponseModel>>> => {
			if (args.paging === undefined) {
				throw new Error("Paging information is required for this endpoint.");
			}
			if (!isOffsetPaginationRequest(args.paging)) {
				console.log("Position-based pagination is not supported for this endpoint.");
				throw new Error("Position-based pagination is not supported for this endpoint.");
			}

			const result = await resource.getChildren(args.paging.skip, args.paging.take);
			let total = 0;
			if (result.data?.total) {
				total = parseInt(result.data.total.toString());
			}
			const totalAfter = args.paging.skip + args.paging.take < total ? total - (args.paging.skip + args.paging.take) : 0;
			const totalBefore = args.paging.skip;
			const items = result.data?.items || [];
			return {
				data: {
					items: items,
					total: total,
					totalAfter: totalAfter,
					totalBefore: totalBefore
				}
			}
		};

		const mapper = (item: RelationTypeTreeItemResponseModel): RelationTypeTreeItemModel => {
			return {
				unique: item.id.toString(),
				parent: {
					unique: item.parent ? item.parent.id : null,
					entityType: item.parent ? RELATION_TYPE_TREE_ITEM_TYPE : RELATION_TYPE_TREE_ROOT_ITEM_TYPE
				},
				name: item.name!,
				entityType: RELATION_TYPE_TREE_ITEM_TYPE,
				hasChildren: false,
				isFolder: false,
				icon: 'icon-alarm-clock'
			};
		};

		function getAncestorsOf(args: UmbTreeAncestorsOfRequestArgs): Promise<UmbDataSourceResponse<Array<RelationTypeTreeItemResponseModel>>> {
			console.log('getAncestorsOf', args);
			throw new Error('Method not implemented.');
		}

		super(host, {
			getRootItems,
			getChildrenOf,
			getAncestorsOf,
			mapper,
		});
	}
}
