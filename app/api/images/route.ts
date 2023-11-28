import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import { save, exists, getAll } from "@/app/db";

declare global {
  interface String {
    arrayBuffer: () => Promise<Buffer>;
  }

  interface String {
    name: String;
  }
}

var dir = path.join(process.cwd(), "uploads");

// https://stackoverflow.com/questions/72663673/how-do-i-get-uploaded-image-in-next-js-and-save-it
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const user = formData.get("user") as string;
  if (file && user) {
    if (await exists(user)) {
      return NextResponse.json({
        message: `${user} already exists`,
        status: 400,
      });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${user}_${Date.now()}_${file.name.replaceAll(" ", "_")}`;
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await fs.writeFileSync(path.join(dir, filename), buffer);
      // let url = "";
      // if (process.env.NODE_ENV == "development") {
      //   url = `localhost:3000/api/images?filename=${filename}`;
      // } else if (process.env.NODE_ENV == "production") {
      //   url = `ugly.hschaletzky.de/api/images?filename=${filename}`;
      // }
      save(user, filename);
      const allEntries = getAll();
      return NextResponse.json({
        message: allEntries,
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Failed", status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "Photo and username required" },
      { status: 400 }
    );
  }
}

export async function GET(req: any) {
  console.log(req.nextUrl.searchParams);
  if (req.nextUrl.searchParams.get("filename") == null) {
    return NextResponse.json("filename query param required", {
      status: 400,
    });
  }
  const filename = req.nextUrl.searchParams.get("filename") as string;
  const filePath = path.join(dir, filename);
  const buffer = fs.readFileSync(filePath);
  const imgBase64 = buffer.toString("base64");
  return NextResponse.json(imgBase64, {
    status: 200,
  });
}
