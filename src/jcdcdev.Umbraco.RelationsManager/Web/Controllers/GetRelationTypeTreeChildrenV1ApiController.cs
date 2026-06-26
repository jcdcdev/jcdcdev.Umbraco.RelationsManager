using jcdcdev.Umbraco.RelationsManager.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Web.Controllers;

[RelationsManagerVersionedRoute("tree")]
public class GetRelationTypeTreeChildrenV1ApiController(IRelationService relationService) : RelationsManagerV1ApiControllerBase(relationService)
{
    [HttpGet("item/null")]
    [ProducesResponseType(typeof(PagedViewModel<RelationTypeTreeItemResponseModel>), StatusCodes.Status200OK)]
    public ActionResult<PagedViewModel<RelationTypeTreeItemResponseModel>> GetChildren(int skip = 0, int take = 999)
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