"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through a list of words with a type-on / type-off effect,
 * used for the animated professional roles in the hero section.
 */
export function Typewriter({ words }: { words: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? word.slice(0, prev.length - 1)
              : word.slice(0, prev.length + 1)
          );
        },
        deleting ? 35 : 75
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return <span>{text}</span>;
}
