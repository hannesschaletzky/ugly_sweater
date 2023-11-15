import path from "path";
import fs from "fs";

import { NextResponse } from "next/server";

var dir = path.join(process.cwd(), "public/uploads");

declare global {
  interface String {
    arrayBuffer: () => Promise<Buffer>;
  }

  interface String {
    name: String;
  }
}

// https://stackoverflow.com/questions/72663673/how-do-i-get-uploaded-image-in-next-js-and-save-it
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const user = formData.get("user");
  if (file && user) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${user}_${Date.now()}_${file.name.replaceAll(" ", "_")}`;
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      await fs.writeFileSync(path.join(dir, filename), buffer);
      const url = `localhost:3000/uploads/${filename}`;
      return NextResponse.json({ Message: url, status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "Photo and username required" },
      { status: 400 }
    );
  }
}

export async function GET() {
  // const files = getFiles(dir);
  // console.log(files);
  return NextResponse.json("files");
}

// function getFiles(dir: fs.PathLike, files = []) {
//   const fileList = fs.readdirSync(dir);
//   for (const file of fileList) {
//     const name = `${dir}/${file}`;
//     if (fs.statSync(name).isDirectory()) {
//       getFiles(name, files);
//     } else {
//       files.push(name);
//     }
//   }
//   return files;
// }
