import {UmbUniqueTreeStore} from "@umbraco-cms/backoffice/tree";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbContextToken} from "@umbraco-cms/backoffice/context-api";

export class RelationTypeTreeStore extends UmbUniqueTreeStore {
	constructor(host: UmbControllerHost) {
		super(host, RELATION_TYPE_TREE_STORE_CONTEXT.toString());
	}
}

export const RELATION_TYPE_TREE_STORE_CONTEXT = new UmbContextToken<RelationTypeTreeStore>(
	'RelationTypeTreeStore'
);