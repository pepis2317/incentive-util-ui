import { deleteInvoiceSchema, editInvoiceSchema } from "@/components/invoices/edit-invoice-schema";
import { NextResponse } from "next/server";
import { addInvoice, deleteInvoice, editInvoice } from "../endpoints";
import { invoiceAddSchema } from "@/components/invoices/create-invoice-schema";
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
  const parsed = invoiceAddSchema.safeParse(json);

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

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = deleteInvoiceSchema.safeParse({
    id: searchParams.get("id"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await deleteInvoice(parsed.data.id);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
