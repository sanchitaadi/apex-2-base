
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";

const oldUrl = process.env.OLD_SUPABASE_URL;
const oldKey = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY;
const newUrl = process.env.NEW_SUPABASE_URL;
const newKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY;

if (!oldUrl || !oldKey || !newUrl || !newKey) {
  throw new Error("Missing transfer environment variables.");
}

const oldDb = createClient(oldUrl, oldKey);
const newDb = createClient(newUrl, newKey);

const output = [];

const { data: buckets, error: bucketError } =
  await oldDb.storage.listBuckets();

if (bucketError) throw bucketError;

for (const bucket of buckets) {
  const { data: files, error } =
    await oldDb.storage.from(bucket.name).list("", {
      limit: 100,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.error(`Could not list ${bucket.name}: ${error.message}`);
    continue;
  }

  output.push({
    bucket: bucket.name,
    firstPageItems: files.length,
    note: "Inventory only; nested folders and pagination need checking."
  });
}

await fs.writeFile(
  "storage-inventory.json",
  JSON.stringify(output, null, 2)
);

console.log("Inventory saved to storage-inventory.json");
console.log(output);
