using System.IO;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;
using System.Xml;
using System;

public class PostProcessForFixXcodeCrashBug : IPostprocessBuildWithReport
{
    public int callbackOrder
    {
        get { return int.MaxValue - 1; }
    }

    public void OnPostprocessBuild(BuildReport report)
    {
#if UNITY_IOS
        if (report == null)
            return;
 
        if (report.summary.result == BuildResult.Succeeded ||
            report.summary.result == BuildResult.Unknown)
        {
            string attributeName = "disablePerformanceAntipatternChecker";
            string xcschemePath = Path.Combine(report.summary.outputPath,
                "Unity-iPhone.xcodeproj", "xcshareddata",
                "xcschemes", "Unity-iPhone.xcscheme");
            xcschemePath = xcschemePath.Replace("\\", "/");
            if (File.Exists(xcschemePath))
            {
                try
                {
                    bool setAttribute = false;
                    XmlDocument xmlDocument = new XmlDocument();
                    xmlDocument.Load(xcschemePath);
 
                    if (xmlDocument.DocumentElement != null &&
                        xmlDocument.DocumentElement["LaunchAction"] != null)
                    {
                        XmlElement launchAction = xmlDocument.DocumentElement["LaunchAction"];
 
                        if (launchAction.HasAttribute(attributeName))
                        {
                            if (launchAction.GetAttribute(attributeName) != "YES")
                            {
                                // Change attribute value
                                setAttribute = true;
                            }
                        }
                        else
                        {
                            // Append attribute
                            setAttribute = true;
                        }
 
                        if (setAttribute)
                        {
                            launchAction.SetAttribute(attributeName, "YES");
                        }
                    }
 
                    if (setAttribute)
                    {
                        xmlDocument.Save(xcschemePath);
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError(e.ToString());
                }
 
            }
        }
#endif
    }
}