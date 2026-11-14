export type FaqLocale = "zh-CN" | "zh-TW" | "en" | "ja" | "ru";
export type FaqItem = { question: string; answer: string };

export const faqKeysByRoute: Record<
  string,
  readonly (readonly [string, string])[]
> = {
  "/leak/dns": [
    ["dns.faq.whatTitle", "dns.faq.whatText"],
    ["dns.faq.howTitle", "dns.faq.howText"],
    ["dns.faq.limitsTitle", "dns.faq.limitsText"],
    ["dns.faq.fixTitle", "dns.faq.fixText"],
  ],
  "/leak/webrtc": [
    [
      "webrtc.whatIsAWebrtcLeak",
      "webrtc.webrtcUsesIceStunDiscoverAddressesPeerPeer",
    ],
    [
      "webrtc.whatAreStunAndUdp",
      "webrtc.udpConnectionlessTransportProtocolStunServerReturnsPublic",
    ],
    ["webrtc.faq.mdnsTitle", "webrtc.faq.mdnsText"],
    [
      "webrtc.howITellIfThereLeak",
      "webrtc.differentEgressIndicatesDifferentUdpHttpRoutesWhich",
    ],
    [
      "webrtc.howDoIFixALeak",
      "webrtc.checkUdpForwardingTunTrafficHandlingIpv6Rules",
    ],
    [
      "webrtc.whyDoProxyTunModesGiveDifferentResults",
      "webrtc.systemProxyVirtualNetworkAdapterModesHandleDifferent",
    ],
  ],
  "/whois": [
    ["whois.whatCanILookUp", "whois.faq.supportedQueriesAnswer"],
    ["whois.whatIsTheDifferenceBetweenWhoisAndRdap", "whois.faq.rdapAnswer"],
    [
      "whois.whyDidTheLookupFailOrReturnNothing",
      "whois.faq.lookupFailureAnswer",
    ],
    [
      "whois.whyIsRegistrantOrCountryInformationMissing",
      "whois.faq.missingFieldsAnswer",
    ],
    [
      "whois.whatDoDomainStatusAndNameServersMean",
      "whois.faq.registrationStatusAnswer",
    ],
    [
      "whois.doRecentLookupsUpdateAutomatically",
      "whois.faq.lookupHistoryAnswer",
    ],
  ],
};
