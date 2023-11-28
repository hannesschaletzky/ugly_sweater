import { JsonDB, Config } from "node-json-db";

const db = new JsonDB(new Config("entries", true, false, "/"));

export async function upvote(name: string) {
  let entry: Entry = await getEntry(name);
  entry.upvotes++;
  saveEntry(entry);
}

export async function saveEntry(entry: Entry) {
  await db.push(`/${entry.name}`, entry);
}

export async function getAll() {
  return db.getData("/");
}

export async function deleteEntry(name: string) {
  return db.delete(`/${name}`);
}

export async function getEntry(name: string) {
  return db.getData(`/${name}`);
}

export async function exists(name: string) {
  return db.exists(`/${name}`);
}
