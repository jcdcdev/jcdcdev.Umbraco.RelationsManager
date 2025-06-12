import {UmbTreeAncestorsOfRequestArgs, UmbTreeChildrenOfRequestArgs, UmbTreeRootItemsRequestArgs, UmbTreeServerDataSourceBase} from "@umbraco-cms/backoffice/tree";
import {RelationTypeTreeItemResponseModel} from "../api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {RelationTypeDataSource} from "../repository/relation-type.data-source.ts";
import {RELATION_TYPE_TREE_ITEM_TYPE, RELATION_TYPE_TREE_ROOT_ITEM_TYPE, RelationTypeTreeItemModel} from "./types.ts";
import {UmbDataSourceResponse} from "@umbraco-cms/backoffice/repository";

export class RelationTypeTreeServerDataSource extends UmbTreeServerDataSourceBase<RelationTypeTreeItemResponseModel, RelationTypeTreeItemModel> {

	constructor(host: UmbControllerHost) {
		const resource = new RelationTypeDataSource(host);

		const getRootItems = async (args: UmbTreeRootItemsRequestArgs) => {
			return await resource.getRoot(args);
		};

		const getChildrenOf = async (args: UmbTreeChildrenOfRequestArgs) => {
			return await resource.getChildren(args.skip, args.take);
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