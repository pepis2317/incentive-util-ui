import { NextRequest, NextResponse } from "next/server"
import { getItemName } from "../../endpoints";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const itemName = await getItemName({ id })
  return NextResponse.json(itemName)
}
