const crypto = require('crypto');
const fetch = require('node-fetch');
const { getDb } = require('../db');

const CB_API_BASE = 'https://api.coinbase.com/v2';

function isConfigured() {
  return !!(process.env.COINBASE_API_KEY_NAME && process.env.COINBASE_API_PRIVATE_KEY);
}

function buildJwt() {
  const keyName = process.env.COINBASE_API_KEY_NAME;
  const rawKey = process.env.COINBASE_API_PRIVATE_KEY.replace(/\\n/g, '\n');

  let privateKey;
  if (rawKey.trim().startsWith('-----')) {
    privateKey = crypto.createPrivateKey(rawKey);
  } else {
    const decoded = Buffer.from(rawKey, 'base64');
    const scalar = decoded.subarray(0, 32);
    const ecKey = crypto.createPrivateKey({
      key: buildPkcs8FromScalar(scalar),
      format: 'der',
      type: 'pkcs8',
    });
    privateKey = ecKey;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyName, nonce: now.toString(), typ: 'JWT' };
  const payload = {
    sub: keyName,
    iss: 'cdp',
    nbf: now,
    exp: now + 120,
    uri: 'GET api.coinbase.com/v2/accounts',
  };

  const encHeader = base64url(JSON.stringify(header));
  const encPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encHeader}.${encPayload}`;

  const sign = crypto.createSign('SHA256');
  sign.update(signingInput);
  const derSig = sign.sign(privateKey);
  const sig = derToJose(derSig);

  return `${signingInput}.${sig}`;
}

function base64url(str) {
  return Buffer.from(str).toString('base64url');
}

function derToJose(derSig) {
  let offset = 2;
  if (derSig[1] & 0x80) offset += (derSig[1] & 0x7f);

  const rLen = derSig[offset + 1];
  let r = derSig.subarray(offset + 2, offset + 2 + rLen);
  offset = offset + 2 + rLen;

  const sLen = derSig[offset + 1];
  let s = derSig.subarray(offset + 2, offset + 2 + sLen);

  if (r.length > 32) r = r.subarray(r.length - 32);
  if (s.length > 32) s = s.subarray(s.length - 32);

  const jose = Buffer.alloc(64);
  r.copy(jose, 32 - r.length);
  s.copy(jose, 64 - s.length);
  return jose.toString('base64url');
}

function buildPkcs8FromScalar(scalar) {
  const oid = Buffer.from('06082a8648ce3d030107', 'hex');
  const ecOid = Buffer.from('06072a8648ce3d0201', 'hex');

  const privKeyOctet = Buffer.concat([Buffer.from([0x04, scalar.length]), scalar]);
  const ecPrivateKey = Buffer.concat([
    Buffer.from([0x30]),
    asn1Length(2 + 1 + privKeyOctet.length),
    Buffer.from([0x02, 0x01, 0x01]),
    privKeyOctet,
  ]);

  const algId = Buffer.concat([
    Buffer.from([0x30]),
    asn1Length(ecOid.length + oid.length),
    ecOid,
    oid,
  ]);

  const privKeyWrapper = Buffer.concat([
    Buffer.from([0x04]),
    asn1Length(ecPrivateKey.length),
    ecPrivateKey,
  ]);

  const versionBytes = Buffer.from([0x02, 0x01, 0x00]);
  const inner = Buffer.concat([versionBytes, algId, privKeyWrapper]);
  return Buffer.concat([Buffer.from([0x30]), asn1Length(inner.length), inner]);
}

function asn1Length(len) {
  if (len < 128) return Buffer.from([len]);
  if (len < 256) return Buffer.from([0x81, len]);
  return Buffer.from([0x82, (len >> 8) & 0xff, len & 0xff]);
}

async function fetchPortfolioBalance() {
  if (!isConfigured()) throw new Error('Coinbase API credentials not configured');

  const token = buildJwt();
  const res = await fetch(`${CB_API_BASE}/accounts?limit=100`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Coinbase API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  const accounts = data.data || [];
  const total = accounts.reduce((sum, a) => {
    const amt = parseFloat((a.native_balance || { amount: '0' }).amount);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  return {
    balance: Math.round(total * 100) / 100,
    accounts: accounts.length,
    currency: accounts[0]?.native_balance?.currency || 'USD',
  };
}

async function syncPortfolioToDb(userId) {
  if (!isConfigured()) throw new Error('Coinbase API credentials not configured');

  const portfolio = await fetchPortfolioBalance();
  const db = getDb();

  const existing = db.prepare(
    "SELECT id FROM financials WHERE user_id = ? AND name LIKE 'Coinbase Portfolio%' AND category = 'Investment'"
  ).get(userId);

  if (existing) {
    db.prepare(`
      UPDATE financials SET name=?, amount=?, notes=?, updated_at=datetime('now')
      WHERE id=? AND user_id=?
    `).run(
      `Coinbase Portfolio (${portfolio.accounts} accounts)`,
      portfolio.balance,
      `Auto-synced portfolio balance: $${portfolio.balance} ${portfolio.currency}. Last updated: ${new Date().toISOString()}`,
      existing.id,
      userId
    );
    return { action: 'updated', ...portfolio };
  }

  db.prepare(`
    INSERT INTO financials (name, priority, status, category, notes, amount, frequency, user_id)
    VALUES (?, 'Medium', 'Active', 'Investment', ?, ?, NULL, ?)
  `).run(
    `Coinbase Portfolio (${portfolio.accounts} accounts)`,
    `Auto-synced portfolio balance: $${portfolio.balance} ${portfolio.currency}`,
    portfolio.balance,
    userId
  );

  return { action: 'created', ...portfolio };
}

module.exports = {
  isConfigured,
  fetchPortfolioBalance,
  syncPortfolioToDb,
};
