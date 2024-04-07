import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { RelationTypeModel, RelationsManagerService } from '../relationsManagerService';

@customElement('relations-manager')
export class RelationsManager extends LitElement {

    @property({ type: Number })
    relationTypeId = -1;

    @state()
    showRelationsManager = true;

    @state()
    showCreateEditor = false;

    @state()
    relationType: RelationTypeModel | null = null;

    constructor() {
        super();
        const rid = parseInt(location.href.split("/").slice(-1)[0]);
        this.relationTypeId = rid;
        this.getRelationType();
    }

    async getRelationType() {
        const relationType = await RelationsManagerService.getRelationsByResourceId(this.relationTypeId);
        this.relationType = relationType;
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

      .umb-dashboard {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        height: 100%;
        position: absolute;
        top: 0;
        width: 100%;
      }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        'relations-manager': RelationsManager;
    }
}