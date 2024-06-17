import {css, html, LitElement, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {GetUmbracoRelationsmanagerApiV1RelationByIdData, PostUmbracoRelationsmanagerApiV1RelationData, RelationTypeModel} from "../api";
import {RelationsManagerContext} from "../context/relations.context.ts";
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import {UUITextStyles} from "@umbraco-cms/backoffice/external/uui";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext, UmbModalToken} from "@umbraco-cms/backoffice/modal";
import {UMB_DOCUMENT_PICKER_MODAL, UmbDocumentItemRepository} from "@umbraco-cms/backoffice/document";
import {UMB_MEDIA_PICKER_MODAL, UmbMediaItemRepository} from "@umbraco-cms/backoffice/media";
import {UmbMemberItemRepository} from "@umbraco-cms/backoffice/member";
import type {UmbReferenceByUnique} from "@umbraco-cms/backoffice/models";

export declare const UMB_MEMBER_ENTITY_TYPE = "member";
export declare const UMB_MEMBER_ROOT_ENTITY_TYPE = "member-root";
export type UmbMemberEntityType = typeof UMB_MEMBER_ENTITY_TYPE;
export type UmbMemberRootEntityType = typeof UMB_MEMBER_ROOT_ENTITY_TYPE;

export interface UmbMemberItemModel {
	entityType: UmbMemberEntityType;
	unique: string;
	name: string;
	memberType: {
		unique: string;
		icon: string;
		collection: UmbReferenceByUnique | null;
	};
	variants: Array<UmbMemberVariantItemModel>;
}

export interface UmbMemberVariantItemModel {
	name: string;
	culture: string | null;
}

export interface UmbMemberPickerModalData {
	multiple?: boolean;
	filter?: (member: UmbMemberItemModel) => boolean;
}

export interface UmbMemberPickerModalValue {
	selection: Array<string | null>;
}

export const UMB_MEMBER_PICKER_MODAL = new UmbModalToken<UmbMemberPickerModalData, UmbMemberPickerModalValue>(
	'Umb.Modal.MemberPicker',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);

class CreateRelationModel {
	constructor(id: string, name: string, contentTypeAlias: string, icon: string) {
		this.id = id;
		this.name = name;
		this.contentTypeAlias = contentTypeAlias;
		this.icon = icon;
	}

	id: string;
	name: string;
	contentTypeAlias: string;
	icon: string;
}

@customElement('create-relation-editor')
export class CreateRelationEditor extends UmbElementMixin(LitElement) {
	#context: RelationsManagerContext;
	private _modalContext: UmbModalManagerContext | undefined;
	private documentRepo: UmbDocumentItemRepository;
	private memberRepo: UmbMemberItemRepository;
	private mediaRepo: UmbMediaItemRepository;

