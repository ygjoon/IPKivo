import enNetwork from "../i18n/en/network.json" with { type: "json" };
import enWhois from "../i18n/en/whois.json" with { type: "json" };
import zhNetwork from "../i18n/zh-CN/network.json" with { type: "json" };
import zhWhois from "../i18n/zh-CN/whois.json" with { type: "json" };

type SeoLocale = "zh-CN" | "en";

const dictionaries = {
  "zh-CN": { ...zhNetwork, ...zhWhois },
  en: { ...enNetwork, ...enWhois },
} as const;

const faqKeysByRoute: Record<string, readonly (readonly [string, string])[]> = {
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

export function localizedFaq(route: string, locale: SeoLocale) {
  const dictionary = dictionaries[locale] as Record<string, string>;
  return (faqKeysByRoute[route] ?? []).map(([questionKey, answerKey]) => ({
    question: dictionary[questionKey],
    answer: dictionary[answerKey],
  }));
}
