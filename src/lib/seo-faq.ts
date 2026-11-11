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
  "/unlock/sites": {
    "zh-CN": [
      {
        question: "网站连通性检测会检查什么？",
        answer:
          "检测会从当前浏览器尝试访问列表中的网站，并汇总可读取的响应时间与连通情况。跨域限制可能使部分响应细节不可见。",
      },
      {
        question: "检测成功是否代表网站的全部功能都能使用？",
        answer:
          "不代表。连通性结果只反映检测时的网络请求，不验证账号登录、页面内容、播放功能或地区资格。",
      },
      {
        question: "为什么网站检测结果会因地区或网络而不同？",
        answer:
          "DNS 解析、代理分流、运营商路由、目标站点策略和网络波动都可能造成差异。请结合实际访问与多次检测判断。",
      },
    ],
    en: [
      {
        question: "What does the website connectivity check measure?",
        answer:
          "It tries to reach listed websites from your browser and reports available response timing and connectivity details. Cross-origin restrictions can hide some response information.",
      },
      {
        question:
          "Does a successful check mean every website feature will work?",
        answer:
          "No. It reflects network requests at the time of the check and does not verify sign-in, page content, playback, or regional eligibility.",
      },
      {
        question: "Why can results differ by region or network?",
        answer:
          "DNS answers, proxy routing, ISP paths, site policies, and network changes can all affect results. Compare repeated checks with actual access.",
      },
    ],
  },
  "/status": {
    "zh-CN": [
      {
        question: "服务状态页面的数据来自哪里？",
        answer:
          "页面汇总所列平台的公开状态接口或公开信息源。不同平台提供的数据范围、更新频率和可用性可能不同。",
      },
      {
        question: "为什么状态显示未知或查询失败？",
        answer:
          "服务可能没有可接入的公开接口，或其状态源暂时不可用、格式发生变化。此时请查看对应平台的官方状态页。",
      },
      {
        question: "这里的状态能代表我所在地区的服务情况吗？",
        answer:
          "不一定。平台的公开状态通常是汇总信息，可能不会覆盖特定账号、地区、产品组件或本地网络路径。",
      },
    ],
    en: [
      {
        question: "Where does the service status data come from?",
        answer:
          "The page aggregates public status APIs or public feeds from listed providers. Their coverage, update frequency, and availability vary.",
      },
      {
        question: "Why does a service show as unknown or unavailable?",
        answer:
          "A provider may not expose a supported public API, or its status source may be unavailable or change format. Check the provider's official status page for details.",
      },
      {
        question: "Does this status represent service health in my region?",
        answer:
          "Not necessarily. Public status is usually an aggregate and may not cover a specific account, region, product component, or local network path.",
      },
    ],
  },
  "/browser/environment": {
    "zh-CN": [
      {
        question: "浏览器环境检测会读取哪些信息？",
        answer:
          "页面会展示浏览器公开提供的环境信号，例如 User-Agent、语言、时区、屏幕和部分硬件能力。不同浏览器可提供的信息不同。",
      },
      {
        question: "浏览器环境信息能准确定位我的位置吗？",
        answer:
          "不能。语言、时区等只能提供环境线索，不是 GPS 定位；只有你主动使用位置权限检测时，浏览器才会请求定位授权。",
      },
      {
        question: "为什么浏览器环境检测显示的信息不完整？",
        answer:
          "隐私设置、浏览器版本、权限策略和设备能力都可能限制可读取的字段。缺少字段不表示设备故障。",
      },
    ],
    en: [
      {
        question: "What information does the browser environment check show?",
        answer:
          "It displays environment signals exposed by the browser, such as User-Agent, language, timezone, screen, and some hardware capabilities. Available fields vary by browser.",
      },
      {
        question: "Can browser environment data locate me precisely?",
        answer:
          "No. Language and timezone are only environment clues, not GPS location. The browser requests location permission only when you start the location check.",
      },
      {
        question: "Why is some browser environment information missing?",
        answer:
          "Privacy settings, browser versions, permission policies, and device capabilities can limit available fields. A missing field does not mean the device is faulty.",
      },
    ],
  },
  "/browser/checks": {
    "zh-CN": [
      {
        question: "浏览器一致性检测会比较什么？",
        answer:
          "检测会比较页面可读取的主线程、Worker 或其他浏览器上下文信号，并检查部分自动化标记；可比较的项目取决于浏览器支持。",
      },
      {
        question: "检测到环境差异就表示浏览器有问题吗？",
        answer:
          "不一定。隐私保护、浏览器隔离策略、扩展和兼容性都可能造成差异。结果用于排查线索，不是安全或身份结论。",
      },
      {
        question: "没有检测到自动化标记能证明我是普通用户吗？",
        answer:
          "不能。检测只覆盖有限的公开信号，不能证明浏览器或访问行为一定不是自动化程序。",
      },
    ],
    en: [
      {
        question: "What does the browser consistency check compare?",
        answer:
          "It compares signals exposed across the page, Worker, or other browser contexts and checks some automation indicators. Coverage depends on browser support.",
      },
      {
        question: "Does a detected difference mean something is wrong?",
        answer:
          "Not necessarily. Privacy protections, browser isolation, extensions, and compatibility can cause differences. Results are troubleshooting clues, not security or identity conclusions.",
      },
      {
        question:
          "Does finding no automation signal prove I am a regular user?",
        answer:
          "No. The check covers only a limited set of exposed signals and cannot prove that a browser or visit is not automated.",
      },
    ],
  },
  "/browser/privacy": {
    "zh-CN": [
      {
        question: "浏览器隐私检测会请求摄像头或位置权限吗？",
        answer:
          "页面会读取浏览器可查询的权限状态。摄像头、麦克风或位置等主动检测仅在你点击对应按钮后发起。",
      },
      {
        question: "为什么有些权限或浏览器能力显示不支持？",
        answer:
          "浏览器版本、安全上下文、设备和权限策略都会影响接口是否可用。页面会将无法查询的项目标记为不支持或不可用。",
      },
      {
        question: "浏览器隐私检测能保证我的隐私安全吗？",
        answer:
          "不能。页面只展示有限的浏览器能力和权限信息，不能全面评估网站、扩展、设备或网络的隐私与安全。",
      },
    ],
    en: [
      {
        question:
          "Does the browser privacy check request camera or location access?",
        answer:
          "The page reads permission states exposed by the browser. Active camera, microphone, or location checks run only after you click the matching button.",
      },
      {
        question:
          "Why are some permissions or browser capabilities unsupported?",
        answer:
          "Browser version, secure context, device support, and permission policies affect API availability. The page marks fields it cannot query as unsupported or unavailable.",
      },
      {
        question: "Can this browser privacy check guarantee my privacy?",
        answer:
          "No. It shows a limited set of browser capabilities and permissions and cannot fully assess the privacy or security of sites, extensions, devices, or networks.",
      },
    ],
  },
  "/privacy": {
    "zh-CN": [
      {
        question: "IPKivo 会处理哪些网络请求信息？",
        answer:
          "托管服务会处理请求 IP 和必要的请求信息。IP、域名查询及网络检测会把相关目标发送给对应数据源或检测服务；浏览器直接连接的第三方站点也能看到该连接的出口 IP。",
      },
      {
        question: "IPKivo 会在浏览器中保存哪些数据？",
        answer:
          "本站会在当前浏览器保存主题、语言、提示偏好和查询历史。查询历史包含最近成功查询的地址与结果。",
      },
      {
        question: "如何删除查询历史和其他本地数据？",
        answer:
          "可以通过浏览器的网站数据设置清除本站本地数据。此操作不会删除托管服务或第三方服务可能保留的请求记录。",
      },
      {
        question: "浏览器检测会未经同意打开摄像头或定位吗？",
        answer:
          "摄像头、麦克风和定位检测需要你主动点击触发，并受浏览器权限控制。媒体测试会立即关闭获取到的媒体流，不录制音视频。",
      },
    ],
    en: [
      {
        question: "What network request information does IPKivo process?",
        answer:
          "The hosting service processes request IPs and necessary request information. IP, domain, and network checks send their targets to the relevant data or diagnostic services. Third-party sites contacted directly by your browser can also see that connection's egress IP.",
      },
      {
        question: "What data does IPKivo store in my browser?",
        answer:
          "The site stores theme, language, notice preferences, and lookup history in the current browser. Lookup history includes recent successful queries and their results.",
      },
      {
        question: "How can I delete lookup history and other local data?",
        answer:
          "Clear this site's data in your browser settings to remove local data. This does not delete request records that hosting or third-party services may retain.",
      },
      {
        question:
          "Can browser checks open my camera or access my location without consent?",
        answer:
          "Camera, microphone, and location checks start only after you click them and are controlled by browser permissions. Media tests close the stream immediately and do not record audio or video.",
      },
    ],
  },
  "/terms": {
    "zh-CN": [
      {
        question: "IPKivo 提供哪些服务？",
        answer:
          "本站提供 IP 查询、网络诊断、浏览器检测和服务状态查询。具体功能和数据源可能调整，请以页面当前说明为准。",
      },
      {
        question: "可以检测任何 IP、域名或网站吗？",
        answer:
          "请仅检测你有权测试的目标。不得利用本站从事违法活动、干扰第三方服务、绕过访问限制或滥用 API。",
      },
      {
        question: "检测结果能保证服务可用或账号可访问吗？",
        answer:
          "不能。结果会受网络、浏览器限制和第三方数据影响，仅供参考，不保证安全性、账号可用性或服务持续可用。重要结果请通过相关官方渠道核实。",
      },
      {
        question: "API 是否需要密钥，是否有请求限制？",
        answer:
          "API 无需密钥，但会按请求 IP 限流。收到 429 响应时请降低请求频率后重试，不要通过轮换 IP 绕过限制。",
      },
    ],
    en: [
      {
        question: "What services does IPKivo provide?",
        answer:
          "The site provides IP lookup, network diagnostics, browser checks, and service status queries. Features and data sources may change; follow the current page instructions.",
      },
      {
        question: "May I test any IP address, domain, or website?",
        answer:
          "Use the tools only for targets you are authorized to test. Do not use the site for unlawful activity, disrupting third-party services, bypassing access restrictions, or abusing the API.",
      },
      {
        question:
          "Do test results guarantee service availability or account access?",
        answer:
          "No. Results depend on the network, browser restrictions, and third-party data. They are for reference and do not guarantee security, account access, or continued availability. Verify important results through the relevant official service.",
      },
      {
        question: "Does the API require a key, and are requests rate-limited?",
        answer:
          "The API requires no key but is rate-limited by request IP. If you receive a 429 response, reduce your request frequency and retry; do not rotate IPs to bypass limits.",
      },
    ],
  },
};

export function localizedFaq(route: string, locale: SeoLocale) {
  const resolvedRoute = route === "/ip/:ip" ? "/ip" : route;
  const dictionary = dictionaries[locale] as Record<string, string>;
  const translatedFaq = (faqKeysByRoute[resolvedRoute] ?? []).map(
    ([questionKey, answerKey]) => ({
      question: dictionary[questionKey],
      answer: dictionary[answerKey],
    }),
  );
  return [
    ...translatedFaq,
    ...(supplementalFaqs[resolvedRoute]?.[locale] ?? []),
  ];
}
