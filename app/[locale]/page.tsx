"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [attrs, setAttrs] = useState("(reading…)");

  useEffect(() => {
    const read = () =>
      setAttrs([...document.documentElement.attributes].map((a) => a.name).sort().join(", "));
    read();
    const id = setInterval(read, 200);
    return () => clearInterval(id);
  }, []);

  const other = locale === "ja" ? "ko" : "ja";
  const ok = attrs.includes("data-theme");

  return (
    <main style={{ font: "16px/1.6 system-ui", padding: 32 }}>
      <h1>locale: {locale}</h1>
      <p>
        <code>&lt;html&gt;</code> attributes: <b>{attrs}</b>
      </p>
      <p style={{ fontSize: 24 }}>{ok ? "✅ data-theme present" : "❌ data-theme GONE"}</p>
      <p>
        <Link href={`/${other}`}>→ switch locale to {other}</Link>
      </p>
      <hr />
      <ol>
        <li>Load <code>/ja</code>. You see <code>data-theme, lang</code> — ✅.</li>
        <li>Click &quot;switch locale&quot; (a soft navigation; the document is NOT reloaded).</li>
        <li><code>data-theme</code> is gone — ❌. Navigating back does not restore it.</li>
        <li>Hard-reload the page: it comes back, proving the inline script never re-runs on soft nav.</li>
      </ol>
    </main>
  );
}
