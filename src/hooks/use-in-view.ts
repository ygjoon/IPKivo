import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a referenced element has entered the viewport at least once
 * (or continuously when `once` is false).
 */
export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "0px",
  threshold = 0,
  once = true,
}: {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
} = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || (once && inView)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.some((entry) => entry.isIntersecting);
        if (once) {
          if (intersecting) {
            setInView(true);
            observer.disconnect();
          }
        } else {
          setInView(intersecting);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, once, rootMargin, threshold]);

  return { ref, inView } as const;
}
