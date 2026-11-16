import { editInvoiceSchema } from "@/components/invoices/edit-invoice-schema";
import { NextResponse } from "next/server";
import { addInvoice, editInvoice } from "../endpoints";
import { recordAddSchema } from "@/components/invoices/create-invoice-schema";
import { ApiError } from "../client";

export async function PUT(request: Request) {
  const json = await request.json()
  const parsed = editInvoiceSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await editInvoice(parsed.data);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = recordAddSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await addInvoice(parsed.data);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to add invoice" }, { status: 500 });
  }
}
