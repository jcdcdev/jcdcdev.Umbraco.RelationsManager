using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Community.SimpleDashboards.Web;

namespace jcdcdev.Umbraco.RelationsManager;

public class Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.ManifestFilters().Append<ManifestFilter>();
    }
}