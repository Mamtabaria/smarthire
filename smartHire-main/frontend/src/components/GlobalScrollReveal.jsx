import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTOR = "section, article, [data-reveal]";

function GlobalScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter(
      (node) => !node.closest("header, nav, aside")
    );

    if (prefersReducedMotion) {
      nodes.forEach((node) => node.classList.add("reveal-visible"));
      return undefined;
    }

    let staggerIndex = 0;
    nodes.forEach((node) => {
      if (!node.classList.contains("reveal-visible")) {
        node.classList.add("reveal-init");
      }
      if (!node.style.getPropertyValue("--reveal-delay")) {
        node.style.setProperty("--reveal-delay", `${Math.min(staggerIndex, 8) * 70}ms`);
        staggerIndex += 1;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          entry.target.classList.remove("reveal-init");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}

export default GlobalScrollReveal;
