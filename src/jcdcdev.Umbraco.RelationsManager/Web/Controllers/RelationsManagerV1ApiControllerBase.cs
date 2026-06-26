using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace jcdcdev.Umbraco.RelationsManager.Web.Controllers;

[RelationsManagerVersionedRoute("")]
[MapToApi(Constants.Api.ApiName)]
[JsonOptionsName(global::Umbraco.Cms.Core.Constants.JsonOptionsNames.BackOffice)]
[ApiController]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[ApiExplorerSettings(GroupName = Constants.Api.GroupName)]
[ApiVersion("1.0")]
[Produces("application/json")]
public abstract class RelationsManagerV1ApiControllerBase(IRelationService relationService) : ControllerBase
{
    protected readonly IRelationService RelationService = relationService;

    protected PagedViewModel<TItem> PagedViewModel<TItem>(IEnumerable<TItem> items, long totalItems)
        => new() { Items = items, Total = totalItems };
}