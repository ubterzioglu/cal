import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Bir kez göründükten sonra gözlemlemeyi bırak (varsayılan: true) */
  once?: boolean;
  /** Tetikleme eşiği (varsayılan: 0.15) */
  threshold?: number;
  /** rootMargin (varsayılan: alttan biraz erken tetiklenmesi için) */
  rootMargin?: string;
}

/**
 * Bir elemanı IntersectionObserver ile gözlemler ve viewport'a girince `true` döner.
 * Scroll-in animasyonları için kullanılır. Yeni bağımlılık gerektirmez.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): { ref: React.RefObject<T>; inView: boolean } {
  const { once = true, threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // IntersectionObserver desteklenmiyorsa içeriği gizlememek için görünür say.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, inView };
}
