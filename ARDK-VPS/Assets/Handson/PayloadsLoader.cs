using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Niantic.ARDK;
using Niantic.ARDK.AR;
using Niantic.ARDK.AR.ARSessionEventArgs;
using Niantic.ARDK.AR.WayspotAnchors;
using Niantic.ARDK.Extensions;
using Niantic.ARDK.LocationService;
// using Niantic.ARDK.Utilities;

using UnityEngine;
using UnityEngine.UI;

public class PayloadsLoader : MonoBehaviour
{
    public WayspotAnchorService WayspotAnchorService;

    [SerializeField] private GameObject[] anchorObjects;
    [SerializeField] private String[] payloads;

    [SerializeField] private Text localizationStatus;

    private IARSession arSession;
    private IWayspotAnchorsConfiguration config;

    private void OnEnable()
    {
        ARSessionFactory.SessionInitialized += HandleSessionInitialized;
    }

    private void OnDisable()
    {
        ARSessionFactory.SessionInitialized -= HandleSessionInitialized;
    }

    private void LoadPayloads()
    {
        for (int i = 0; i < payloads.Length; i++)
        {
            var payload = WayspotAnchorPayload.Deserialize(payloads[i]);
            var anchor = WayspotAnchorService.RestoreWayspotAnchors(payload);
            var obj = GameObject.Instantiate(anchorObjects[i]);

            var tracker = obj.AddComponent<WayspotAnchorTracker>();
            tracker.AttachAnchor(anchor[0]);
        }
    }

    private WayspotAnchorService CreateWayspotAnchorService()
    {
        var locationService = LocationServiceFactory.Create(arSession.RuntimeEnvironment);
        locationService.Start();

        if (config == null)
            config = WayspotAnchorsConfigurationFactory.Create();

        var wayspotAnchorService =
          new WayspotAnchorService
          (
            arSession,
            locationService,
            config
          );

        return wayspotAnchorService;
    }

    private void OnLocalizationStateUpdated(LocalizationStateUpdatedArgs args)
    {
        localizationStatus.text = args.State.ToString();
    }

    private void HandleSessionInitialized(AnyARSessionInitializedArgs args)
    {
        arSession = args.Session;
        arSession.Ran += HandleSessionRan;
    }

    private void HandleSessionRan(ARSessionRanArgs args)
    {
        arSession.Ran -= HandleSessionRan;
        WayspotAnchorService = CreateWayspotAnchorService();
        WayspotAnchorService.LocalizationStateUpdated += OnLocalizationStateUpdated;
    }

    public void loadPayloads()
    {
        LoadPayloads();
    }
}
