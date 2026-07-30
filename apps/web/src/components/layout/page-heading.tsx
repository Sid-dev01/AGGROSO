import type { ReactNode } from "react";

type PageHeadingProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeading({
  title,
  description,
  actions,
}: PageHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
