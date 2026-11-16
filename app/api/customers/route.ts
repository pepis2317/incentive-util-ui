import { NextRequest, NextResponse } from "next/server";
import { addCustomer, editCustomer, getCustomers } from "../endpoints";
import { editCustomerSchema } from "@/components/customers/create-edit-customer-schema";
import { GetCustomerParams } from "../types";
import { ApiError } from "../client";

export async function PUT(request: Request) {
  const json = await request.json()
  const parsed = editCustomerSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await editCustomer(parsed.data);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const json = await request.json()
  const parsed = editCustomerSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  try {
    const response = await addCustomer(parsed.data);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params: GetCustomerParams = {
    customer_query: searchParams.get("customer_query") ?? null,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    page_size: searchParams.has("page_size") ? Number(searchParams.get("page_size")) : 10
  }

  const customers = await getCustomers(params)
  return NextResponse.json(customers)
}
