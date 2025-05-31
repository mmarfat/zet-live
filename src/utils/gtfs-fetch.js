import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const isProd = import.meta.env.PROD;

export async function fetchGTFS() {
  const url = isProd
    ? "https://www.zet.hr/gtfs-rt-protobuf"
    : "/gtfs"; // Vite proxy in dev

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/x-protobuf',
      },
    });

    if (response.status !== 200) {
      throw new Error(`❌ Network error: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    let feed;
    try {
      feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    } catch (decodeErr) {
      throw new Error(`❌ Failed to decode protobuf: ${decodeErr.message}`);
    }

    return feed;
  } catch (err) {
    console.error(err.message);
  }
}
