import {UmbTreeRepositoryBase} from "@umbraco-cms/backoffice/tree";
import {RELATION_TYPE_TREE_ROOT_ITEM_TYPE, RelationTypeTreeItemModel, RelationTypeTreeRootModel} from "../tree/types.ts";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {RelationTypeTreeServerDataSource} from "../tree/relation-type.data-source.ts";
import {UmbApi} from "@umbraco-cms/backoffice/extension-api";
import {RELATION_TYPE_TREE_STORE_CONTEXT} from "../tree/relation-type.tree-store.ts";
import type { UmbProblemDetails } from '@umbraco-cms/backoffice/resources';

export class RelationTypeRepository extends UmbTreeRepositoryBase<RelationTypeTreeItemModel, RelationTypeTreeRootModel> implements UmbApi {
	constructor(host: UmbControllerHost) {
		super(host, RelationTypeTreeServerDataSource, RELATION_TYPE_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot(): Promise<{
		data?: RelationTypeTreeRootModel;
		error?: UmbProblemDetails;
	}> {
		const {data: treeRootData} = await this._treeSource.getRootItems({});
		const hasChildren = treeRootData ? treeRootData.total > 0 : false;

		const data: RelationTypeTreeRootModel = {
			unique: null,
			entityType: RELATION_TYPE_TREE_ROOT_ITEM_TYPE,
			name: 'Relation Types',
			hasChildren,
			isFolder: true,
		};

		return {data};
	}
}

export default RelationTypeRepository;
