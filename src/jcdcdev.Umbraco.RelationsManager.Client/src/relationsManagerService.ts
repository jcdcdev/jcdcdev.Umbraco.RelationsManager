import {Type, plainToInstance} from 'class-transformer';

// @ts-ignore
const umPath = window.Umbraco.Sys.ServerVariables.umbracoSettings.umbracoPath;
const baseUrl = `${umPath}/backoffice/RelationsManager/RelationsManagerApi`;

export class RelationsManagerService {
    static async getRelationsByResourceId(id: number, page = 1, take = 10, sortColumn = '', sortDesc = false): Promise<RelationTypeModel> {
        try {
            const response = await fetch(`${baseUrl}/getrelationtype?id=${id}&page=${page}&take=${take}&sort=${sortColumn}&desc=${sortDesc}`);
            const json = await response.json();
            return plainToInstance(RelationTypeModel, json);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        }
    }

    static async createRelation(relationTypeId: number, parentId: number, childId: number, comment: string): Promise<CreateRelationResponse> {
        try {
            const response = await fetch(`${baseUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({relationTypeId, parentId, childId, comment})
            });

            const message = await response.text();
            return new CreateRelationResponse(response.ok, message);

        } catch (error) {
            const message = 'There has been a problem with your fetch operation:';
            console.error(message, error);
            return new CreateRelationResponse(false, message);

        }
    }

    static async deleteRelations(relationTypeId: number, ids: number[]) {
        try {
            const response = await fetch(`${baseUrl}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    relationTypeId: relationTypeId,
                    ids: ids
                })
            });
            return response.ok;
        } catch (error) {
            const message = 'There has been a problem with your fetch operation:';
            console.error(message, error);
            return false
        }
    }
}

export class CreateRelationResponse {
    constructor(success: boolean, message: string) {
        this.message = message;
        this.success = success;
    }

    success: boolean;
    message: string;
}

export class RelationTypeModel {
    childEntityType: string;
    parentEntityType: string;

    constructor() {
        this.id = -1;
        this.name = '';
        this.alias = '';
        this.parentEntityType = '';
        this.childEntityType = '';
        this.relations = new PaginationModel();
    }

    id: number
    name: string
    alias: string
    @Type(() => PaginationModel)
    relations: PaginationModel
}

export class PaginationModel {

    constructor(items: RelationModel[] = [], totalItems: number = 0, totalPages: number = 0, currentPage: number = 0, itemsPerPage: number = 0) {
        this.items = items;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
    }

    items: RelationModel[] = [];
    totalItems: number = 0;
    totalPages: number = 0;
    currentPage: number = 0;
    itemsPerPage: number = 0;

}

export class RelationModel {
    parentId: number = -1;
    childId: number = -1;
    createDate: string = '';
    comment: string = '';
    id: number = -1;
    parentName: string = '';
    childName: string = '';
    childUrl: string = '';
    parentUrl: string = '';
    parentEntityType: string = '';
    childEntityType: string = '';
}