using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;

namespace MvcHtmlHelpers
{
    public static class HtmlHelperExtensions
    {
        private static string templateFolder = HttpContext.Current.Server.MapPath("templates");

        public static MvcHtmlString RenderEmber(this HtmlHelper helper, string path)
        {
            if (HttpRuntime.Cache[path] == null)
            {
                string absolutePath;
                string templateName = "";
                if (string.IsNullOrEmpty(path))
                {
                    absolutePath = templateFolder;
                }
                else
                {
                    templateName = path.Replace("\\", "-");
                    absolutePath = Path.Combine(templateFolder, path);
                }

                if (File.Exists(absolutePath))
                {
                    int fileExtensionPosition = templateName.LastIndexOf('.');
                    if (fileExtensionPosition > 0)
                    {
                        templateName = templateName.Substring(0, fileExtensionPosition);
                    }
                    MvcHtmlString result = new MvcHtmlString(WrapWithHandlebarScript(templateName, absolutePath));
                    HttpRuntime.Cache.Insert(path, result, new CacheDependency(absolutePath));
                }
                else
                {
                    if (Directory.Exists(absolutePath))
                    {
                        if (templateName.Length > 0 && templateName[templateName.Length - 1] != '-')
                        {
                            templateName += "-";
                        }
                        List<string> dependencyList = new List<string>();
                        
                        MvcHtmlString result = new MvcHtmlString(GetDirectoryTemplates(templateName, "", new DirectoryInfo(absolutePath), dependencyList));
                        HttpRuntime.Cache.Insert(path, result, new CacheDependency(dependencyList.ToArray()));
                    }
                    else
                    {
                        return new MvcHtmlString(""); //nothing is found, return empty string and do not cache
                    }
                }
            }

            return HttpRuntime.Cache[path] as MvcHtmlString;
        }

        private static string GetDirectoryTemplates(string templateName, string relativeDirName, DirectoryInfo rootDirectory, List<string> dependencyList)
        {
            dependencyList.Add(rootDirectory.FullName);

            var newSubRelativeDirName = relativeDirName;
            if (!string.IsNullOrEmpty(newSubRelativeDirName))
            {
                newSubRelativeDirName = newSubRelativeDirName + "-";
            }
            var content = "";

            foreach (DirectoryInfo subDir in rootDirectory.GetDirectories())
            {
                content += GetDirectoryTemplates(templateName, newSubRelativeDirName + subDir.Name, subDir, dependencyList);
            }

            foreach (FileInfo templateFile in rootDirectory.GetFiles())
            {
                string subtemplateName = templateFile.Name;
                int fileExtensionPosition = subtemplateName.LastIndexOf('.');
                if (fileExtensionPosition > 0)
                {
                    subtemplateName = subtemplateName.Substring(0, fileExtensionPosition);
                }
                if (relativeDirName.Length > 0 && relativeDirName[relativeDirName.Length - 1] != '-')
                {
                    relativeDirName += "-";
                }
                content += WrapWithHandlebarScript(templateName + relativeDirName + subtemplateName, templateFile.FullName);
            }
            return content;
        }

        private static string WrapWithHandlebarScript(string templateName, string templatePath)
        {
            string content = File.ReadAllText(templatePath);
            string startTag = string.Format("<script type=\"text/x-handlebars\" data-template-name=\"{0}\">\n", templateName);
            return startTag + content + "\n</script>\n";
        }

    }
}