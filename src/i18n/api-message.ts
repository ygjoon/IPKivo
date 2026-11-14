import { t } from "./index.ts";
import type { MessageKey } from "./messages.ts";
import zhApi from "./zh-CN/api.json" with { type: "json" };

// The API currently returns Chinese display text. Keep that wire format separate
// from translation keys; unknown third-party messages retain their original text.
const apiMessages = new Map<string, MessageKey>(
  Object.entries(zhApi).map(([key, text]) => [text, key as MessageKey]),
);
apiMessages.set("正常运行", "common.operational");
apiMessages.set("维护中", "common.underMaintenance");
apiMessages.set(
  "IP 数据源返回的地址不匹配",
  "ip.ipReturnedSourceDoesMatchRequestedAddress",
);
apiMessages.set("RDAP · 注册局实时数据", "api.rdapRegistryData");
const upstreamStatus = /^外部数据源暂不可用 \((\d{3})\)$/;

export function localizeApiMessage(message: string): string {
  const upstream = message.match(upstreamStatus);
  if (upstream) return t("api.upstreamUnavailable", [upstream[1]]);
  const key = apiMessages.get(message);
  return key ? t(key) : message;
}
