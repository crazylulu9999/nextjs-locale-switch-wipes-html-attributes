/** @type {import('next').NextConfig} */
export default {
  // "/" is not content, just an entry point. A real app would pick the locale from
  // Accept-Language in proxy.ts/middleware.ts; a static redirect keeps this repro minimal.
  //
  // NOTE: we deliberately do NOT add app/page.tsx here. That would require an
  // app/layout.tsx, which would make [locale] stop being the root layout — and the
  // bug would disappear. Keeping [locale] as the root layout is the whole point.
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};
