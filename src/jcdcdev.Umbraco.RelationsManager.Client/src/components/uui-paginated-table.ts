import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { customElement } from 'lit/decorators.js';
import { UUIPaginationEvent, UUITextStyles } from '@umbraco-ui/uui';

export class TableColumn {
    constructor(name: string, alias: string) {
        this.name = name;
        this.alias = alias;
        this.render = (value: string) => {
            return value;
        };
    }

    name: string;
    alias: string;
    render: Function;
}

export class TableItem {
    constructor(key: string, item: object) {
        this.key = key
        this.item = item;
    }

    key: string;
    item: object;
}

@customElement('uui-paginated-table')
export class UUIPaginatedTable extends LitElement {

    @property({ type: Number })
    total = 0;
    @property({ type: Number })
    currentPage = 0;
    @property({ type: Array<TableColumn> })
    columns: Array<TableColumn> = [];
    @property({ type: Array<TableItem> })
    rows: Array<TableItem> = [];
    @property()
    showDeleteButton = false;
    @property()
    showCreateButton = false;
    @property()
    pageSize: number = 10;

    @state()
    private selectionMode = false;
    @state()
    private selection: Array<string> = [];
    @state()
    private _sortingDesc: boolean = true;
    @state()
    private _sortingColumn: string = '';

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        if (changedProperties.has('rows')) {
            this._ensureColumns();
        }

