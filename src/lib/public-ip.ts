function validIpv4(value: string) {
  const octets = value.split(".");
  if (octets.length !== 4) return false;
  const numbers = octets.map((octet) =>
    /^(?:0|[1-9]\d{0,2})$/.test(octet) ? Number(octet) : 256,
  );
  if (numbers.some((octet) => octet > 255)) return false;

  const [a, b, c] = numbers;
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 &&
      (b === 168 ||
        (b === 0 && (c === 0 || c === 2)) ||
        (b === 88 && c === 99))) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113)
  );
}

function normalizePublicIpv6(value: string): string | undefined {
  if (!value.includes(":") || value.includes("%")) return undefined;
  let ip: string;
  try {
    ip = new URL(`http://[${value}]/`).hostname.slice(1, -1);
  } catch {
    return undefined;
  }
  if (ip.startsWith("::ffff:")) {
    const [high, low] = ip
      .slice(7)
      .split(":")
      .map((part) => Number.parseInt(part, 16));
    if (!Number.isFinite(high) || !Number.isFinite(low)) return undefined;
    const mappedIpv4 = `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
    return validIpv4(mappedIpv4) ? mappedIpv4 : undefined;
  }
  if (
    !ip ||
    !/^[23]/.test(ip) ||
    ip.startsWith("2002:") ||
    /^2001:(db8|2|10|20):/.test(ip) ||
    ip.startsWith("2001::")
  )
    return undefined;
  return ip;
}

/** Return the normalized globally routable IP, or undefined for invalid/reserved input. */
export function normalizePublicIp(value: string): string | undefined {
  if (validIpv4(value)) return value;
  return normalizePublicIpv6(value);
}
