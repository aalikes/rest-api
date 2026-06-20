// D1 seed script — run after deployment to initialize technician accounts
// Usage: wrangler d1 execute provn-db --file=./worker/seed.sql

// This file generates the seed SQL. Use worker/seed.sql instead.
// The passwords are SHA-256 hashed with salt 'provn-salt-v1'

export async function seedDatabase(db) {
  const accounts = [
    { name: 'Shah', email: 'shah@provn.co' },
    { name: 'Jenny', email: 'jenny@provn.co' },
    { name: 'Sam', email: 'sam@provn.co' },
    { name: 'Micah', email: 'micah@provn.co' },
    { name: 'Gary', email: 'gary@provn.co' },
    { name: 'Nigel', email: 'nigel@provn.co' },
  ];

  const password = 'ProvnDemo2026!';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'provn-salt-v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  for (const account of accounts) {
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(account.email).first();
    if (!existing) {
      const id = crypto.randomUUID();
      await db.prepare(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, account.name, account.email, hashedPassword, 'admin').run();
    }
  }

  // Seed default services
  const services = [
    { name: 'Standard Fingerprinting', category: 'fingerprint', description: 'Ink fingerprint cards (FD-258)', base_price: 99, processing_days: 1 },
    { name: 'FBI Background Check - Resident', category: 'fbi', description: 'FBI identity history summary', base_price: 129, processing_days: 14, service_type: 'resident' },
    { name: 'FBI Background Check - Non-Resident', category: 'fbi', description: 'FBI identity history for non-residents', base_price: 179, processing_days: 14, service_type: 'non_resident' },
    { name: 'State Apostille', category: 'apostille', description: 'State-level document authentication', base_price: 200, processing_days: 10, service_type: 'state' },
    { name: 'Federal Apostille', category: 'apostille', description: 'Federal document authentication via U.S. Dept of State', base_price: 200, processing_days: 35, service_type: 'federal' },
  ];

  for (const svc of services) {
    const existing = await db.prepare('SELECT id FROM services WHERE name = ?').bind(svc.name).first();
    if (!existing) {
      await db.prepare(
        'INSERT INTO services (name, category, description, base_price, processing_days, service_type) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(svc.name, svc.category, svc.description, svc.base_price, svc.processing_days, svc.service_type || null).run();
    }
  }
}
