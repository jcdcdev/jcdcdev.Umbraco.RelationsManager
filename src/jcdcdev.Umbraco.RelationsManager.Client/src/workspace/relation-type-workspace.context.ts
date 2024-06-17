import {UmbRoutableWorkspaceContext, UmbWorkspaceContext, UmbWorkspaceRouteManager} from "@umbraco-cms/backoffice/workspace";
import {RELATION_TYPE_TREE_ITEM_TYPE} from "../tree/types.ts";
import {UmbControllerHost} from "@umbraco-cms/backoffice/controller-api";
import {UmbPathPattern} from "@umbraco-cms/backoffice/router";
import {UmbContextBase} from "@umbraco-cms/backoffice/class-api";
import {RelationsManagerWorkspaceElement} from "./relations-manager-workspace.element.ts";

const RELATION_TYPE_MANAGER_CONTEXT_TOKEN = 'RelationsManager.Workspace';
const EDIT_RELATION_TYPE_WORKSPACE_PATH_PATTERN = new UmbPathPattern('/edit/:id');

export class RelationTypeManagerWorkspaceContext
	extends UmbContextBase<RelationTypeManagerWorkspaceContext>
	implements UmbWorkspaceContext, UmbRoutableWorkspaceContext {
	readonly routes: UmbWorkspaceRouteManager;

	constructor(host: UmbControllerHost) {
		super(host, RELATION_TYPE_MANAGER_CONTEXT_TOKEN);
		this.routes = new UmbWorkspaceRouteManager(host);
		this.routes.setRoutes([
			{
				path: EDIT_RELATION_TYPE_WORKSPACE_PATH_PATTERN.toString(),
				component: RelationsManagerWorkspaceElement,
				setup: (component, info) => {
					const element = component as RelationsManagerWorkspaceElement;
					console.log('setup', component, info);
					element.relationTypeId = info.match.params.id;
				}
			}]);
	}

	destroy(): void {
		throw new Error("Method not implemented.");
	}

	getEntityType = () => RELATION_TYPE_TREE_ITEM_TYPE;
	readonly workspaceAlias = RELATION_TYPE_MANAGER_WORKSPACE_CONTEXT;
}

export {RelationTypeManagerWorkspaceContext as api};

export const RELATION_TYPE_MANAGER_WORKSPACE_CONTEXT = 'relation-type-manager-workspace';
