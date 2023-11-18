import React from "react";
import { OrgControl } from "./_components/org-control";

export default function OrgIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
