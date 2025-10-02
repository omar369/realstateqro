import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function PropertyLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

