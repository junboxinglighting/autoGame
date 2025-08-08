import { a as getHeaders } from './nitro.mjs';

function getClientIP(event) {
  var _a;
  const headers = getHeaders(event);
  const ipHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "cf-connecting-ip",
    // Cloudflare
    "x-forwarded",
    "forwarded-for",
    "forwarded"
  ];
  for (const header of ipHeaders) {
    const value = headers[header];
    if (value) {
      const ip = Array.isArray(value) ? value[0] : value;
      const cleanIP = ip.split(",")[0].trim();
      if (cleanIP && isValidIP(cleanIP)) {
        return cleanIP;
      }
    }
  }
  const nodeReq = event.node.req;
  const socketAddress = (_a = nodeReq.socket) == null ? void 0 : _a.remoteAddress;
  if (socketAddress && isValidIP(socketAddress)) {
    return socketAddress;
  }
  return "127.0.0.1";
}
function isValidIP(ip) {
  if (!ip || typeof ip !== "string") {
    return false;
  }
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export { getClientIP as g };
//# sourceMappingURL=clientInfo.mjs.map
