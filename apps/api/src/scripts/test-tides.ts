import { getTidalEvents } from "../clients/ukho-tidal-client.js";
import "dotenv/config";

async function main() {
  const events = await getTidalEvents("0536");
  console.log(events);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
