import {css, html, HTMLTemplateResult, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {TableColumn, TableItem} from './uui-paginated-table';
import {UUITextStyles} from '@umbraco-cms/backoffice/external/uui';
import {UmbElementMixin} from '@umbraco-cms/backoffice/element-api';
import {RelationsManagerContext} from "../context/relations.context.ts";
import {DeleteUmbracoRelationsmanagerApiV1RelationByIdData, GetUmbracoRelationsmanagerApiV1RelationByIdData, GetUmbracoRelationsmanagerApiV1RelationByIdResponse} from "../api";

@customElement('relations-manager-editor')
export class RelationsManagerEditor extends UmbElementMixin(LitElement) {
	#context: RelationsManagerContext;

	constructor() {
		super();
		this.#context = new RelationsManagerContext(this);
	}

	@state()
	selection: string[] = [];
	@state()
	relationType: GetUmbracoRelationsmanagerApiV1RelationByIdResponse | null = null;
	@property({type: String})
	relationTypeId: string | null = null;
	@state()
	dialog: HTMLTemplateResult | null = null;
	@state()
	showDeleteConfirm: boolean = false;
	@state()
	showCreateDialog: boolean = false;
	@state()
	errorMessage: string = '';
	@state()
	pageSize: number = 10;
	@state()
	successMessage: string = '';

	@state()
	currentPage: number = 1;

	@state()
	sortColumn: string = '';
	@state()
	sortDesc: boolean = false;

	private _renderRelationChildNameCell = (value: string) => {
		const relation = this.relationType!.relations.items.find(r => r.childName === value);
		if (!relation) {
			return html`<p>${value}</p>`;
		}
		const id = relation.childId;
		const type = relation.childEntityType ?? "document";

		return this._renderCell(id, value, type);
	}

	// @ts-ignore
	private _renderCell(id: number, value: string, editorType: string) {
		const icon = editorType === 'media' ? 'picture' : editorType === 'document' ? 'document' : 'lock';
		return html`
			<uui-button look="text">
				<uui-icon name="${icon}" style="vertical-align:middle;"></uui-icon>
				<span style="vertical-align:middle; ">
                    ${value}
                </span>
			</uui-button>
		`;
	}

	private _renderRelationParentNameCell = (value: string) => {
		const relation = this.relationType!.relations.items.find(r => r.parentName === value);
		if (!relation) {
			return html`<p>${value}</p>`;
		}
		const id = relation.parentId;
		const type = relation.parentEntityType ?? "document";
		return this._renderCell(id, value, type);
	}


	private async _sortingChange(event: CustomEvent) {
		this.sortColumn = event.detail.column;
		this.sortDesc = event.detail.desc;
		await this.updateComplete;
		await this.getData();
	}

	async getData() {
		if (this.relationTypeId === null) {
			return
		}
		const request: GetUmbracoRelationsmanagerApiV1RelationByIdData = {
			id: this.relationTypeId,
			page: this.currentPage,
			take: this.pageSize,
			sort: this.sortColumn,
			desc: this.sortDesc
		};


		const results = await this.#context.get(request);
		this.relationType = results.data ?? null;
	}

	render() {
		const loader = html`
			<uui-loader-bar style="color: blue"></uui-loader-bar>
		`;
		const hasData = this.relationType !== null;
		if (!hasData) {
			return loader;
		}
		const relationType = this.relationType!;
		const dataColumn = new TableColumn('Create Date', 'createDate');
		{
			dataColumn.render = (value: string) => {
				return new Date(value).toLocaleString();
			}
		}
		
		const parwnt = new TableColumn('Parent Name', 'parentName');
		const child = new TableColumn('Child Name', 'childName');

		parwnt.render = this._renderRelationParentNameCell;
		child.render = this._renderRelationChildNameCell;
		const columns: TableColumn[] = [
			parwnt,
			child,
			dataColumn,
			new TableColumn('Comment', 'comment'),
		];

		const rows = relationType.relations.items.map((relation: any) => {
			return new TableItem(relation.id.toString(), relation);
		});

		const pages = relationType.relations.totalPages === 0 ? 1 : relationType.relations.totalPages;
		const currentPage = relationType.relations.currentPage;

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

		let dialog = null;
		if (this.showDeleteConfirm) {
			dialog = html`
				<uui-modal-dialog>
					<uui-dialog>
						<uui-dialog-layout headline="Delete">
							<p>Delete ${this.selection.length} relations?</p>
							<uui-button slot="actions" @click="${() => this.showDeleteConfirm = false}">Cancel
							</uui-button>
							<uui-button slot="actions" @click="${this._deleteSelection}" look="primary" color="danger">
								Delete
							</uui-button>
						</uui-dialog-layout>
					</uui-dialog>
				</uui-modal-dialog>
			`;
		}

		const headline = html`
			<span slot="headline" look="placeholder" style="font-weight:inherit;">${relationType.name}</span>
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
				${dialog}
			</uui-modal-container>
			<uui-box>
				${headline}
				${this._renderTable(columns, rows, pages, currentPage)}
			</uui-box>
		`;
	}

	private _renderTable(columns: TableColumn[], rows: TableItem[], pages: number, currentPage: number): unknown {
		if (rows.length === 0) {
			return html`<p>No relations found</p>`;
		}
		return html`
			<uui-paginated-table
				.rows="${rows}"
				.columns="${columns}"
				.total="${pages}"
				.currentPage="${currentPage}"
				.pageSize="${this.pageSize}"
				showDeleteButton="true"
				@sorting-change="${this._sortingChange}"
				@page-change="${this._pageChange}"
				@page-size-change="${this._pageSizeChange}"
				@selection-changed="${this._handleSelectionChange}"
				@delete-selection="${() => this.showDeleteConfirm = true}">
			</uui-paginated-table>
		`;
	}

	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('relationTypeId')) {

			this.getData();
		}
	}

	private async _deleteSelection() {
		this.showDeleteConfirm = false;
		let success = true;
		for (let i = 0; i < this.selection.length; i++) {
			const id = this.selection[i];
			const request: DeleteUmbracoRelationsmanagerApiV1RelationByIdData = {
				id: parseInt(id)
			};
			const result = await this.#context.delete(request);
			if (result.error) {
				success = false;
			}
		}
		if (success) {
			this.successMessage = 'Relations deleted';
			this.getData();
		} else {
			this.errorMessage = 'There was an error deleting the relations';
		}
	}

	private _handleSelectionChange(event: CustomEvent) {
		this.selection = event.detail.selection;
	}

	private _pageChange(event: CustomEvent) {
		this.currentPage = event.detail.page;
		this.getData();
	}

	private _pageSizeChange(event: CustomEvent) {
		this.pageSize = event.detail.pageSize;
		this.getData();
	}

	static styles = [
		UUITextStyles,
		css`

		`
	]
}

declare global {
	interface HTMLElementTagNameMap {
		'relations-manager-editor': RelationsManagerEditor;
	}
}