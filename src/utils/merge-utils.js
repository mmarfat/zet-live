import { parse } from 'csv-parse/browser/esm/sync';

export function getBaseId(idStr) {
  return idStr.split('_')[0];
}

export async function fetchAndParseRoutesCSV() {
  try {
    const response = await fetch('/data/meta/routes.txt');
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }

    const csvText = await response.text();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    return records;
  } catch (error) {
    console.error('Error reading CSV:', error);
  }
}

export async function mergeData(entries) {
  const merged = new Map();
  const routeData = await fetchAndParseRoutesCSV();

  const routeMap = new Map(
    routeData.map((route) => [
      route.route_id,
      { type: route.route_type, long_name: route.route_long_name },
    ])
  );

  for (const entry of entries) {
    const baseId = getBaseId(entry.id);
    if (!merged.has(baseId)) {
      merged.set(baseId, { id: baseId });
    }

    const current = merged.get(baseId);

    if (entry.tripUpdate) {
      current.tripUpdate = entry.tripUpdate;
    }

    if (entry.vehicle) {
      current.vehicle = { ...(current.vehicle || {}), ...entry.vehicle };
    }

    if (entry.alert) {
      current.alerts = current.alerts || [];
      current.alerts.push(entry.alert);
    }

    if (current.tripUpdate?.trip && current.vehicle?.trip) {
      delete current.vehicle.trip;
    }

    const routeId =
      current.tripUpdate?.trip?.routeId ||
      current.vehicle?.trip?.routeId ||
      current.alert?.informedEntity?.[0]?.trip?.routeId;

    if (routeId) {
      const routeInfo = routeMap.get(routeId);
      if (routeInfo) {
        current.vehicle = {
          ...(current.vehicle || {}),
          routeType: routeInfo.type,
          routeLongName: routeInfo.long_name,
        };
      }
    }
  }

  return Array.from(merged.values());
}

