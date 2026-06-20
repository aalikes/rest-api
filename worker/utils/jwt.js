// JWT implementation for Cloudflare Workers using Web Crypto API
// (jsonwebtoken uses Node.js crypto which isn't available in Workers)

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function getKey(secret) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function sign(payload, secret, expiresIn = '7d') {
  const header = { alg: 'HS256', typ: 'JWT' };

  // Parse expiresIn
  let expSeconds = 7 * 24 * 60 * 60; // default 7d
  if (typeof expiresIn === 'string') {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2];
      const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
      expSeconds = num * multipliers[unit];
    }
  } else if (typeof expiresIn === 'number') {
    expSeconds = expiresIn;
  }

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));

  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${signingInput}.${encodedSignature}`;
}

export async function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getKey(secret);
  const encoder = new TextEncoder();

  const signatureBytes = Uint8Array.from(
    base64UrlDecode(encodedSignature),
    (c) => c.charCodeAt(0)
  );

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    encoder.encode(signingInput)
  );

  if (!valid) throw new Error('Invalid or malformed token.');

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    const err = new Error('Token has expired. Please log in again.');
    err.name = 'TokenExpiredError';
    throw err;
  }

  return payload;
}
