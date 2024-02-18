namespace jcdcdev.Umbraco.RelationsManager.Models;

public class RelationTypeModel
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string Alias { get; set; }
    public string ParentEntityType { get; set; }
    public string ChildEntityType { get; set; }
    public PaginationModel<RelationModel> Relations { get; set; }
}