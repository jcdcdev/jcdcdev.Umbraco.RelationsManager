using Umbraco.Cms.Api.Management.ViewModels;

namespace jcdcdev.Umbraco.RelationsManager.Web.Models;

public class RelationTypeTreeItemResponseModel
{
    public string? Name { get; set; }
    public Guid Id { get; set; }
    public Guid? ChildObjectType { get; set; }
    public Guid? ParentObjectType { get; set; }
    public bool HasChildren { get; set; }
    public ReferenceByIdModel? Parent { get; set; }
}