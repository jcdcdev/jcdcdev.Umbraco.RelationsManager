using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.ViewModels;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[ApiVersion("1.0")]
[RelationsManagerVersionedRoute("tree")]
public class RelationTypeTreeController(IRelationService relationService) : RelationsManagerApiControllerBase(relationService)
{
    [HttpGet("root")]
    [ApiExplorerSettings(GroupName = "Relation Type")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType(typeof(PagedViewModel<RelationTypeTreeItemResponseModel>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedViewModel<RelationTypeTreeItemResponseModel>>> GetRoot(int skip = 0, int take = 100)
    {
        var items = GetTreeItems();
        var result = PagedViewModel(items, items.Count());

        return base.Ok(result);
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

public class RelationTypeTreeItemResponseModel
{
    public string? Name { get; set; }
    public Guid Id { get; set; }
    public Guid? ChildObjectType { get; set; }
    public Guid? ParentObjectType { get; set; }
    public bool HasChildren { get; set; }
    public ReferenceByIdModel? Parent { get; set; }
}