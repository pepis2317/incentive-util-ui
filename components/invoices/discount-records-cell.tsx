import { DiscountRecord } from "@/app/api/types";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

const formatDiscount = (index: number, discountRecord: DiscountRecord) => {
  const { type, value } = discountRecord
  const isNegative = value < 0;

  const displayValue = index > 0 ? Math.abs(value) : value;
  const formattedValue =
    type === "flat"
      ? `Rp. ${currencyFormatter.format(displayValue)}`
      : `${displayValue}%`;

  const separator = index > 0 ? (isNegative ? " - " : " + ") : "";

  return `${separator}${formattedValue}`;
}

export function DiscountRecordsCell({ discountRecords }: { discountRecords: DiscountRecord[] }) {
  return (
    <div className="flex gap-2">
      <span>
        {discountRecords.map((discount, i) => (
          <span key={discount.id}>
            {formatDiscount(i, discount)}
          </span>
        ))}
      </span >
    </div>
  )
}
