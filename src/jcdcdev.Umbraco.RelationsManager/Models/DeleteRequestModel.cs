namespace jcdcdev.Umbraco.RelationsManager.Models;

public class DeleteRequestModel
{
    public int[] Ids { get; set; } = [];
    public int RelationTypeId { get; set; }
}