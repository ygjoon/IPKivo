import ai from "./ai.json" with { type: "json" };
import api from "./api.json" with { type: "json" };
import browser from "./browser.json" with { type: "json" };
import common from "./common.json" with { type: "json" };
import home from "./home.json" with { type: "json" };
import ip from "./ip.json" with { type: "json" };
import network from "./network.json" with { type: "json" };
import policy from "./policy.json" with { type: "json" };
import status from "./status.json" with { type: "json" };
import whois from "./whois.json" with { type: "json" };

export default {
  ...common,
  ...browser,
  ...ip,
  ...network,
  ...whois,
  ...ai,
  ...status,
  ...home,
  ...policy,
  ...api,
};
