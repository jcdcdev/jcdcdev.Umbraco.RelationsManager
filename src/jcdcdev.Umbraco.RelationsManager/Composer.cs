using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Infrastructure.Manifest;

namespace jcdcdev.Umbraco.RelationsManager;

public class Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<IPackageManifestReader, PackageManifestReader>();
        builder.Services.ConfigureOptions<ConfigApiSwaggerGenOptions>();
    }
}