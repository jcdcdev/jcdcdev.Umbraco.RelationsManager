using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Web.Controllers;

[RelationsManagerVersionedRoute("relation")]
public class DeleteRelationByIdV1ApiController(IRelationService relationService) : RelationsManagerV1ApiControllerBase(relationService)
{
    [HttpDelete("{id:int}", Name = "DeleteRelation")]
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