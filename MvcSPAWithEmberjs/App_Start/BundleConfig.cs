using System.Web;
using System.Web.Optimization;

namespace MvcSPAWithEmberjs
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"
            ));

            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                // Compiled handle bars only works when Optimizations is enabled. 
                // Fall back to the server caching version when debug is enabled, check Views/Home/App.cshtml
                bundles.Add(new Bundle("~/bundles/templates", new EmberHandlebarsBundleTransform()).Include(
                    "~/scripts/app/templates/*.hbs"
                ));
            }
            bundles.Add(new ScriptBundle("~/bundles/ember").Include(
                "~/scripts/handlebars.js",
                "~/scripts/ember-1.0.0-rc.2.js",
                "~/scripts/ember-data.js",
                "~/scripts/app/webapi_serializer.js",
                "~/scripts/app/webapi_adapter.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/ajaxlogin").Include(
                "~/Scripts/app/ajaxlogin.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/app.js",
                "~/Scripts/app/router.js",
                "~/Scripts/app/helpers.js"
                ).IncludeDirectory("~/Scripts/app/routes", "*.js")
                 .IncludeDirectory("~/Scripts/app/models", "*.js")
                 .IncludeDirectory("~/Scripts/app/views", "*.js")
                 .IncludeDirectory("~/Scripts/app/controllers", "*.js")
            );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"
            ));

            bundles.Add(new Bundle("~/Content/css", new CssMinify()).Include(
                "~/Content/Site.css",
                "~/Content/TodoList.css"
            ));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                "~/Content/themes/base/jquery.ui.core.css",
                "~/Content/themes/base/jquery.ui.resizable.css",
                "~/Content/themes/base/jquery.ui.selectable.css",
                "~/Content/themes/base/jquery.ui.accordion.css",
                "~/Content/themes/base/jquery.ui.autocomplete.css",
                "~/Content/themes/base/jquery.ui.button.css",
                "~/Content/themes/base/jquery.ui.dialog.css",
                "~/Content/themes/base/jquery.ui.slider.css",
                "~/Content/themes/base/jquery.ui.tabs.css",
                "~/Content/themes/base/jquery.ui.datepicker.css",
                "~/Content/themes/base/jquery.ui.progressbar.css",
                "~/Content/themes/base/jquery.ui.theme.css"
            ));
        }
    }
}