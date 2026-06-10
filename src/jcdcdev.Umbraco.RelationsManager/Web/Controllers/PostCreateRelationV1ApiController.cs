using jcdcdev.Umbraco.RelationsManager.Models;
using jcdcdev.Umbraco.RelationsManager.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace jcdcdev.Umbraco.RelationsManager.Web.Controllers;

[RelationsManagerVersionedRoute("relation")]
public class PostCreateRelationV1ApiController(
    IRelationService relationService,
    IEntityService entityService)
    : RelationsManagerV1ApiControllerBase(relationService)
{
    [HttpPost("")]
    [Produces<CreateRelationResponse>]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] CreateRequestModel requestModel)
    {
        var relationType = RelationService.GetRelationTypeById(requestModel.RelationType);
        if (relationType == null)
        {
            return BadRequest("Relation type not found");
        }

        var parent = entityService.Get(requestModel.ParentId);
        var child = entityService.Get(requestModel.ChildId);
        if (parent == null || child == null)
        {
            return BadRequest("Parent or child not found");
        }

        var result = RelationService.GetByParentAndChildId(parent.Id, child.Id, relationType);
        if (result != null)
        {
            return BadRequest("Relation already exists");
        }

        var relation = new Relation(parent.Id, child.Id, relationType)
        {
            Comment = requestModel.Comment
        };

        RelationService.Save(relation);

        return Ok(new CreateRelationResponse(relation.Id));
    }
}