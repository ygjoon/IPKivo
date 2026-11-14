import type { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

/**
 * Renders `children` only once the placeholder scrolls near the viewport, so
 * their queries and work start when someone is about to see them. Until then
 * `fallback` (usually a skeleton of the same size) holds the space.
 */
export function LazyMount({
  children,
  fallback = null,
  rootMargin = "0px",
  threshold = 0,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  /** How far outside the viewport to start, as in IntersectionObserver. */
  rootMargin?: string;
  /** Share of the placeholder that must be visible, 0 to 1. */
  threshold?: number;
  className?: string;
}) {
  const { ref, inView } = useInView({ rootMargin, threshold });
  return (
    <div ref={ref} className={className}>
      {inView ? children : fallback}
    </div>
  );
}
