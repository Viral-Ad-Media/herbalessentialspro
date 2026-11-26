/**
 * Re-imports every post in content/posts, overwriting posts with the same slug.
 *   npm run db:seed
 */
import "dotenv/config";
import { createDb } from "../src/db";
import { seed } from "../src/db/seed-data";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

seed(createDb(url), { overwrite: true })
  .then((n) => {
    console.log(`Seeded ${n} posts.`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
