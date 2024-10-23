// This file is auto-generated by @hey-api/openapi-ts

export const CreateRequestModelSchema = {
    required: ['childId', 'parentId', 'relationType'],
    type: 'object',
    properties: {
        parentId: {
            type: 'string',
            format: 'uuid'
        },
        childId: {
            type: 'string',
            format: 'uuid'
        },
        relationType: {
            type: 'string',
            format: 'uuid'
        },
        comment: {
            type: 'string',
            nullable: true
        }
    },
    additionalProperties: false
} as const;

export const EventMessageTypeModelSchema = {
    enum: ['Default', 'Info', 'Error', 'Success', 'Warning'],
    type: 'string'
} as const;

export const NotificationHeaderModelSchema = {
    required: ['category', 'message', 'type'],
    type: 'object',
    properties: {
        message: {
            type: 'string'
        },
        category: {
            type: 'string'
        },
        type: {
            '$ref': '#/components/schemas/EventMessageTypeModel'
        }
    },
    additionalProperties: false
} as const;

export const PagedRelationTypeTreeItemResponseModelSchema = {
    required: ['items', 'total'],
    type: 'object',
    properties: {
        total: {
            type: 'integer',
            format: 'int64'
        },
        items: {
            type: 'array',
            items: {
                oneOf: [
                    {
                        '$ref': '#/components/schemas/RelationTypeTreeItemResponseModel'
                    }
                ]
            }
        }
    },
    additionalProperties: false
} as const;

export const PaginationModel_1Schema = {
    required: ['currentPage', 'items', 'itemsPerPage', 'totalItems', 'totalPages'],
    type: 'object',
    properties: {
        items: {
            type: 'array',
            items: {
                oneOf: [
                    {
                        '$ref': '#/components/schemas/RelationModel'
                    }
                ]
            }
        },
        totalItems: {
            type: 'integer',
            format: 'int32'
        },
        totalPages: {
            type: 'integer',
            format: 'int32'
        },
        currentPage: {
            type: 'integer',
            format: 'int32'
        },
        itemsPerPage: {
            type: 'integer',
            format: 'int32'
        }
    },
    additionalProperties: false
} as const;

export const ReferenceByIdModelSchema = {
    required: ['id'],
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid'
        }
    },
    additionalProperties: false
} as const;

export const RelationModelSchema = {
    required: ['childId', 'createDate', 'id', 'parentId', 'relationType'],
    type: 'object',
    properties: {
        parentId: {
            type: 'integer',
            format: 'int32'
        },
        childId: {
            type: 'integer',
            format: 'int32'
        },
        comment: {
            type: 'string',
            nullable: true
        },
        id: {
            type: 'integer',
            format: 'int32'
        },
        createDate: {
            type: 'string',
            format: 'date-time'
        },
        relationType: {
            type: 'integer',
            format: 'int32'
        },
        childName: {
            type: 'string',
            nullable: true
        },
        parentName: {
            type: 'string',
            nullable: true
        },
        childUrl: {
            type: 'string',
            nullable: true
        },
        parentUrl: {
            type: 'string',
            nullable: true
        },
        childEntityType: {
            type: 'string',
            nullable: true
        },
        parentEntityType: {
            type: 'string',
            nullable: true
        }
    },
    additionalProperties: false
} as const;

export const RelationTypeModelSchema = {
    required: ['id', 'relations'],
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            format: 'int32'
        },
        name: {
            type: 'string',
            nullable: true
        },
        alias: {
            type: 'string',
            nullable: true
        },
        parentEntityType: {
            type: 'string',
            nullable: true
        },
        childEntityType: {
            type: 'string',
            nullable: true
        },
        relations: {
            oneOf: [
                {
                    '$ref': '#/components/schemas/PaginationModel`1'
                }
            ]
        }
    },
    additionalProperties: false
} as const;

export const RelationTypeTreeItemResponseModelSchema = {
    required: ['hasChildren', 'id'],
    type: 'object',
    properties: {
        name: {
            type: 'string',
            nullable: true
        },
        id: {
            type: 'string',
            format: 'uuid'
        },
        childObjectType: {
            type: 'string',
            format: 'uuid',
            nullable: true
        },
        parentObjectType: {
            type: 'string',
            format: 'uuid',
            nullable: true
        },
        hasChildren: {
            type: 'boolean'
        },
        parent: {
            oneOf: [
                {
                    '$ref': '#/components/schemas/ReferenceByIdModel'
                }
            ],
            nullable: true
        }
    },
    additionalProperties: false
} as const;