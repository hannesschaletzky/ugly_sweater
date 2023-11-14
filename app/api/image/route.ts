import path from "path";
import fs from "fs";

import { NextResponse } from "next/server";

// I NEED DECLARATION MERGING
interface FormDataEntryValue {
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const user = formData.get("user");
  if (file && user) {
    console.log(file);
    console.log(user);

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    console.log(filename);
    try {
      await fs.writeFileSync(
        path.join(process.cwd(), "public/uploads/" + filename),
        buffer
      );
      return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
      console.log("Error occured ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }

    fs.writeFileSync(`./uploads/${Date.now()}`, file[0].buffer);
    return NextResponse.json({ message: "all good" }, { status: 201 });
  } else {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
}

export async function GET() {
  let data = fs.readFileSync("./data", "utf8");
  console.log(data);
  return NextResponse.json(data);
}
