"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { DICT, LABEL, LOCALES, isLocale, type Locale } from "./dict";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = use(params);
  const locale: Locale = isLocale(raw) ? raw : "en";
  const t = DICT[locale];

  const [attrs, setAttrs] = useState("");
  const [theme, setTheme] = useState<string | null>(null);

  // Poll so you can watch the attribute vanish the instant you switch language.
  useEffect(() => {
    const read = () => {
      const el = document.documentElement;
      setAttrs([...el.attributes].map((a) => a.name).sort().join(", "));
      setTheme(el.getAttribute("data-theme"));
    };
    read();
    const id = setInterval(read, 100);
    return () => clearInterval(id);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("repro-theme", next);
    setTheme(next);
  };

  const themed = theme !== null;

  return (
    <main>
      <h1>{t.heading}</h1>

      <div className="row">
        <strong>{t.theme}:</strong>
        <button className="btn" onClick={toggle}>
          {theme === "dark" ? `☀︎ ${t.toLight}` : `☾ ${t.toDark}`}
        </button>
      </div>

      <div className="row">
        <strong>{t.language}:</strong>
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`/${l}`}
            className="btn"
            aria-current={l === locale ? "true" : undefined}
          >
            {LABEL[l]}
          </Link>
        ))}
      </div>

      <p className="attrs">
        {t.attrs}: <code>{attrs || "…"}</code>
      </p>

      <p className={`status ${themed ? "ok" : "bad"}`}>
        {themed ? `✅ ${t.ok}` : `❌ ${t.bad}`}
      </p>
      {!themed && <p style={{ color: "var(--muted)" }}>{t.note}</p>}

      <hr />
      <h2 style={{ fontSize: "1rem" }}>{t.steps}</h2>
      <ol>
        <li>{t.s1}</li>
        <li>{t.s2}</li>
        <li>{t.s3}</li>
        <li>{t.s4}</li>
      </ol>
    </main>
  );
}
