import type { ReactNode } from "react";
import { whatsappUrl } from "@/lib/site";
import { ExternalArrow } from "./Arrow";

export function WhatsAppLink({
  children = "Talk to Yana",
  message,
  className = "button button--dark",
}: {
  children?: ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ExternalArrow />
    </a>
  );
}
