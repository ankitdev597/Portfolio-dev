"use client";

import { useState, type ReactNode } from "react";

interface LoadMoreGridProps<T> {
  items: T[];
  /** How many cards to show before Load more */
  initialCount?: number;
  /** How many to reveal per click */
  step?: number;
  /** Unique key for each item */
  getKey: (item: T) => string;
  /** 2-col or 3-col grid — default 2 for even rows */
  columns?: 2 | 3;
  renderItem: (item: T, index: number) => ReactNode;
  moreLabel?: string;
  lessLabel?: string;
}

/**
 * Equal-row card grid with progressive reveal.
 * Defaults to 2 columns so every row stays full (no orphan card).
 */
export default function LoadMoreGrid<T>({
  items,
  initialCount = 6,
  step = 6,
  getKey,
  columns = 2,
  renderItem,
  moreLabel = "Load more",
  lessLabel = "Show less",
}: LoadMoreGridProps<T>) {
  const [visible, setVisible] = useState(Math.min(initialCount, items.length));
  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;
  const canCollapse = visible > initialCount && items.length > initialCount;

  const gridClass =
    columns === 3
      ? "grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "section-card-grid-2 !mt-0";

  return (
    <div>
      <div className={gridClass}>
        {shown.map((item, i) => (
          <div key={getKey(item)} className="h-full">
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {(hasMore || canCollapse) && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {hasMore && (
            <button
              type="button"
              className="btn-primary !px-8"
              onClick={() => setVisible((v) => Math.min(v + step, items.length))}
            >
              {moreLabel}
              <span className="ml-2 text-white/70">
                ({items.length - visible} more)
              </span>
            </button>
          )}
          {canCollapse && (
            <button
              type="button"
              className="btn-secondary !px-8"
              onClick={() => setVisible(initialCount)}
            >
              {lessLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
