import { deleteTransactionSchema, editTransactionSchema } from "@/components/invoices/edit-transaction-schema";
import { addTransaction, deleteTransaction, editTransaction } from "../endpoints";
import { NextResponse } from "next/server";
import { addTransactionSchema } from "@/components/invoices/add-transaction-schema";
import { ApiError } from "../client";

export async function PUT(request: Request) {
  const json = await request.json()
  const parsed = editTransactionSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await editTransaction(parsed.data);
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
  const parsed = addTransactionSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await addTransaction(parsed.data);
    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, detail: e.detail },
        { status: e.status ?? 500 }
      );
    }
    console.error(e)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = deleteTransactionSchema.safeParse({
    id: searchParams.get("id"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const response = await deleteTransaction(parsed.data.id);
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
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
