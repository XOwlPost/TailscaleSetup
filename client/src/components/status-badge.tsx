import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";

const statusVariants = cva("", {
  variants: {
    status: {
      online: "bg-green-500/20 text-green-700",
      offline: "bg-red-500/20 text-red-700",
      pending: "bg-yellow-500/20 text-yellow-700"
    }
  },
  defaultVariants: {
    status: "pending"
  }
});

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusVariants({ status: status as "online" | "offline" | "pending" })}>
      {status}
    </Badge>
  );
}
