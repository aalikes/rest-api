#!/usr/bin/env node

/**
 * Notion Database Setup Script
 *
 * Creates all required Notion databases for the integration ecosystem:
 * - Tasks DB (for rest-api)
 * - Financials DB (for rest-api)
 * - Reading Log DB (for rest-api)
 * - Speech Log DB (for voxaartisan)
 * - Trips DB (for GoTime)
 *
 * Usage:
 *   NOTION_TOKEN=ntn_xxx NOTION_PARENT_PAGE_ID=xxx node scripts/setup-notion-databases.js
 *
 * The parent page ID is where the databases will be created.
 * Find it from your Notion page URL: https://www.notion.so/<workspace>/<PAGE_ID>
 */

require('dotenv').config();
const fetch = require('node-fetch');

const API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN is required');
  process.exit(1);
}
if (!PARENT_PAGE_ID) {
  console.error('❌ NOTION_PARENT_PAGE_ID is required (the page where databases will be created)');
  process.exit(1);
}

function headers() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

async function createDatabase(title, properties) {
  const res = await fetch(`${API_BASE}/databases`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      parent: { page_id: PARENT_PAGE_ID },
      title: [{ text: { content: title } }],
      properties,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create "${title}": ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.id;
}

// ── Database Schemas ──────────────────────────────────────────────

const TASKS_DB = {
  'Name': { title: {} },
  'Status': { select: { options: [
    { name: 'To Do', color: 'red' },
    { name: 'In Progress', color: 'yellow' },
    { name: 'Done', color: 'green' },
  ]}},
  'Priority': { select: { options: [
    { name: 'High', color: 'red' },
    { name: 'Medium', color: 'yellow' },
    { name: 'None', color: 'default' },
  ]}},
  'Category': { select: { options: [
    { name: 'Admin', color: 'gray' },
    { name: 'Financial', color: 'green' },
    { name: 'Follow-ups', color: 'blue' },
    { name: 'Learning', color: 'purple' },
    { name: 'Personal', color: 'pink' },
    { name: 'Projects', color: 'orange' },
  ]}},
  'Due Date': { date: {} },
  'Notes': { rich_text: {} },
  'Source': { rich_text: {} },
  'Flagged': { checkbox: {} },
  'API ID': { rich_text: {} },
};

const FINANCIALS_DB = {
  'Name': { title: {} },
  'Status': { select: { options: [
    { name: 'Active', color: 'green' },
    { name: 'Cancelled', color: 'red' },
    { name: 'Paused', color: 'yellow' },
  ]}},
  'Priority': { select: { options: [
    { name: 'High', color: 'red' },
    { name: 'Medium', color: 'yellow' },
    { name: 'None', color: 'default' },
  ]}},
  'Amount': { number: { format: 'dollar' } },
  'Frequency': { select: { options: [
    { name: 'Monthly', color: 'blue' },
    { name: 'Yearly', color: 'purple' },
    { name: 'One-time', color: 'gray' },
    { name: 'Weekly', color: 'green' },
  ]}},
  'Category': { select: { options: [
    { name: 'Subscription', color: 'blue' },
    { name: 'Bill', color: 'orange' },
    { name: 'Investment', color: 'green' },
    { name: 'Insurance', color: 'purple' },
  ]}},
  'Due Date': { date: {} },
  'Notes': { rich_text: {} },
  'Auto Renew': { checkbox: {} },
  'API ID': { rich_text: {} },
};

const READING_DB = {
  'Name': { title: {} },
  'Status': { select: { options: [
    { name: 'Want to Read', color: 'gray' },
    { name: 'Reading', color: 'blue' },
    { name: 'Finished', color: 'green' },
    { name: 'Archived', color: 'default' },
  ]}},
  'Priority': { select: { options: [
    { name: 'High', color: 'red' },
    { name: 'Medium', color: 'yellow' },
    { name: 'Low', color: 'default' },
  ]}},
  'Format': { rich_text: {} },
  'Notes': { rich_text: {} },
  'Tags': { rich_text: {} },
  'API ID': { rich_text: {} },
};

const SPEECH_LOG_DB = {
  'Title': { title: {} },
  'Pathway': { select: { options: [
    { name: 'Engaging Humor', color: 'yellow' },
    { name: 'Dynamic Leadership', color: 'blue' },
    { name: 'Persuasive Influence', color: 'red' },
    { name: 'Innovative Planning', color: 'green' },
  ]}},
  'Level': { rich_text: {} },
  'Project': { rich_text: {} },
  'Club': { rich_text: {} },
  'Duration': { rich_text: {} },
  'Languages': { multi_select: { options: [
    { name: 'EN', color: 'blue' },
    { name: 'FR', color: 'red' },
    { name: 'ES', color: 'yellow' },
  ]}},
  'Humor Tone': { rich_text: {} },
  'Word of the Day': { rich_text: {} },
  'Delivery Date': { date: {} },
  'Evaluator': { rich_text: {} },
  'Google Doc': { url: {} },
  'Generated At': { date: {} },
};

const TRIPS_DB = {
  'Trip': { title: {} },
  'Origin': { rich_text: {} },
  'Destination': { rich_text: {} },
  'Duration (min)': { number: {} },
  'Threshold (min)': { number: {} },
  'Status': { select: { options: [
    { name: 'Scheduled', color: 'gray' },
    { name: 'Monitoring', color: 'blue' },
    { name: 'Go Now', color: 'green' },
    { name: 'Departed', color: 'default' },
  ]}},
  'Event ID': { rich_text: {} },
  'Logged At': { date: {} },
};

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('🔧 Creating Notion databases for Shah\'s Integration Hub...\n');

  const results = {};

  try {
    console.log('  Creating Tasks DB...');
    results.NOTION_TASKS_DB_ID = await createDatabase('📋 Tasks', TASKS_DB);
    console.log(`  ✓ Tasks: ${results.NOTION_TASKS_DB_ID}`);

    console.log('  Creating Financials DB...');
    results.NOTION_FINANCIALS_DB_ID = await createDatabase('💰 Financials', FINANCIALS_DB);
    console.log(`  ✓ Financials: ${results.NOTION_FINANCIALS_DB_ID}`);

    console.log('  Creating Reading Log DB...');
    results.NOTION_READING_DB_ID = await createDatabase('📚 Reading Log', READING_DB);
    console.log(`  ✓ Reading: ${results.NOTION_READING_DB_ID}`);

    console.log('  Creating Speech Log DB...');
    results.NOTION_SPEECH_LOG_DB_ID = await createDatabase('🎤 Speech Log', SPEECH_LOG_DB);
    console.log(`  ✓ Speech Log: ${results.NOTION_SPEECH_LOG_DB_ID}`);

    console.log('  Creating Trips DB...');
    results.NOTION_TRIPS_DB_ID = await createDatabase('🚗 Trips', TRIPS_DB);
    console.log(`  ✓ Trips: ${results.NOTION_TRIPS_DB_ID}`);

  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }

  console.log('\n✅ All databases created! Add these to your .env files:\n');
  console.log('# ── rest-api .env ──');
  console.log(`NOTION_TASKS_DB_ID=${results.NOTION_TASKS_DB_ID}`);
  console.log(`NOTION_FINANCIALS_DB_ID=${results.NOTION_FINANCIALS_DB_ID}`);
  console.log(`NOTION_READING_DB_ID=${results.NOTION_READING_DB_ID}`);
  console.log('');
  console.log('# ── voxaartisan .env ──');
  console.log(`NOTION_SPEECH_LOG_DB_ID=${results.NOTION_SPEECH_LOG_DB_ID}`);
  console.log('');
  console.log('# ── GoTime .env ──');
  console.log(`NOTION_TRIPS_DB_ID=${results.NOTION_TRIPS_DB_ID}`);
  console.log('');
  console.log('# ── All repos need ──');
  console.log(`NOTION_TOKEN=${NOTION_TOKEN.slice(0, 10)}...`);
}

main();
