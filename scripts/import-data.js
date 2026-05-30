#!/usr/bin/env node

/**
 * Import Notion JSON exports into the API database.
 *
 * Usage:
 *   NODE_ENV=development node scripts/import-data.js
 *
 * Expects JSON files at ~/Desktop/notion_active_tasks.json,
 * ~/Desktop/notion_financial.json, ~/Desktop/notion_reading.json
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Ensure dotenv is loaded
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getDb, closeDb } = require('../src/db');

async function main() {
  const db = getDb();

  // ── Create all technician accounts ──────────────────────────────
  const demoAccounts = [
    { name: 'Shah Saint-Cyr', email: 'shah@provn.co' },
    { name: 'Jenny', email: 'jenny@provn.co' },
    { name: 'Sam', email: 'sam@provn.co' },
    { name: 'Micah', email: 'micah@provn.co' },
    { name: 'Gary', email: 'gary@provn.co' },
    { name: 'Nigel', email: 'nigel@provn.co' },
  ];

  const demoPassword = 'ProvnDemo2026!';
  const hashed = await bcrypt.hash(demoPassword, 12);

  for (const acct of demoAccounts) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(acct.email);
    if (!existing) {
      const id = crypto.randomUUID();
      db.prepare(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)'
      ).run(id, acct.name, acct.email, hashed, 'admin');
      console.log(`  ✓ Created technician: ${acct.email}`);
    } else {
      db.prepare('UPDATE users SET password = ?, role = ? WHERE email = ?').run(hashed, 'admin', acct.email);
      console.log(`  ✓ Updated technician: ${acct.email}`);
    }
  }

  const defaultUserEmail = 'shah@provn.co';
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(defaultUserEmail);
  console.log('  ✓ All accounts set to password: ProvnDemo2026!');

  const userId = user.id;

  // ── Import Active Tasks ────────────────────────────────────────
  const tasksPath = path.join(os.homedir(), 'Desktop', 'notion_active_tasks.json');
  if (fs.existsSync(tasksPath)) {
    const items = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
    const insert = db.prepare(`
      INSERT INTO tasks (name, priority, status, due_date, category, notes, source, flagged, user_id)
      VALUES (@name, @priority, @status, @due_date, @category, @notes, @source, @flagged, @user_id)
    `);

    const tx = db.transaction((rows) => {
      let count = 0;
      for (const row of rows) {
        const category = mapListToCategory(row.List);
        insert.run({
          name: row.Name,
          priority: row.Priority || 'None',
          status: 'To Do',
          due_date: row['Due Date'] || null,
          category,
          notes: row.Notes || null,
          source: 'Apple Reminders',
          flagged: row.Flagged === 'Yes' ? 1 : 0,
          user_id: userId,
        });
        count++;
      }
      return count;
    });

    const count = tx(items);
    console.log(`  ✓ Imported ${count} active tasks`);
  } else {
    console.log('  ⚠  not found:', tasksPath);
  }

  // ── Import Financial Items ─────────────────────────────────────
  const finPath = path.join(os.homedir(), 'Desktop', 'notion_financial.json');
  if (fs.existsSync(finPath)) {
    const items = JSON.parse(fs.readFileSync(finPath, 'utf-8'));
    const insert = db.prepare(`
      INSERT INTO financials (name, priority, due_date, status, category, notes, auto_renew, amount, frequency, user_id)
      VALUES (@name, @priority, @due_date, @status, @category, @notes, @auto_renew, @amount, @frequency, @user_id)
    `);

    const tx = db.transaction((rows) => {
      let count = 0;
      for (const row of rows) {
        const name = row.Name || '';
        const isYearly = name.toLowerCase().includes('yearly');
        const isMonthly = !isYearly && (
          name.toLowerCase().includes('monthly') ||
          name.toLowerCase().includes('subscription')
        );
        const frequency = isYearly ? 'Yearly' : isMonthly ? 'Monthly' : null;
        const autoRenew = isYearly || isMonthly ? 1 : 0;

        let amount = null;
        if (row.Amount) {
          amount = parseFloat(row.Amount.replace('$', '').replace(',', ''));
        } else if (row.Notes && row.Notes.includes('Amount:')) {
          const match = row.Notes.match(/Amount:\s*\$?([\d.]+)/);
          if (match) amount = parseFloat(match[1]);
        }

        insert.run({
          name,
          priority: row.Priority || 'None',
          due_date: row['Due Date'] || null,
          status: 'Active',
          category: mapFinCategory(row['Current List'] || row.List),
          notes: row.Notes || null,
          auto_renew: autoRenew,
          amount,
          frequency,
          user_id: userId,
        });
        count++;
      }
      return count;
    });

    const count = tx(items);
    console.log(`  ✓ Imported ${count} financial items`);
  } else {
    console.log('  ⚠  not found:', finPath);
  }

  // ── Import Reading Log ─────────────────────────────────────────
  const readPath = path.join(os.homedir(), 'Desktop', 'notion_reading.json');
  if (fs.existsSync(readPath)) {
    const items = JSON.parse(fs.readFileSync(readPath, 'utf-8'));
    const insert = db.prepare(`
      INSERT INTO reading_log (name, status, priority, format, notes, tags, user_id)
      VALUES (@name, @status, @priority, @format, @notes, @tags, @user_id)
    `);

    const tx = db.transaction((rows) => {
      let count = 0;
      for (const row of rows) {
        const format = mapReadingFormat(row.Name);
        insert.run({
          name: row.Name,
          status: 'Want to Read',
          priority: row.Priority || 'Medium',
          format,
          notes: row.Notes || null,
          tags: null,
          user_id: userId,
        });
        count++;
      }
      return count;
    });

    const count = tx(items);
    console.log(`  ✓ Imported ${count} reading items`);
  } else {
    console.log('  ⚠  not found:', readPath);
  }

  closeDb();
  console.log('\n✅ Import complete.\n');
}

function mapListToCategory(list) {
  if (!list) return null;
  const l = list.toLowerCase();
  if (l.includes('admin') || l.includes('legal')) return 'Admin';
  if (l.includes('financial') || l.includes('banking')) return 'Financial';
  if (l.includes('follow') || l.includes('communication')) return 'Follow-ups';
  if (l.includes('learning') || l.includes('read')) return 'Learning';
  if (l.includes('personal') || l.includes('errand')) return 'Personal';
  if (l.includes('project') || l.includes('thc') || l.includes('acd') || l.includes('rn') || l.includes('mp')) return 'Projects';
  if (l.includes('catchall')) return 'Follow-ups';
  return null;
}

function mapFinCategory(list) {
  if (!list) return null;
  const l = list.toLowerCase();
  if (l.includes('credit') || l.includes('card')) return 'Credit Card';
  if (l.includes('subscription')) return 'Subscription';
  if (l.includes('banking')) return 'Credit Card';
  return 'Other';
}

function mapReadingFormat(name) {
  if (!name) return null;
  const l = name.toLowerCase();
  if (l.includes('book') || l.includes('how to measure') || l.includes('decisive') || l.includes('superforecasting')) return 'Book';
  if (l.includes('tutorial') || l.includes('setup') || l.includes('installation')) return 'Tutorial';
  if (l.includes('playlist') || l.includes('video')) return 'Video';
  if (l.includes('course')) return 'Course';
  if (l.includes('article')) return 'Article';
  return 'Other';
}

const os = require('os');

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
