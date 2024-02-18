using Umbraco.Cms.Core.Manifest;

namespace jcdcdev.Umbraco.RelationsManager;

internal class ManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        manifests.Add(new PackageManifest
        {
            PackageName = "jcdcdev.Umbraco.RelationsManager",
            Version = GetType().Assembly.GetName().Version?.ToString(3) ?? "0.1.0",
            AllowPackageTelemetry = true,
            Sections = new []
            {
                new ManifestSection
                {
                    Alias = Constants.Section.Alias,
                    Name = Constants.Section.Name
                }
            }
        });
    }
}