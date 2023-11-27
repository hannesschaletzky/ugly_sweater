import { NextResponse } from "next/server";
import { getAll, deleteEntry } from "@/app/db";

export async function GET() {
  const entries = await getAll();
  return NextResponse.json(entries, {
    status: 200,
  });
}

export async function DELETE(req: any) {
  const name = req.nextUrl.searchParams.get("name") as string;
  try {
    await deleteEntry(name);
    return NextResponse.json({
      status: 200,
      message: "deleted entry",
    });
  } catch (e: any) {
    return NextResponse.json({
      status: 400,
      message: e,
    });
  }
}
