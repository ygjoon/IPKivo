import enNetwork from "../i18n/en/network.json" with { type: "json" };
import enWhois from "../i18n/en/whois.json" with { type: "json" };
import zhNetwork from "../i18n/zh-CN/network.json" with { type: "json" };
import zhWhois from "../i18n/zh-CN/whois.json" with { type: "json" };

type SeoLocale = "zh-CN" | "en";
type FaqItem = { question: string; answer: string };

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

const supplementalFaqs: Record<
  string,
  Record<SeoLocale, readonly FaqItem[]>
> = {
  "/": {
    "zh-CN": [
      {
        question: "IPKivo 提供哪些网络检测工具？",
        answer:
          "IPKivo 提供公网 IP 查询、DNS 和 WebRTC 泄露检测、网站连通性与分流出口测试、网络测速、全球 Ping、WHOIS/RDAP 查询及浏览器环境检测。",
      },
      {
        question: "使用 IPKivo 需要注册账号吗？",
        answer:
          "基础网络检测无需注册账号。部分检测会向对应服务发送网络请求，具体结果会受设备、网络线路和探测节点影响。",
      },
      {
        question: "为什么同一项检测的结果会变化？",
        answer:
          "公网出口、运营商路由、探测节点和上游数据源都可能变化。建议在相同网络条件下重新检测，并结合多个结果判断。",
      },
    ],
    en: [
      {
        question: "What network tools does IPKivo provide?",
        answer:
          "IPKivo provides public IP lookup, DNS and WebRTC leak checks, website connectivity and egress tests, speed tests, global ping, WHOIS/RDAP lookup, and browser environment checks.",
      },
      {
        question: "Do I need an account to use IPKivo?",
        answer:
          "Basic network checks do not require an account. Some checks send requests to the relevant services, and results depend on your device, route, and probe locations.",
      },
      {
        question: "Why can results change between checks?",
        answer:
          "Your public egress, ISP routes, probe locations, and upstream data sources can change. Repeat a check under the same network conditions and compare multiple results.",
      },
    ],
  },
  "/ip": {
    "zh-CN": [
      {
        question: "IP 查询支持哪些地址？",
        answer:
          "本页支持查询公网 IPv4 和 IPv6 地址。私有、回环及保留地址不提供公网归属地查询。",
      },
      {
        question: "IP 地址定位结果准确到哪里？",
        answer:
          "IP 归属地来自第三方网络数据库，通常表示大致地区或运营商网络，不是 GPS 定位，也不一定对应设备的实际位置。",
      },
      {
        question: "IP 信誉分能代表绝对安全吗？",
        answer:
          "不能。信誉分是基于可用网络信号的参考指标，可能受数据覆盖和更新时间影响，不应单独用于安全决策。",
      },
    ],
    en: [
      {
        question: "Which addresses can the IP lookup check?",
        answer:
          "The lookup supports public IPv4 and IPv6 addresses. Private, loopback, and reserved addresses do not have public geolocation results here.",
      },
      {
        question: "How precise is IP geolocation?",
        answer:
          "IP location comes from third-party network databases. It usually indicates an approximate region or provider network, not GPS coordinates or the device's exact location.",
      },
      {
        question: "Does an IP reputation score guarantee safety?",
        answer:
          "No. It is a reference signal based on available network data, which can have coverage and update limits. Do not use it as the only basis for a security decision.",
      },
    ],
  },
  "/ping": {
    "zh-CN": [
      {
        question: "全球 Ping 测试测量什么？",
        answer:
          "测试会从你选择的探测地区向目标发起 Ping 或 HTTPS 测量，并返回可用的延迟、丢包或响应信息。不同协议测量的不是完全相同的网络路径。",
      },
      {
        question: "为什么有些探测节点没有结果？",
        answer:
          "目标可能屏蔽 ICMP，或某个探测节点到目标的路由不可达、超时。单个节点没有结果不一定表示目标服务整体故障。",
      },
      {
        question: "为什么不同地区的延迟差异很大？",
        answer:
          "探测点与目标之间的距离、运营商互联和实际路由都会影响延迟。建议比较多个地区和多次测量，而不是只看单个节点。",
      },
    ],
    en: [
      {
        question: "What does the global ping test measure?",
        answer:
          "It runs ping or HTTPS measurements from selected probe locations and reports available latency, packet loss, or response details. The two protocols do not measure identical network paths.",
      },
      {
        question: "Why do some probes return no result?",
        answer:
          "The target may block ICMP, or a probe may time out or lack a route to it. A missing result from one probe does not necessarily mean the service is down.",
      },
      {
        question: "Why does latency vary by region?",
        answer:
          "Distance, ISP interconnection, and the route between a probe and the target all affect latency. Compare several regions and runs instead of relying on one probe.",
      },
    ],
  },
  "/unlock/gpt": {
    "zh-CN": [
      {
        question: "ChatGPT 网络诊断会检查什么？",
        answer:
          "诊断会检查相关服务的网络连通性、出口 IP 和响应情况，用于排查代理分流或网络错误；它不会验证账号资格或替代 ChatGPT 登录。",
      },
      {
        question: "网络检测正常，为什么仍无法使用 ChatGPT？",
        answer:
          "网络可达并不代表账号或服务一定可用。账号状态、服务政策、地区限制、浏览器会话和服务端故障都可能影响访问。",
      },
      {
        question: "检测结果能保证 ChatGPT 一定可以访问吗？",
        answer:
          "不能。检测结果反映测试时的网络路径和响应，不承诺账号可用性、服务可用性或未来访问结果。",
      },
    ],
    en: [
      {
        question: "What does the ChatGPT network check inspect?",
        answer:
          "It checks connectivity, egress IP, and responses from related services to help troubleshoot routing or network errors. It does not verify account eligibility or replace a ChatGPT sign-in.",
      },
      {
        question:
          "Why might ChatGPT still be unavailable when the network check passes?",
        answer:
          "Network reachability does not guarantee account or service access. Account status, service policies, regional restrictions, browser sessions, and service incidents can also affect access.",
      },
      {
        question: "Can this result guarantee ChatGPT access?",
        answer:
          "No. It reflects the tested network path and responses at that time, and does not guarantee account eligibility, service availability, or future access.",
      },
    ],
  },
  "/unlock/claude": {
    "zh-CN": [
      {
        question: "Claude 诊断会检查哪些信息？",
        answer:
          "页面会检查相关服务的网络连通性和出口信息，并展示部分浏览器语言、时区等环境信号，帮助定位网络或环境差异。",
      },
      {
        question: "为什么 Claude 仍提示访问受限？",
        answer:
          "网络出口只是影响因素之一。账号状态、服务政策、地区、浏览器会话或服务端问题也可能导致受限，具体原因应以 Claude 的提示为准。",
      },
      {
        question: "修改浏览器语言或时区就能解决访问问题吗？",
        answer:
          "不一定。语言和时区只是浏览器环境信号，不能保证改变服务判定；请让设备设置与实际环境保持一致。",
      },
    ],
    en: [
      {
        question: "What does the Claude diagnostic check?",
        answer:
          "It checks connectivity and egress for related services and displays browser signals such as language and timezone to help identify network or environment differences.",
      },
      {
        question: "Why might Claude still restrict access?",
        answer:
          "Network egress is only one factor. Account status, service policies, region, browser sessions, or service incidents may also affect access; rely on Claude's own message for details.",
      },
      {
        question: "Will changing browser language or timezone fix access?",
        answer:
          "Not necessarily. Language and timezone are only environment signals and cannot guarantee a different service decision. Keep device settings consistent with your actual environment.",
      },
    ],
  },
  "/speedtest": {
    "zh-CN": [
      {
        question: "下载、上传、延迟和抖动分别表示什么？",
        answer:
          "下载和上传表示浏览器与测速节点之间的 HTTP 吞吐量；延迟表示往返响应时间；抖动表示延迟在连续测量中的变化。",
      },
      {
        question: "为什么多次测速结果不同？",
        answer:
          "无线信号、设备负载、代理、运营商路由和测速节点负载都会影响结果。尽量在相同设备和网络条件下重复测试。",
      },
      {
        question: "测速会消耗流量吗？",
        answer:
          "会。测速会传输下载和上传数据，消耗量取决于测试过程和连接速度；页面会提示上传数据统计方式。",
      },
    ],
    en: [
      {
        question: "What do download, upload, latency, and jitter mean?",
        answer:
          "Download and upload measure HTTP throughput between your browser and the test node. Latency is round-trip response time, while jitter is how that latency varies across measurements.",
      },
      {
        question: "Why do speed test results vary between runs?",
        answer:
          "Wi-Fi signal, device load, proxies, ISP routing, and test-node load can all affect results. Repeat the test on the same device and network when possible.",
      },
      {
        question: "Does a speed test use data?",
        answer:
          "Yes. The test transfers download and upload data. The amount depends on the test and connection speed; the page explains how upload data is counted.",
      },
    ],
  },
  "/browser/fingerprint": {
    "zh-CN": [
      {
        question: "什么是浏览器指纹？",
        answer:
          "浏览器指纹由浏览器公开的多项环境信号组合而成，例如渲染特征、语言和硬件能力，可用于区分不同浏览器配置。",
      },
      {
        question: "浏览器指纹能直接识别我的真实身份吗？",
        answer:
          "指纹信号本身通常不包含姓名等身份信息，但在多个网站或数据来源结合时可能用于关联浏览器活动。",
      },
      {
        question: "如何减少浏览器指纹的可识别性？",
        answer:
          "使用具备防指纹保护的主流浏览器、限制不必要的权限，并避免让不同环境信号彼此矛盾。单次检测不能证明完全匿名。",
      },
    ],
    en: [
      {
        question: "What is a browser fingerprint?",
        answer:
          "A browser fingerprint combines environment signals exposed by a browser, such as rendering traits, language, and hardware capabilities, to distinguish browser configurations.",
      },
      {
        question: "Can a browser fingerprint directly reveal my identity?",
        answer:
          "Fingerprint signals usually do not contain a name or identity by themselves, but they may help link browser activity when combined across sites or data sources.",
      },
      {
        question: "How can I reduce browser fingerprinting?",
        answer:
          "Use a mainstream browser with fingerprinting protections, limit unnecessary permissions, and avoid inconsistent environment signals. A single check cannot prove complete anonymity.",
      },
    ],
  },
};

export function localizedFaq(route: string, locale: SeoLocale) {
  const dictionary = dictionaries[locale] as Record<string, string>;
  const translatedFaq = (faqKeysByRoute[route] ?? []).map(
    ([questionKey, answerKey]) => ({
      question: dictionary[questionKey],
      answer: dictionary[answerKey],
    }),
  );
  return [...translatedFaq, ...(supplementalFaqs[route]?.[locale] ?? [])];
}