	constructor() {
		super();

		this.#context = new RelationsManagerContext(this);
		this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
			this._modalContext = _instance;
		});

		this.documentRepo = new UmbDocumentItemRepository(this);
		this.mediaRepo = new UmbMediaItemRepository(this);
		this.memberRepo = new UmbMemberItemRepository(this);
	}

	@state()
	loading = false;

	@state()
	errorMessage = '';

	@state()
	successMessage = '';

	@state()
	parent: undefined | CreateRelationModel;

	@state()
	child: undefined | CreateRelationModel;

	@property({type: String})
	relationTypeId: string = '';

	@state()
	parentEntityType: string | undefined;

	@state()
	childEntityType: string | undefined;

	@state()
	relationType: RelationTypeModel | null = null;

	@state()
	comment = '';

	@state()
	private showParentEntityTypeSelector: boolean = false;
	@state()
	private showChildEntityTypeSelector: boolean = false;

	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('relationTypeId')) {
			this.getData()
		}
	}

	async getData() {
		const request: GetUmbracoRelationsmanagerApiV1RelationByIdData = {
			id: this.relationTypeId,
		};

		const results = await this.#context.get(request);
		const relationType = results.data;
		if (!relationType) {
			return
		}
		this.relationType = relationType;
		this.parentEntityType = relationType.parentEntityType;
		this.childEntityType = relationType.childEntityType;
	}

	private async _openParentPicker() {
		const relationType = this.relationType;
		if (!relationType) {
			return;
		}
		const entityType = this.parentEntityType ?? "";
		if (entityType === "") {
			this.showParentEntityTypeSelector = true;
			return;
		}

		const result = await this._openContentPicker(entityType);
		if (result) {
			this.parent = result;
		}
		this.parentEntityType = relationType.parentEntityType
	}

	private async _openChildPicker() {
		const relationType = this.relationType;
		if (!relationType) {
			return;
		}

		const entityType = this.childEntityType ?? "";
		if (entityType === "") {
			this.showChildEntityTypeSelector = true;
			return;
		}
		const result = await this._openContentPicker(entityType);
		if (result) {
			this.child = result;
		}
		this.childEntityType = relationType.childEntityType
	}

	private async _openContentPicker(entityType: string): Promise<CreateRelationModel | undefined> {
		switch (entityType) {
			case 'document':
				return await this.contentPicker();
			case 'media':
				return await this.mediaPicker();
			case 'member':
				return await this.memberPicker();
		}
	}

	async memberPicker() {
		const pickerContext = this._modalContext?.open(this, UMB_MEMBER_PICKER_MODAL, {
			data: {
				multiple: false
			}
		});
		const data = await pickerContext?.onSubmit();
		if (!data) {
			return undefined;
		}

		const id = data.selection[0]!;
		const result = await this.memberRepo.requestItems([id]);
		if (!result.data || result.data.length === 0) {
			return undefined;
		}
		const item = result.data[0];
		return new CreateRelationModel(item.unique, item.name, item.memberType.unique, item.memberType.icon);
	}

	async mediaPicker() {
		const pickerContext = this._modalContext?.open(this, UMB_MEDIA_PICKER_MODAL, {
			data: {
				multiple: false
			}
		});
		const data = await pickerContext?.onSubmit();
		if (!data) {
			return undefined;
		}

		const id = data.selection[0]!;
		const result = await this.mediaRepo.requestItems([id]);
		if (!result.data || result.data.length === 0) {
			return undefined;
		}
		const item = result.data[0];
		return new CreateRelationModel(item.unique, item.name, item.mediaType.unique, item.mediaType.icon);
	}

	async contentPicker() {
		const pickerContext = this._modalContext?.open(this, UMB_DOCUMENT_PICKER_MODAL, {
			data: {
				multiple: false
			}
		});
		const data = await pickerContext?.onSubmit();
		if (!data) {
			return undefined;
		}

		const id = data.selection[0]!;
		const result = await this.documentRepo.requestItems([id]);
		if (!result.data || result.data.length === 0) {
			return undefined;
		}
		const item = result.data[0];
		return new CreateRelationModel(item.unique, item.name, item.documentType.unique, item.documentType.icon);
	}

	render() {
		if (!this.relationType) {
			return;
		}
		const valid = this.parent && this.child && this.errorMessage === '' && !this.loading;
		if (this.loading) {
			return html`
				<uui-loader-bar style="color: blue"></uui-loader-bar>
			`;
		}
		let notification = null;
		if (this.errorMessage !== '') {
			notification = html`
				<uui-toast-notification name="error" color="danger" @closed="${() => this.errorMessage = ''}">
					<uui-toast-notification-layout>
						<p>${this.errorMessage}</p>
					</uui-toast-notification-layout>
				</uui-toast-notification>
			`;
		}
		if (this.successMessage !== '') {
			notification = html`
				<uui-toast-notification name="success" color="positive" @closed="${() => this.successMessage = ''}">
					<uui-toast-notification-layout>
						<p>${this.successMessage}</p>
					</uui-toast-notification-layout>
				</uui-toast-notification>
			`;
		}
		let sidebar = null;
		let dialog = null;
		if (this.showParentEntityTypeSelector) {
			sidebar = this._renderParentEntityTypeSelector();
		}
		if (this.showChildEntityTypeSelector) {
			sidebar = this._renderChildEntityTypeSelector();
		}
		const headline = html`
			<span slot="headline" look="placeholder" style="font-weight:inherit;">${this.relationType.name}</span>
		`;

		return html`
			<uui-toast-notification-container
				id="toastContainer"
				auto-close="3000"
				bottom-up=""
				style="top:0; left:0; right:0; height: 100vh; padding: var(--uui-size-layout-1);">
				${notification}
			</uui-toast-notification-container>
			<uui-modal-container>
				${sidebar}
				${dialog}
			</uui-modal-container>
			<uui-box>
				${headline}
				<uui-form>
					<form id="createRelations" name="createRelations" @submit="${this.submit}">
						<uui-form-layout-item>
							<uui-label slot="label" for="parent" required="">Parent</uui-label>
							<span slot="description"></span>
							${this._renderParent()}
						</uui-form-layout-item>
						<uui-form-layout-item>
							<uui-label slot="label" for="child" required="">Child</uui-label>
							<span slot="description"></span>
							${this._renderChild()}
						</uui-form-layout-item>
						<uui-form-layout-item>
							<uui-label slot="label" for="comment">Comment</uui-label>
							<span slot="description"></span>
							<uui-input type="text" name="comment" @input="${(e: any) => this.comment = e.target.value}"
									   value="${this.comment}" placeholder="" label="comment"></uui-input>
						</uui-form-layout-item>
						<div>
							<uui-button type="submit" color="positive" label="Submit" look="primary"
										?disabled="${!valid}">
								Create
							</uui-button>
						</div>
					</form>
				</uui-form>
			</uui-box>
		`;
	}

	private async setParentEntityType(type: string) {
		this.parentEntityType = type;
		this.showParentEntityTypeSelector = false;
		await this.updateComplete;
		this._openParentPicker();
	}

	private async setChildEntityType(type: string) {
		this.childEntityType = type;
		this.showChildEntityTypeSelector = false;
		await this.updateComplete;
		this._openChildPicker();
	}

	private _renderParentEntityTypeSelector(): TemplateResult {
		return this._rennderEntityTypeSelector(() => this.showParentEntityTypeSelector = false, (value: string) => this.setParentEntityType(value));
	}

	private _rennderEntityTypeSelector(close: Function, change: Function): TemplateResult {
		return html`
			<uui-modal-sidebar @close="${() => close()}" size="small" style="background: var(--uui-color-background);">
				<div style="background: var(--uui-color-background); display: flex; flex-direction: column; height: 100%;">
					<uui-box headline="Select entity type" style="margin: 12px">
						<p>
							This relation type does not have an entity type restriction
						</p>
						<p>
							Please select the type of content you want to relate
						</p>
						<div class="entity-icon-row">
							<div class="entity-icon-wrapper">
								<div class="entity-icon" @click="${() => change('document')}">
									<uui-icon-registry-essential>
										<uui-icon name="document"></uui-icon>
									</uui-icon-registry-essential>
									Document
								</div>
							</div>
							<div class="entity-icon-wrapper">
								<div class="entity-icon" @click="${() => change('media')}">
									<uui-icon-registry-essential>
										<uui-icon name="picture"></uui-icon>
									</uui-icon-registry-essential>
									Media
								</div>
							</div>
							<div class="entity-icon-wrapper">
								<div class="entity-icon" @click="${() => change('member')}">
									<uui-icon-registry-essential>
										<uui-icon name="lock"></uui-icon>
									</uui-icon-registry-essential>
									Member
								</div>
							</div>
						</div>
					</uui-box>
					<div class="sidebar-buttons">
						<uui-button
							slot="actions"
							look="primary"
							pristine=""
							type="button"
							color="default"
							@click="${() => close()}">
							Close
						</uui-button>
					</div>
				</div>
			</uui-modal-sidebar>
		`;
	}

	private _renderChildEntityTypeSelector(): TemplateResult {
		return this._rennderEntityTypeSelector(() => this.showChildEntityTypeSelector = false, (value: string) => this.setChildEntityType(value));
	}

	private async submit(event: SubmitEvent) {
		event.preventDefault();
		if (event.target === null) {
			return;
		}
		const formNode = event.target as HTMLFormElement;
		const isValid = formNode.checkValidity();

		if (!isValid) {
			formNode.setAttribute('submit-invalid', '');
			return;
		}
		formNode.removeAttribute('submit-invalid');

		this.loading = true;
		await this.updateComplete
		const request: PostUmbracoRelationsmanagerApiV1RelationData = {
			requestBody: {
				comment: this.comment,
				parentId: this.parent!.id,
				childId: this.child!.id,
				relationType: this.relationTypeId
			}
		};
		const response = await this.#context.create(request)
		if (response.error) {
			// @ts-ignore
			this.errorMessage = response.error.body;
		} else {
			this.successMessage = 'Relation created';
			this.parent = undefined;
			this.child = undefined;
			this.comment = '';
		}
		this.loading = false;
	}

	private _renderContentBox(content: CreateRelationModel | undefined, open: Function): TemplateResult {
		let inner = null;
		let name = '';
		let description = 'Please select a content item';
		if (content) {
			name = content.name;
			description = ``;
			const icons = content.icon.split(" ");
			const icon = icons[0];
			const color = icons[1];
			inner = html`
				<uui-icon-registry-essential>
					<uui-icon name="${icon}" class="${color}"></uui-icon>
				</uui-icon-registry-essential>
			`;
		} else {
			inner = html`
				<uui-icon-registry-essential>
					<uui-icon name="add"></uui-icon>
				</uui-icon-registry-essential>
			`;
		}

		return html`
			<div @click="${open}">
				<uui-card-block-type name="${name}" description="${description}" @open="${open}" class="content-picker">
					${inner}
				</uui-card-block-type>
			</div>
		`;
	}

	private _renderParent(): TemplateResult {
		const content = this.parent;
		return html`
			${this._renderContentBox(content, this._openParentPicker)}
			${this._renderContentInput(content?.id, "parent")}
		`;
	}

	private _renderContentInput(value: string | undefined, name: string): TemplateResult {
		return html`
			<div style="display: none; visibility: hidden; margin-top:10px;">
				<uui-input required="" type="hidden" name="${name}" id="${name}" value="${value}"
						   required-message="You must make a selection"></uui-input>
			</div>
		`;
	}

	private _renderChild(): TemplateResult {
		const content = this.child;
		return html`
			${this._renderContentBox(content, this._openChildPicker)}
			${this._renderContentInput(content?.id, "child")}
		`;
	}

	static styles = [
		UUITextStyles,
		css`
			uui-card-content-node {
				width: 300px;
			}

			uui-card-block-type {
				width: 200px;
			}

			.content-picker {
				cursor: pointer;
			}

			.entity-icon-row {
				display: flex;
				justify-content: space-between;
			}

			.entity-icon-wrapper {
				width: calc(100% / 3);
				padding-top: calc(100% / 3);
				position: relative;
			}

			.entity-icon {
				justify-content: center;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				cursor: pointer;
				// border: 1px solid var(--uui-color-border);
			}

			.sidebar-buttons {
				margin-top: auto;
				display: flex;
				align-items: center;
				justify-content: end;
				padding: 16px;
				background: var(--uui-color-surface);
				box-shadow: var(--uui-shadow-depth-4);
			}
		`
	]
}

declare global {
	interface HTMLElementTagNameMap {
		'create-relation-editor': CreateRelationEditor;
	}
}