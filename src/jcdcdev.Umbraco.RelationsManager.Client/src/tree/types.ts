import {UmbTreeItemModel, UmbTreeRootModel} from "@umbraco-cms/backoffice/tree"

export const RELATION_TYPE_TREE_ROOT_ITEM_TYPE = 'relation-type-manager-root';
export const RELATION_TYPE_TREE_ITEM_TYPE = 'relation-type-manager-item';

export type RelationTypeTreeItemType = typeof RELATION_TYPE_TREE_ITEM_TYPE;
export type RelationTypeTreeRootItemType = typeof RELATION_TYPE_TREE_ROOT_ITEM_TYPE;

export interface RelationTypeTreeItemModel extends UmbTreeItemModel {
	entityType: RelationTypeTreeItemType
}

export interface RelationTypeTreeRootModel extends UmbTreeRootModel {
	entityType: RelationTypeTreeRootItemType
}