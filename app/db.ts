import { JsonDB, Config } from "node-json-db";

const db = new JsonDB(new Config("entries", true, false, "/"));

export async function save(name: string, filename: string) {
  await db.push(`/${name}`, { name: name, filename: filename, upvotes: 0 });
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
