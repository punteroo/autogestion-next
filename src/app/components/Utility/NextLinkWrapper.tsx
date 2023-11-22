"use client";

import Link from "next/link";

type NextLinkWrapperProps = {
  href: string;
  data?: any;
  disabled: boolean;
  children: React.ReactNode;
};

/**
 * Wraps the `next/link` component to enable disabling its usage based on a condition.
 */
export default function NextLinkWrapper({
  href,
  data,
  disabled,
  children,
}: NextLinkWrapperProps) {
  return disabled ? (
    children
  ) : (
    <Link
      href={
        data
          ? {
              pathname: href,
              query: {
                entry: Buffer.from(JSON.stringify(data)).toString("base64"),
              },
            }
          : href
      }
    >
      {children}
    </Link>
  );
}
