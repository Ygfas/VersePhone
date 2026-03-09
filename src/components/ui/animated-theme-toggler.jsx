import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.duration]
 */
export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef(null);

  // 1. Sinkronisasi awal dengan class 'dark' pada <html>
  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    // Cek apakah browser mendukung View Transitions API
    if (!document.startViewTransition || !buttonRef.current) {
      const newTheme = !isDark;
      document.documentElement.classList.toggle("dark");
      setIsDark(newTheme);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      });
    });

    // Tunggu sampai "pseudo-elements" transisi dibuat
    await transition.ready;

    // Jalankan animasi clip-path pada layer baru
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        // Menargetkan layer "baru" dari transisi halaman
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, duration]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent",
        className
      )}
      {...props}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};