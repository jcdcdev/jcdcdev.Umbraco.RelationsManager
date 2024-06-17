import {LitElement, html, TemplateResult, css, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {RelationTypeModel} from "../api";
import {RelationsManagerContext} from "../context/relations.context.ts";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";

@customElement('relations-manager')
export class RelationsManagerWorkspaceElement extends UmbElementMixin(LitElement) {

	@property({type: String})
	relationTypeId: string = '';

	@state()
	showRelationsManager = true;

	@state()
	showCreateEditor = false;

	@state()
	relationType: RelationTypeModel | null = null;
	#context: RelationsManagerContext;

	constructor() {
		super();
		this.#context = new RelationsManagerContext(this);
	}

	protected updated(_changedProperties: PropertyValues) {
		if (_changedProperties.has("relationTypeId")) {
			
			this.getRelationType();
		}
	}

	async getRelationType() {
		
		if (!this.relationTypeId) {
			return;
		}
		const relationType = await this.#context.get({id: this.relationTypeId});
		if (!relationType.data) {
			return;
		}
		this.relationType = relationType.data;
	}

	render() {
		return html`
			<div class="umb-dashboard">
				<div class="umb-dashboard__header">
					<uui-tab-group>
						${this._renderTabs()}
					</uui-tab-group>
				</div>
				<div class="umb-dashboard__content">
					${this._renderActiveTab()}
				</div>
			</div>
		`;
			
	}

	private _renderActiveTab(): TemplateResult | null {
		if (this.showCreateEditor) {
			return html`
				<create-relation-editor .relationTypeId="${this.relationTypeId}"></create-relation-editor>
			`;
		} else if (this.showRelationsManager) {
			return html`
				<relations-manager-editor .relationTypeId="${this.relationTypeId}"></relations-manager-editor>
			`;
		}
		return null;
	}

	private _renderTabs() {
		return html`
			<uui-tab @click="${() => this.toggleTabs("edit")}" ?active="${this.showRelationsManager}" id="edit">
				Edit
			</uui-tab>
			<uui-tab @click="${() => this.toggleTabs("create")}" ?active="${this.showCreateEditor}" id="create">
				Create
			</uui-tab>
		`;
	}

	toggleTabs = (tab: string) => {
		switch (tab) {
			case "create":
				this.showRelationsManager = false;
				this.showCreateEditor = true;
				break;
			case "edit":
				this.showRelationsManager = true;
				this.showCreateEditor = false;
				break;
		}
	}

	static styles = css`
		.umb-dashboard__header {
			background: #fff;
			border-bottom: 1px solid #e9e9eb;
			box-sizing: border-box;
			display: flex;
			flex: 0 0 70px;
			flex-direction: column;
			justify-content: flex-end;
		}

		.umb-dashboard__content {
			overflow: auto;
			padding: 20px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'relations-manager': RelationsManagerWorkspaceElement;
	}
}