import {UmbTreeItemModel, UmbTreeRootModel} from "@umbraco-cms/backoffice/tree"
import {RelationTypeTreeItemResponseModel} from "../api";
import {UmbPagedModel} from "@umbraco-cms/backoffice/repository";

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

export interface RelationTypeDetailModel {
	entityType: RelationTypeTreeItemType,
	unique: string,
	name: string,
}

export class RelationTypePagedModel implements UmbPagedModel<RelationTypeTreeItemResponseModel> {
	constructor(total: number, items: Array<RelationTypeTreeItemResponseModel>) {
		this.total = total;
		this.items = items;
	}

	total: number;
	items: Array<RelationTypeTreeItemResponseModel>;
}

