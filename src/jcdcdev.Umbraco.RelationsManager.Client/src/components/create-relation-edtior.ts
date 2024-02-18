import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LegacyServices } from '../legacyServices';
import { RelationTypeModel, RelationsManagerService } from '../relationsManagerService';
import { UUITextStyles } from '@umbraco-ui/uui';

@customElement('create-relation-edtior')
export class CreateRelationEditor extends LitElement {

    @state()
    loading = false;

    @state()
    errorMessage = '';

    @state()
    successMessage = '';

    @state()
    parent: null | object = null;

    @state()
    child: null | object = null;

    @property({ type: Number })
    relationTypeId = -1;

    @state()
    parentEntityType: string = '';

    @state()
    childEntityType: string = '';

    @state()
    relationType: RelationTypeModel | null = null;

    @state()
    comment = '';

    private editorService = LegacyServices.EditorService();

    @state()
    private showParentEntityTypeSelector: boolean = false;
    @state()
    private showChildEntityTypeSelector: boolean = false;

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('relationTypeId')) {
            RelationsManagerService.getRelationsByResourceId(this.relationTypeId).then((relationType) => {
                this.relationType = relationType;
                this.parentEntityType = relationType.parentEntityType;
                this.childEntityType = relationType.childEntityType;
            });
        }
    }

    private _openParentPicker() {
        const relationType = this.relationType;
        if (!relationType) {
            return;
        }

        const entityType = this.parentEntityType;
        if (entityType === '') {
            this.showParentEntityTypeSelector = true;
            return;
        }

        this._openContentPicker(entityType, (model: any) => {
            this.parent = model.selection[0];
        }, () => {
            this.parentEntityType = relationType.parentEntityType
        });
    }

    private _openChildPicker() {
        const relationType = this.relationType;
        if (!relationType) {
            return;
        }

        const entityType = this.childEntityType;
        if (entityType === '') {
            this.showChildEntityTypeSelector = true;
            return;
        }
        this._openContentPicker(entityType, (model: any) => {
            this.child = model.selection[0];
        }, () => {
            this.childEntityType = relationType.childEntityType
        });
    }

    private _openContentPicker(entityType: string, submit: Function, close: Function | null = null) {
        switch (entityType) {
            case "document":
                this.editorService.contentPicker({
                    submit: (model: any) => {
                        submit(model);
                        this.editorService.close();
                    },
                    close: () => {
                        this.editorService.close();
                        if (close) {
                            close();
                        }
                    },
                });
                break;
            case "media":
                this.editorService.mediaPicker({
                    submit: (model: any) => {
                        submit(model);
                        this.editorService.close();
                    },
                    close: () => {
                        this.editorService.close();
                        if (close) {
                            close();
                        }
                    },
                });
                break;
            case "member":
                this.editorService.memberPicker({
                    submit: (model: any) => {
                        submit(model);
                        this.editorService.close();
                    },
                    close: () => {
                        this.editorService.close();
                        if (close) {
                            close();
                        }
                    },
                });
                break;
            default:
        }
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
        // @ts-ignore
        const response = await RelationsManagerService.createRelation(this.relationTypeId, this.parent.id, this.child.id, this.comment);
        if (!response.success) {
            this.errorMessage = response.message;
        } else {
            this.successMessage = 'Relation created';
            this.parent = null;
            this.child = null;
            this.comment = '';
        }
        this.loading = false;
    }

    private _renderContentBox(content: any, open: Function): TemplateResult {
        let inner = null;
        let name = '';
        let description = 'Please select a content item';
        if (content) {
            name = content.name;
            description = `${content.metaData.ContentTypeAlias} - ${content.id}`;
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
        const content = this.parent as any;
        return html`
            ${this._renderContentBox(content, this._openParentPicker)}
            ${this._renderContentInput(content?.id.toString(), "parent")}
        `;
    }

    private _renderContentInput(value: string, name: string): TemplateResult {
        return html`
            <div style="display: none; visibility: hidden; margin-top:10px;">
                <uui-input required="" type="hidden" name="${name}" id="${name}" value="${value}"
                           required-message="You must make a selection"></uui-input>
            </div>
        `;
    }

    private _renderChild(): TemplateResult {
        const content = this.child as any;
        return html`
            ${this._renderContentBox(content, this._openChildPicker)}
            ${this._renderContentInput(content?.id.toString(), "child")}
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
        'create-relation-edtior': CreateRelationEditor;
    }
}