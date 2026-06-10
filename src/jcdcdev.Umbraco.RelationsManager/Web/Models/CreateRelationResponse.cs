namespace jcdcdev.Umbraco.RelationsManager.Web.Models;

public record CreateRelationResponse(int Id)
{
    public override string ToString()
    {
        return $"{{ Id = {Id} }}";
    }
}