        if (changedProperties.has('selection')) {
            this.dispatchEvent(new CustomEvent('selection-changed', {
                detail: {
                    selection: this.selection
                },
                bubbles: true,
                composed: true
            }));
        }
    }

    render() {
        const buttons = [];

        if (this.showDeleteButton) {
            const button = html`
                <uui-button label="Delete" color="danger" ?disabled="${this.selection.length === 0}" look="primary"
                            @click="${this._deleteHandler}"></uui-button>
            `;
            buttons.push(button);
        }

        if (this.showCreateButton) {
            const button = html`
                <uui-button label="Create" color="positive" look="primary" @click="${this._createHandler}"></uui-button>
            `;
            buttons.push(button);
        }
        const options: Array<Option> = [{ value: '10', name: '10' }, { value: '20', name: '20' }, {
            value: '50',
            name: '50'
        }, { value: '-1', name: 'All' }];

        return html`
            <uui-table class="uui-text">
                <uui-table-column style="width: 60px;"></uui-table-column>
                <uui-table-head>
                    <uui-table-head-cell style="--uui-table-cell-padding: 0">
                        <uui-checkbox
                                style="padding: var(--uui-size-4) var(--uui-size-5);"
                                @change="${this._selectAllHandler}"
                                ?checked="${this.selection.length === this.rows.length}">
                        </uui-checkbox>
                    </uui-table-head-cell>
                    ${this.columns.map(column => this._renderHeaderCellTemplate(column))}
                </uui-table-head>

                ${repeat(this.rows, item => item.key, this._renderRowTemplate)}

            </uui-table>
            <div class="pagination">
                <uui-pagination
                        total=${this.total}
                        current="${this.currentPage}"
                        @change="${(e: UUIPaginationEvent) => this._pageChangeHandler(e.target.current)}">
                </uui-pagination>
            </div>
            <div class="page-size">
                <div>
                    <span>Results per page</span>
                    <select @change="${(e: InputEvent) => this._pageSizeChangeHandler(parseInt((e.target as HTMLSelectElement).value))}">
                        ${options.map(size => html`
                            <option value="${size.value}" ?selected="${size.value === this.pageSize.toString()}">
                                ${size.name}
                            </option>`)}
                    </select>
                </div>
                <div>
                    Selected ${this.selection.length} of ${this.rows.length}
                </div>
            </div>
            <uui-button-group>
                ${buttons}
            </uui-button-group>
        `;
    }

    private _ensureColumns() {
        if (this.columns.length === 0) {
            const item = this.rows[0].item;
            const keys = Object.keys(item);
            this.columns = keys.map((key) => {
                return {
                    name: key,
                    alias: key,
                    render: (value: string) => {
                        return value;
                    }
                };
            });
        }
    }

    private _renderRowCells(item: TableItem): unknown {
        const obj = item.item;
        return this.columns.map((column) => {
            let value = 'Property not found';
            if (obj.hasOwnProperty(column.alias)) {
                value = obj[column.alias as keyof typeof obj];
            }
            return html`
                <uui-table-cell>${column.render(value)}</uui-table-cell>
            `;
        });
    }

    private _selectAllHandler(event: Event) {
        const checkboxElement = event.target as HTMLInputElement;
        if (checkboxElement.checked) {
            this.selection = this.rows.map((item: TableItem) => item.key);
        } else {
            this.selection = [];
        }
        this.selectionMode = this.selection.length > 0;
    }

    private async _selectHandler(event: Event, item: TableItem) {
        const checkboxElement = event.target as HTMLInputElement;
        if (checkboxElement.checked) {
            this._addIfNotExists(item);
        } else {
            this._removeIfExists(item);
        }
        this.selectionMode = this.selection.length > 0;
    }

    private _removeIfExists(item: TableItem) {
        if (this.selection.includes(item.key)) {
            this.selection = this.selection.filter(
                selectionKey => selectionKey !== item.key
            );
        }
    }

    private _addIfNotExists(item: TableItem) {
        if (!this.selection.includes(item.key)) {
            this.selection = [...this.selection, item.key];
        }
    }

    private _selectRowHandler(item: TableItem) {
        this._addIfNotExists(item);
        this.selectionMode = this.selection.length > 0;
    }

    private _deselectRowHandler(item: TableItem) {
        this._removeIfExists(item);
        this.selectionMode = this.selection.length > 0;
    }

    private _isSelected(key: string) {
        return this.selection.includes(key);
    }

    private _renderHeaderCellTemplate(column: TableColumn) {
        return html`
            <uui-table-head-cell style="--uui-table-cell-padding: 0">
                <button
                        style="padding: var(--uui-size-4) var(--uui-size-5);"
                        @click="${() => this._sortingHandler(column)}">
                    ${column.name}
                    <uui-symbol-sort
                            ?active=${this._sortingColumn === column.alias}
                            ?descending=${this._sortingDesc}>
                    </uui-symbol-sort>
                </button>
            </uui-table-head-cell>
        `;
    }

    protected _renderRowTemplate = (item: TableItem) => {
        return html`
            <uui-table-row
                    selectable
                    ?select-only=${this.selectionMode}
                    ?selected=${this._isSelected(item.key)}
                    @selected=${() => this._selectRowHandler(item)}
                    @deselected=${() => this._deselectRowHandler(item)}>
                <uui-table-cell>
                    <uui-checkbox
                            @click=${(e: MouseEvent) => e.stopPropagation()}
                            @change=${(event: Event) => this._selectHandler(event, item)}
                            ?checked="${this._isSelected(item.key)}">
                    </uui-checkbox>
                </uui-table-cell>
                ${this._renderRowCells(item)}
            </uui-table-row>
        `;
    };

    private async _pageChangeHandler(page: number) {
        this.selection = [];
        await this.updateComplete;
        const cus = new CustomEvent('page-change', {
            detail: { page: page },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(cus);
    }

    private async _pageSizeChangeHandler(pageSize: number) {
        this.selection = [];
        this.pageSize = pageSize;
        await this.updateComplete;
        const cus = new CustomEvent('page-size-change', {
            detail: { pageSize: pageSize },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(cus);
    }

    private _deleteHandler() {
        const event = new CustomEvent('delete-selection', {
            detail: { selection: this.selection },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event)
    }

    private async _sortingHandler(column: TableColumn) {
        this._sortingDesc = this._sortingColumn === column.alias ? !this._sortingDesc : false;
        this._sortingColumn = column.alias;
        await this.updateComplete;
        const event = new CustomEvent('sorting-change', {
            detail: { column: this._sortingColumn, desc: this._sortingDesc },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private _createHandler() {
        const event = new CustomEvent('create-selection', {
            detail: { selection: this.selection },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    static styles = [
        UUITextStyles,
        css`
          uui-table-row:focus uui-checkbox,
          uui-table-row:focus-within uui-checkbox,
          uui-table-row:hover uui-checkbox,
          uui-table-row[select-only] uui-checkbox {
            display: inline-block;
          }

          uui-table-head-cell:focus,
          uui-table-head-cell:focus-within,
          uui-table-head-cell:hover {
            --uui-symbol-sort-hover: 1;
          }

          .pagination {
            margin-bottom: var(--uui-size-space-4);
          }

          .page-size {
            margin-bottom: var(--uui-size-space-4);
          }

          uui-table-head-cell button {
            padding: 0;
            background-color: transparent;
            color: inherit;
            border: none;
            cursor: pointer;
            font-weight: inherit;
            font-size: inherit;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'uui-paginated-table': UUIPaginatedTable;
    }
}