// NOTE: there is intentionally NO app/layout.tsx.
// This is the official Next.js i18n pattern: the [locale] segment IS the root layout.
// https://nextjs.org/docs/app/guides/internationalization
export function generateStaticParams() {
  return [{ locale: "ja" }, { locale: "ko" }];
}

// Stand-in for any theme library's FOUC-prevention script (next-themes, etc.).
// It sets an attribute on <html> before hydration.
const INIT = `document.documentElement.setAttribute('data-theme','dark')`;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
