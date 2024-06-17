import {UMB_AUTH_CONTEXT} from "@umbraco-cms/backoffice/auth";
import {OpenAPI} from "./api";
import {UmbEntryPointOnInit} from "@umbraco-cms/backoffice/extension-api";
import {
	ManifestMenu,
	ManifestMenuItemTreeKind,
	ManifestRepository,
	ManifestSection,
	ManifestSectionSidebarApp,
	ManifestTree,
	ManifestTreeItem,
	ManifestTreeStore,
	ManifestWorkspace
} from "@umbraco-cms/backoffice/extension-registry";
import {RELATION_TYPE_TREE_ITEM_TYPE, RELATION_TYPE_TREE_ROOT_ITEM_TYPE} from "./tree/types.ts";
import RelationTypeRepository from "./repository/relation-type.repository.ts";
import {RelationTypeTreeStore} from "./tree/relation-type.tree-store.ts";
import "./components/create-relation-editor.ts";
import "./components/relations-manager-editor.ts";

const RELATION_TYPE_MANAGER_SECTION_ALIAS = 'RelationsManager.Section';
const sectionManifest: ManifestSection =
	{
		type: 'section',
		alias: RELATION_TYPE_MANAGER_SECTION_ALIAS,
		name: 'Relations Manager',
		meta: {
			label: 'Relations Manager',
			pathname: 'relations-manager'
		},
	};

const RELATION_TYPE_MANAGER_WORKSPACE_ALIAS = 'RelationsManager.Workspace'
const workspace: ManifestWorkspace = {
	type: 'workspace',
	kind: 'routable',
	alias: RELATION_TYPE_MANAGER_WORKSPACE_ALIAS,
	name: 'Relation Type Workspace',
	api: () => import('./workspace/relation-type-workspace.context.ts'),
	meta: {
		entityType: RELATION_TYPE_TREE_ITEM_TYPE
	},
};

const RELATION_TYPE_REPOSITORY_ALIAS = 'RelationsManager.Repository';
const treeRepository: ManifestRepository = {
	type: 'repository',
	alias: RELATION_TYPE_REPOSITORY_ALIAS,
	name: 'Relation Type Repository',
	api: RelationTypeRepository,
};

const RELATION_TYPE_TREE_STORE_ALIAS = 'RelationsManager.TreeStore';
const treeStore: ManifestTreeStore = {
	type: 'treeStore',
	alias: RELATION_TYPE_TREE_STORE_ALIAS,
	name: 'Relation Type tree Store',
	api: RelationTypeTreeStore
};
const RELATION_TYPE_TREE_ALIAS = 'RelationsManager.Tree';
const tree: ManifestTree =
	{
		type: 'tree',
		kind: 'default',
		alias: RELATION_TYPE_TREE_ALIAS,
		name: 'Relations Manager',
		meta: {
			repositoryAlias: RELATION_TYPE_REPOSITORY_ALIAS,
		},
	};

const treeItem: ManifestTreeItem = {
	type: 'treeItem',
	kind: 'default',
	alias: 'RelationType.Tree.RootItem',
	name: 'Relation Type Tree Item',
	forEntityTypes: [
		RELATION_TYPE_TREE_ROOT_ITEM_TYPE,
		RELATION_TYPE_TREE_ITEM_TYPE
	]
}

let RELATION_TYPE_TREE_MENU_ALIAS = 'RelationsManager.Menu';
const menuItem: ManifestMenuItemTreeKind = {
	type: 'menuItem',
	kind: 'tree',
	alias: 'RelationType.Tree.MenuItem',
	name: 'Relation Type Tree Menu Item',
	weight: 400,
	meta: {
		label: 'Relation',
		treeAlias: RELATION_TYPE_TREE_ALIAS,
		menus: [RELATION_TYPE_TREE_MENU_ALIAS],
	}
};
const menu: ManifestMenu = {
	type: 'menu',
	alias: RELATION_TYPE_TREE_MENU_ALIAS,
	name: 'Relation Typeszz'
}

const sectionSidebar: ManifestSectionSidebarApp = {
	type: 'sectionSidebarApp',
	kind: 'menu',
	alias: 'RelationsManager.SectionSidebarApp',
	name: 'Relations Manager',
	meta: {
		sections: ["RelationsManager.Section"],
		label: 'Relations Manager',
		menu: RELATION_TYPE_TREE_MENU_ALIAS
	},
	conditions:[
		{
			alias: 'Umb.Condition.SectionAlias',
			match: RELATION_TYPE_MANAGER_SECTION_ALIAS
		}
	]
};

export const manifests = [treeRepository, treeStore, tree, treeItem, menuItem, sectionManifest, menu, sectionSidebar, workspace];
export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
	extensionRegistry.registerMany([
		...manifests
	]);

	_host.consumeContext(UMB_AUTH_CONTEXT, (_auth) => {
		const umbOpenApi = _auth.getOpenApiConfiguration();
		OpenAPI.TOKEN = umbOpenApi.token;
		OpenAPI.BASE = umbOpenApi.base;
		OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
	});
};