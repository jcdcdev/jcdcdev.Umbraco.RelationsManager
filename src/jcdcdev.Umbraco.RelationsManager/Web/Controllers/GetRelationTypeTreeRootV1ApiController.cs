using jcdcdev.Umbraco.RelationsManager.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Web.Controllers;

[RelationsManagerVersionedRoute("tree")]
public class GetRelationTypeTreeRootV1ApiController(IRelationService relationService) : RelationsManagerV1ApiControllerBase(relationService)
{
    [HttpGet("root")]
    [ProducesResponseType(typeof(PagedViewModel<RelationTypeTreeItemResponseModel>), StatusCodes.Status200OK)]
    public Task<ActionResult<PagedViewModel<RelationTypeTreeItemResponseModel>>> GetRoot(int skip = 0, int take = 100)
    {
        var items = GetTreeItems()
            .Skip(skip)
            .Take(take)
            .ToList();

        var result = PagedViewModel(items, items.Count);

        return Task.FromResult<ActionResult<PagedViewModel<RelationTypeTreeItemResponseModel>>>(base.Ok(result));
    }

    private IEnumerable<RelationTypeTreeItemResponseModel> GetTreeItems()
    {
        var types = RelationService.GetAllRelationTypes();
        foreach (var type in types)
        {
            yield return new RelationTypeTreeItemResponseModel
            {
                Name = type.Name,
                Id = type.Key,
                ChildObjectType = type.ChildObjectType,
                ParentObjectType = type.ParentObjectType,
                HasChildren = false
            };
        }
    }
}