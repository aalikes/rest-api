export function mapRow(row, fields) {
  if (!row) return null;
  const result = {};
  for (const [key, config] of Object.entries(fields)) {
    const sqlKey = config.column || key;
    let val = row[sqlKey];
    if (config.boolean) val = val === 1;
    result[key] = val;
  }
  return result;
}
