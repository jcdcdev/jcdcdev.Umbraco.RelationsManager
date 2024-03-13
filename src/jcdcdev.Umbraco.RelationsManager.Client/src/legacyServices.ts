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
			id: id.toString(),
			submit: (model: any) => {
				open(model);
				editorService.close();
			},
			close: () => {
				close();
				editorService.close();
			}
		}
		
		switch (editorType) {
			case 'media':
				editorService.mediaEditor(editor);
				break;
			case 'document':
				editorService.contentEditor(editor);
				break;
			case 'member':
				editorService.memberEditor(editor);
				break;
			default:
				break;
		}
	}
}