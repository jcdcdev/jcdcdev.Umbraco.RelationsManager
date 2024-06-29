using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.Filters;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[RelationsManagerVersionedRoute("")]
[MapToApi(Constants.Api.ApiName)]
[JsonOptionsName(global::Umbraco.Cms.Core.Constants.JsonOptionsNames.BackOffice)]
[ApiController]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[AppendEventMessages]
[Produces("application/json")]
public class RelationsManagerApiControllerBase(IRelationService relationService) : ControllerBase
{
    protected readonly IRelationService RelationService = relationService;

    protected PagedViewModel<TItem> PagedViewModel<TItem>(IEnumerable<TItem> items, long totalItems)
        => new() { Items = items, Total = totalItems };
}

public class RelationsManagerVersionedRouteAttribute(string template) : BackOfficeRouteAttribute($"relationsmanager/api/v{{version:apiVersion}}/{template.TrimStart('/')}");