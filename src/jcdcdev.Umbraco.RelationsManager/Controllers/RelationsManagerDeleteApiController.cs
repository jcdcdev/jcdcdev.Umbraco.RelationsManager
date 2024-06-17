using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[ApiExplorerSettings(GroupName = "Relation")]
[ApiVersion("1.0")]
public class RelationsManagerDeleteApiController(IRelationService relationService) : RelationsManagerApiControllerBase(relationService)
{
    [HttpDelete("relation/{id:int}", Name = "DeleteRelation")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult Delete(int id)
    {
        var relation = RelationService.GetById(id);
        if (relation == null)
        {
            return NoContent();
        }

        RelationService.Delete(relation);
        return Ok();
    }
}