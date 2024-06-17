namespace jcdcdev.Umbraco.RelationsManager.Models;

public class CreateRequestModel
{
    public Guid ParentId { get; set; }
    public Guid ChildId { get; set; }
    public Guid RelationType { get; set; }
    public string? Comment { get; set; }
}