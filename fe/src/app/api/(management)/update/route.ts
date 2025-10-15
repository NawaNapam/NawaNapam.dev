import { NextResponse } from "next/server";

export async function UPDATE(req: Request) {
  return NextResponse.json(
    { message: "Update route - yet to implement", status: "yet to implement" },
    { status: 200 }
  );
}
