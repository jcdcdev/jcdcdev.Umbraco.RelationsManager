using Umbraco.Cms.Web.Common.Routing;

namespace jcdcdev.Umbraco.RelationsManager.Web;

public class RelationsManagerVersionedRouteAttribute(string template) : BackOfficeRouteAttribute($"relationsmanager/api/v{{version:apiVersion}}/{template.TrimStart('/')}");