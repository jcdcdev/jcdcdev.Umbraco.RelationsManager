using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models.Trees;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Trees;
using Umbraco.Cms.Web.BackOffice.Trees;
using Umbraco.Cms.Web.Common.Attributes;
using Umbraco.Extensions;
using UmbracoConstants = Umbraco.Cms.Core.Constants;

namespace jcdcdev.Umbraco.RelationsManager.Controllers;

[Tree(Section, Alias, TreeTitle = "Relations", TreeGroup = "relationsManagerGroup", SortOrder = 5)]
[PluginController(Area)]
public class RelationsManagerTreeController : TreeController
{
    public const string Area = "relationsManager";
    private const string Alias = "relationsManager";
    private const string Section = Constants.Section.Alias;
    private readonly IMenuItemCollectionFactory _menuItemCollectionFactory;
    private readonly IRelationService _relationService;

    public RelationsManagerTreeController(
        ILocalizedTextService localizedTextService,
        UmbracoApiControllerTypeCollection umbracoApiControllerTypeCollection,
        IEventAggregator eventAggregator,
        IRelationService relationService,
        IMenuItemCollectionFactory menuItemCollectionFactory) : base(
        localizedTextService, umbracoApiControllerTypeCollection,
        eventAggregator)
    {
        _relationService = relationService;
        _menuItemCollectionFactory = menuItemCollectionFactory;
    }

    protected override ActionResult<TreeNode?> CreateRootNode(FormCollection queryStrings)
    {
        var root = base.CreateRootNode(queryStrings).Value!;
        root.MenuUrl = null;
        return root;
    }

    protected override ActionResult<TreeNodeCollection> GetTreeNodes(string id, FormCollection queryStrings)
    {
        var relationTypes = _relationService.GetAllRelationTypes();
        var nodes = new TreeNodeCollection();
        foreach (var relationType in relationTypes)
        {
            var node = CreateTreeNode(relationType.Id.ToString(), "-1", queryStrings, relationType.Name,
                UmbracoConstants.Icons.RelationType, false);
            nodes.Add(node);
        }

        return nodes;
    }

    protected override ActionResult<MenuItemCollection> GetMenuForNode(string id, FormCollection queryStrings)
    {
        var menu = _menuItemCollectionFactory.Create();
        if (id == UmbracoConstants.System.Root.ToInvariantString())
        {
            return menu;
        }

        var relationType = _relationService.GetRelationTypeById(int.Parse(id));
        if (relationType == null)
        {
            return menu;
        }

        var item = new MenuItem("editRelationType", "Edit relation type")
        {
            Icon = "settings",
            SeparatorBefore = true
        };

        item.NavigateToRoute($"/{UmbracoConstants.Applications.Settings}/{UmbracoConstants.Trees.RelationTypes}/edit/{relationType.Id}");

        menu.Items.Add(item);
        return menu;
    }
}