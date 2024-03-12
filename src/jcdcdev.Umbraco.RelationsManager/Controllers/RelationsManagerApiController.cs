using jcdcdev.Umbraco.RelationsManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Entities;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.BackOffice.Filters;
using Umbraco.Cms.Web.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Web.Common.Filters;
using Umbraco.Extensions;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[PluginController(RelationsManagerTreeController.Area)]
[JsonExceptionFilter]
[IsBackOffice]
[UmbracoUserTimeoutFilter]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[DisableBrowserCache]
[UmbracoRequireHttps]
// [CheckIfUserTicketDataIsStale]
[MiddlewareFilter(typeof(UnhandledExceptionLoggerFilter))]
public class RelationsManagerApiController : UmbracoApiController
{
    private readonly IRelationService _relationService;

    public RelationsManagerApiController(IRelationService relationService)
    {
        _relationService = relationService;
    }

    [HttpDelete]
    public IActionResult Delete([FromBody] DeleteModel model)
    {
        var relations = _relationService.GetByRelationTypeId(model.RelationTypeId);
        relations = relations?.Where(x => model.Ids.Contains(x.Id)).ToList();
        if (relations == null)
        {
            return NotFound();
        }

        foreach (var relation in relations)
        {
            _relationService.Delete(relation);
        }

        return Ok();
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateModel model)
    {
        var relationType = _relationService.GetRelationTypeById(model.RelationTypeId);
        if (relationType == null)
        {
            return NotFound();
        }

        var relation = _relationService.GetByParentAndChildId(model.ParentId, model.ChildId, relationType);
        if (relation != null)
        {
            return BadRequest("Relation already exists");
        }

        relation = new Relation(model.ParentId, model.ChildId, relationType)
        {
            Comment = model.Comment
        };

        _relationService.Save(relation);

        return Ok(relation.Id);
    }

    [HttpGet]
    public IActionResult GetRelationType(int id, int page = 1, int take = 10, string sort = "", bool desc = true)
    {
        var relationType = _relationService.GetRelationTypeById(id);
        if (relationType == null)
        {
            return NotFound();
        }

        if (take == -1)
        {
            take = int.MaxValue;
        }

        var relations = _relationService.GetByRelationTypeId(relationType.Id)?.ToList() ?? new List<IRelation>();
        var total = relations.Count;
        var totalPages = total / take + (total % take > 0 ? 1 : 0);

        var items = new List<RelationModel>();
        foreach (var x in relations)
        {
            var (parent, child) = _relationService.GetEntitiesFromRelation(x);
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

    private string GetEntityType(IUmbracoEntity entity)
    {
        return entity switch
        {
            IMemberEntitySlim member => "member",
            IMediaEntitySlim media => "media",
            IContentEntitySlim content => "document",
            _ => ""
        };
    }

    private string GetUrl(IUmbracoEntity entity)
    {
        switch (entity)
        {
            case IMediaEntitySlim media:
                return $"/umbraco#/media/media/edit/{entity.Id}";
            case IContentEntitySlim content:
                return $"/umbraco#/content/content/edit/{entity.Id}";
        }

        return $"/umbraco#/member/member/edit/{entity.Id}";
    }
}

public class DeleteModel
{
    public int[] Ids { get; set; }
    public int RelationTypeId { get; set; }
}

public class CreateModel
{
    public int ParentId { get; set; }
    public int ChildId { get; set; }
    public int RelationTypeId { get; set; }
    public string Comment { get; set; }
}