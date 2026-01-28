import { log } from "node:console";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FloatingAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FloatingAutocomplete({
  inputRef,
  open,
  children,
  className = "",
}: FloatingAutocompleteProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !inputRef.current) return;

    const update = () => {
      const coords = getCaretCoordinates(inputRef.current!);
      if (coords) setPos(coords);
    };

    update();

    const input = inputRef.current;
    input.addEventListener("input", update);
    input.addEventListener("keyup", update);
    input.addEventListener("click", update);

    return () => {
      input.removeEventListener("input", update);
      input.removeEventListener("keyup", update);
      input.removeEventListener("click", update);
    };
  }, [open, inputRef]);

  if (!open || !pos) return null;
  return createPortal(
    <div
      ref={divRef}
      style={{
        position: "fixed",
        left: pos.x + (divRef.current?.offsetWidth! || 168),
        top: pos.y - 60,
        transform: "translate(-50%, -100%)",
        zIndex: 50,
      }}
      className={`
        pointer-events-auto
        rounded-md bg-dark
        ${className}
      `}
    >
      {children}
    </div>,
    document.body,
  );
}

export function getCaretCoordinates(
  input: HTMLInputElement,
): { x: number; y: number } | null {
  const { selectionStart } = input;
  if (selectionStart === null) return null;

  const mirror = document.createElement("div");
  const span = document.createElement("span");

  const style = window.getComputedStyle(input);

  // Copy relevant styles
  mirror.style.position = "fixed";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.font = style.font;
  mirror.style.padding = style.padding;
  mirror.style.border = style.border;
  mirror.style.width = style.width;
  mirror.style.lineHeight = style.lineHeight;

  mirror.textContent = input.value.slice(0, selectionStart);
  span.textContent = input.value.slice(selectionStart) || ".";

  mirror.appendChild(span);
  document.body.appendChild(mirror);

  const rect = span.getBoundingClientRect();
  document.body.removeChild(mirror);

  return {
    x: rect.left,
    y: rect.top,
  };
}
