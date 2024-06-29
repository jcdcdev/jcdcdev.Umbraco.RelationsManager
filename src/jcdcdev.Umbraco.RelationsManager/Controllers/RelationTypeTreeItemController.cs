using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[ApiVersion("1.0")]
[RelationsManagerVersionedRoute("tree")]
public class RelationTypeTreeItemController(IRelationService relationService) : RelationsManagerApiControllerBase(relationService)
{
    [HttpGet("item/null")]
    [ApiExplorerSettings(GroupName = "Relation Type")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(PagedViewModel<RelationTypeTreeItemResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedViewModel<RelationTypeTreeItemResponseModel>>> GetChildren(int skip = 0, int take = 999)
    {
        var relationTypes = RelationService.GetAllRelationTypes().Skip(skip).Take(take).ToList();
        var data = relationTypes.Select(x => new RelationTypeTreeItemResponseModel
        {
            Name = x.Name,
            Id = x.Key,
            ChildObjectType = x.ChildObjectType,
            ParentObjectType = x.ParentObjectType,
            HasChildren = RelationService.GetByRelationTypeId(x.Id)?.Any() ?? false
        });
        return Ok(PagedViewModel(data, relationTypes.Count));
    }
}