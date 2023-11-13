import fs from "fs";

import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";

type ResponseData = {
  message: string;
};

export async function POST(req: Request) {
  // read the body
  async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  }

  const data = await streamToString(req.body);
  console.log(data);
  // let data = await req.json();
  fs.writeFileSync("./data", data);
  return NextResponse.json({ message: "all good" });
}

export async function GET() {
  let data = fs.readFileSync("./data", "utf8");
  console.log(data);
  return NextResponse.json(data);
}
