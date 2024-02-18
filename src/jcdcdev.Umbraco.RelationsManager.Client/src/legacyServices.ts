export class LegacyServices {
    // @ts-ignore
    private static elem = window.angular.element(document.querySelector('[ng-controller]'));
    // @ts-ignore
    private static $scope = this.elem.scope();
    // @ts-ignore
    private static injector = this.elem.injector();

    static EditorService = () => this.injector.get('editorService');
    static OpenContentEditor = ({id, editorType, open, close}: {
        id: number,
        editorType: string,
        open: Function,
        close: Function
    }) => {
        const editorService = this.EditorService();
        const editor = {
            id: id,
            submit: (model: any) => {
                open(model);
                editorService.close();
            },
            close: () => {
                close();
                editorService.close();
            },
            view: ''
        }

        switch (editorType) {
            case 'media':
                editor.view = "views/media/edit.html";
                break;
            case 'document':
                editor.view = "views/content/edit.html";
                break;
            case 'member':
                editor.view = "views/member/edit.html";
                break;
            default:
                break;
        }

        editorService.open(editor);
    }
}