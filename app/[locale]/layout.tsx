import "../globals.css";
import { LOCALES, isLocale } from "./dict";

// NOTE: there is intentionally NO app/layout.tsx.
// The [locale] segment IS the root layout — the pattern the Next.js docs prescribe:
// https://nextjs.org/docs/app/guides/internationalization
// Adding app/layout.tsx would move <html> above the [locale] segment and the bug
// would disappear (at the cost of no longer being able to server-render lang={locale}).
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Stand-in for any theme library's FOUC-prevention script (next-themes and friends
// all do this). It runs once, while the browser parses the server HTML, and sets an
// attribute on <html> that React does not own.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('repro-theme');
if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "en";
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
