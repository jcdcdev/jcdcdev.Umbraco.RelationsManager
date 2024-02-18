using Umbraco.Community.SimpleDashboards.Core;

namespace jcdcdev.Umbraco.RelationsManager.Dashboards;

public class RelationsManagerWelcomeDashboard : SimpleDashboard
{
    public RelationsManagerWelcomeDashboard()
    {
        AddSection(Constants.Section.Alias);
    }
}