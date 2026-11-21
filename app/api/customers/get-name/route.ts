import { NextRequest, NextResponse } from "next/server"
import { getCustomerName } from "../../endpoints";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 })
  }

  const itemName = await getCustomerName({ id })
  return NextResponse.json(itemName)
}
