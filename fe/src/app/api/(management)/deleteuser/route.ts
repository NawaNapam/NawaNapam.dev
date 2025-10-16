import { NextResponse } from "next/server";

export async function DELETE(_req: Request) {
  return NextResponse.json(
    { message: "User deleted successfully", status: "yet to implement" },
    { status: 200 }
  );
}
