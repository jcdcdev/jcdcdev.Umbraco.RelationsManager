import {UmbTreeAncestorsOfRequestArgs, UmbTreeChildrenOfRequestArgs, UmbTreeRootItemsRequestArgs, UmbTreeServerDataSourceBase} from "@umbraco-cms/backoffice/tree";
import {RelationTypeTreeItemResponseModel} from "../api";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {RelationTypeDataSource} from "../repository/relation-type.data-source.ts";
import {RELATION_TYPE_TREE_ITEM_TYPE, RELATION_TYPE_TREE_ROOT_ITEM_TYPE, RelationTypePagedModel, RelationTypeTreeItemModel} from "./types.ts";

export class RelationTypeTreeServerDataSource extends UmbTreeServerDataSourceBase<RelationTypeTreeItemResponseModel, RelationTypeTreeItemModel> {

	constructor(host: UmbControllerHost) {
		const resource = new RelationTypeDataSource(host);

		const getRootItems = async (args: UmbTreeRootItemsRequestArgs) => {
			const results = await resource.getRoot(args);
			const items = results.data!.items;
			return new RelationTypePagedModel(items.length, items);
		};

		const getChildrenOf = async (args: UmbTreeChildrenOfRequestArgs) => {
			const results = await resource.getChildren(args.skip, args.take);
			const items = results.data!.items;
			return new RelationTypePagedModel(items.length, items);
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

		function getAncestorsOf(args: UmbTreeAncestorsOfRequestArgs): Promise<Array<RelationTypeTreeItemResponseModel>> {
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