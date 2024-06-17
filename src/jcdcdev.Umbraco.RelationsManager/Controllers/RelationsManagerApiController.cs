using jcdcdev.Umbraco.RelationsManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[ApiExplorerSettings(GroupName = "Relation")]
public class RelationsManagerApiController(IRelationService relationService, ILogger<RelationsManagerApiController> logger) : RelationsManagerApiControllerBase(relationService)
{
    [HttpGet("relation/{id:guid}", Name = "GetRelation")]
    [Produces<RelationTypeModel>]
    public IActionResult Get(Guid id, int page = 1, int take = 10, string sort = "", bool desc = true)
    {
        var relationType = RelationService.GetRelationTypeById(id);
        if (relationType == null)
        {
            return NoContent();
        }

        if (take == -1)
        {
            take = int.MaxValue;
        }

        var relations = RelationService.GetByRelationTypeId(relationType.Id)?.ToList() ?? [];
        var total = relations.Count;
        var totalPages = total / take + (total % take > 0 ? 1 : 0);

        var items = new List<RelationModel>();
        foreach (var x in relations)
        {
            var result = RelationService.GetEntitiesFromRelation(x);

            var parent = result?.Item1;
            var child = result?.Item2;

            if (parent == null || child == null)
            {
                logger.LogWarning("Relation {RelationId} has missing parent or child", x.Id);
                continue;
            }

            var item = new RelationModel
            {
                ParentId = x.ParentId,
                ChildId = x.ChildId,
                Id = x.Id,
                Comment = x.Comment,
                CreateDate = x.CreateDate,
                RelationType = x.RelationType.Id,
                ChildName = child.Name,
                ParentName = parent.Name,
                ChildUrl = GetUrl(child),
                ParentUrl = GetUrl(parent),
                ChildEntityType = GetEntityType(child),
                ParentEntityType = GetEntityType(parent)
            };
            items.Add(item);
        }

        if (!sort.IsNullOrWhiteSpace())
        {
            items = sort switch
            {
                "parentName" => desc
                    ? items.OrderByDescending(x => x.ParentName).ToList()
                    : items.OrderBy(x => x.ParentName).ToList(),
                "childName" => desc
                    ? items.OrderByDescending(x => x.ChildName).ToList()
                    : items.OrderBy(x => x.ChildName).ToList(),
                "createDate" => desc
                    ? items.OrderByDescending(x => x.CreateDate).ToList()
                    : items.OrderBy(x => x.CreateDate).ToList(),
                "comment" => desc
                    ? items.OrderBy(x => x.Comment.IsNullOrWhiteSpace()).ThenByDescending(x => x.Comment).ToList()
                    : items.OrderBy(x => x.Comment.IsNullOrWhiteSpace()).ThenBy(x => x.Comment).ToList(),
                _ => items
            };
        }

        items = items.Skip((page - 1) * take).Take(take).ToList();

        var paged = new PaginationModel<RelationModel>
        {
            TotalItems = total,
            TotalPages = totalPages,
            CurrentPage = page,
            ItemsPerPage = take,
            Items = items
        };

        var model = new RelationTypeModel
        {
            Id = relationType.Id,
            Name = relationType.Name,
            Alias = relationType.Alias,
            ParentEntityType = GetEntityType(relationType.ParentObjectType),
            ChildEntityType = GetEntityType(relationType.ChildObjectType),
            Relations = paged
        };

        return Ok(model);
    }

    private string GetEntityType(Guid? relationTypeParentObjectType)
    {
        return relationTypeParentObjectType?.ToString().ToUpperInvariant() switch
        {
            global::Umbraco.Cms.Core.Constants.ObjectTypes.Strings.Document => "document",
            global::Umbraco.Cms.Core.Constants.ObjectTypes.Strings.Media => "media",
            global::Umbraco.Cms.Core.Constants.ObjectTypes.Strings.Member => "member",
            _ => ""
        };
    }

    private string GetEntityType(IUmbracoEntity entity) => entity switch
    {
        IMemberEntitySlim => "member",
        IMediaEntitySlim => "media",
        IContentEntitySlim => "document",
        _ => ""
    };

    private static string GetUrl(IEntity entity) => entity switch
    {
        IMediaEntitySlim => $"/umbraco#/media/media/edit/{entity.Id}",
        IContentEntitySlim => $"/umbraco#/content/content/edit/{entity.Id}",
        _ => $"/umbraco#/member/member/edit/{entity.Id}"
    };
}