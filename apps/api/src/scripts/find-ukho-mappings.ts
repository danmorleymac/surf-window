import "dotenv/config";

const UKHO_TIDAL_API_URL = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1";

const searches = [
  // Joss Bay
  "Ramsgate",
  "Margate",
  "Broadstairs",

  // Eastbourne
  "Eastbourne",

  // East Wittering / Bracklesham
  "Selsey",
  "Chichester",

  // Kimmeridge
  "Swanage",
  "Poole",
  "Weymouth",
];
async function main() {
  const apiKey = process.env.UKHO_TIDAL_API_KEY;

  if (!apiKey) {
    throw new Error("UKHO_TIDAL_API_KEY is not configured");
  }

  for (const search of searches) {
    const response = await fetch(
      `${UKHO_TIDAL_API_URL}/Stations?name=${encodeURIComponent(search)}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      console.log(`${search}: request failed (${response.status})`);
      continue;
    }

    const data = await response.json();

    console.log(`\n${search}`);
    console.dir(data, { depth: null });
  }
}

void main();
