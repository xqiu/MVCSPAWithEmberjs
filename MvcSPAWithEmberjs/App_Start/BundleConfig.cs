using System.Web;
using System.Web.Optimization;

namespace MvcSPAWithEmberjs
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new Bundle("~/bundles/jquery", new JsMinify()).Include(
                "~/Scripts/jquery-{version}.js"
            ));

            bundles.Add(new Bundle("~/bundles/jqueryval", new JsMinify()).Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"
            ));

            bundles.Add(new Bundle("~/bundles/templates", new EmberHandlebarsBundleTransform()).Include(
                "~/scripts/app/templates/*.hbs"
            ));

            bundles.Add(new Bundle("~/bundles/ember", new JsMinify()).Include(
                "~/scripts/handlebars.js",
                "~/scripts/ember-1.0.0-rc.2.js",
                "~/scripts/ember-data.js",
                "~/scripts/app/webapi_serializer.js",
                "~/scripts/app/webapi_adapter.js"
            ));

<<<<<<< HEAD
            bundles.Add(new ScriptBundle("~/bundles/ember").Include(
                "~/Scripts/handlebars.js",
                "~/Scripts/ember-1.0.0-rc.1.js",
                "~/Scripts/ember-data.js",
                "~/Scripts/app/webapi_serializer.js",
                "~/Scripts/app/webapi_adapter.js"));

            bundles.Add(new ScriptBundle("~/bundles/ajaxlogin").Include(
                "~/Scripts/app/ajaxlogin.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
=======
            bundles.Add(new Bundle("~/bundles/ajaxlogin", new JsMinify()).Include(
                "~/Scripts/app/ajaxlogin.js"
            ));

            bundles.Add(new Bundle("~/bundles/app", new JsMinify()).Include(
>>>>>>> pre-compile Handlebars Templates
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
            bundles.Add(new Bundle("~/bundles/modernizr", new JsMinify()).Include(
                "~/Scripts/modernizr-*"
            ));

            bundles.Add(new Bundle("~/Content/css", new CssMinify()).Include(
                "~/Content/Site.css",
                "~/Content/TodoList.css"
            ));

            bundles.Add(new Bundle("~/Content/themes/base/css", new CssMinify()).Include(
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