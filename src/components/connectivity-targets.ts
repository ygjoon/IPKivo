import { t } from "@/i18n";

export interface Target {
  name: string;
  icon?: string;
  url: string;
}

export const homeTargets: Target[] = [
  {
    name: t("sites.byteDance"),
    icon: "https://icons.duckduckgo.com/ip3/bytedance.com.ico",
    url: "https://perfops.byte-test.com/500b-bench.jpg",
  },
  {
    name: t("sites.taobao"),
    icon: "https://icons.duckduckgo.com/ip3/taobao.com.ico",
    url: "https://www.taobao.com/favicon.ico",
  },
  {
    name: t("sites.wechat"),
    icon: "https://icons.duckduckgo.com/ip3/weixin.qq.com.ico",
    url: "https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico",
  },
  {
    name: "GitHub",
    icon: "https://icons.duckduckgo.com/ip3/github.com.ico",
    url: "https://github.com/generate_204",
  },
  {
    name: "Cloudflare",
    icon: "https://icons.duckduckgo.com/ip3/cloudflare.com.ico",
    url: "https://1.1.1.1/cdn-cgi/trace",
  },
  {
    name: "YouTube",
    icon: "https://icons.duckduckgo.com/ip3/youtube.com.ico",
    url: "https://www.youtube.com/generate_204",
  },
];
