import { upvote } from "@/app/db";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  if (req.nextUrl.searchParams.get("name") == null) {
    return NextResponse.json("name query param required", {
      status: 400,
    });
  }
  const name = req.nextUrl.searchParams.get("name") as string;
  try {
    await upvote(name);
    return NextResponse.json({
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, {
      status: 400,
    });
  }
}
