namespace jcdcdev.Umbraco.RelationsManager.Models;

public class RelationModel
{
    public int ParentId { get; set; }
    public int ChildId { get; set; }
    public string? Comment { get; set; }
    public int Id { get; set; }

    public DateTime CreateDate { get; set; }
    public int RelationType { get; set; }
    public string? ChildName { get; set; }
    public string? ParentName { get; set; }
    public string? ChildUrl { get; set; }
    public string? ParentUrl { get; set; }
    public string? ChildEntityType { get; set; }
    public string? ParentEntityType { get; set; }
}