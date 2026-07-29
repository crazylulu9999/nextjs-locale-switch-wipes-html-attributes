# Switching locale wipes imperatively-set `<html>` attributes (App Router)

Minimal reproduction. No Tailwind, no i18n library, no theme library — just the
**officially documented** App Router i18n layout, three locales, and a dark-mode toggle.

```bash
npm install
npm run dev      # http://localhost:3333  (redirects to /en)
```

## Steps to reproduce

1. Open <http://localhost:3333> — it redirects to `/en`. Locales are `/en`, `/ja`, `/ko`.
2. Click **“Switch to dark”**. The page turns dark.
3. Click another language (`日本語` / `한국어`). This is a `next/link` soft navigation —
   the document is **not** reloaded.
4. **The page visibly turns white** and `<html> attributes` loses `data-theme`. Going back
   does not restore it. Your choice is still in `localStorage` — it is the DOM attribute
   that was destroyed.
5. Hard-reload: dark comes back, proving the inline script never re-runs on a soft navigation.

## Expected vs actual

**Expected:** an attribute React does not own should survive a client-side navigation, exactly as it
survives on a plain page load.

**Actual:** it is permanently destroyed on every locale switch. In a real app this is a dark-mode
theme (`data-theme` / `class="dark"`) set by a pre-hydration FOUC-prevention script, so the page
silently reverts to light on every language change.

## Why it happens

`app/[locale]/layout.tsx` is the root layout — this is the pattern
[the Next.js docs prescribe](https://nextjs.org/docs/app/guides/internationalization) — so `<html>`
lives *inside* the `[locale]` segment. You can see it in the RSC payload
(`.next/server/app/ko.rsc`) as a row belonging to that segment:

```
0:{"P":null,"c":["","ko"],...,"f":[[["",{"children":[["locale","ko","d",[]], ...
   ["$","html",null,{"lang":"ko","suppressHydrationWarning":true,"children" ...
```

Two pieces of Next.js then disagree about whether the segment's *value* matters:

- `is-navigating-to-new-root-layout.ts` compares the dynamic segment's **name** and **type** and
  deliberately **ignores the value** — so `ja → ko` is a soft navigation, no document reload, and
  the inline `<script>` never runs again.
- `create-router-cache-key.ts` **includes the value**:
  ```ts
  if (Array.isArray(segment)) {
    return `${segment[0]}|${segment[1]}|${segment[2]}`   // "locale|ja|d"  vs  "locale|ko|d"
  }
  ```
  and `layout-router.tsx` passes that string as the React `key`.

So the root layout is simultaneously "the same root layout" (no reload) and "a different subtree"
(full remount). React then remounts `<html>`, which is a Host Singleton, and
`acquireSingletonInstance()` removes every attribute before restoring only React's own props
(`lang`) — destroying `data-theme`.

Note the inline script **cannot** repair this: React builds every `<script>` via `div.innerHTML`,
which sets the HTML spec's *already started* flag, so a client-created script never executes.

Framework-free React reproduction of the second half:
**https://github.com/crazylulu9999/react-singleton-attribute-wipe-repro**

## Prior reports of the symptom (mechanism never identified)

- [amannn/next-intl#370](https://github.com/amannn/next-intl/discussions/370) (2023) — *"when I change language, all attributes in `html` tag will be remove"*
- [pacocoursey/next-themes#199](https://github.com/pacocoursey/next-themes/issues/199) — open since 2023-08
- [amannn/next-intl#1867](https://github.com/amannn/next-intl/issues/1867) — closed, *"I'm not aware of anything that next-intl could do to help here"*

## Versions

`next@16.3.0-canary.102`, `react@19.2.8`, `react-dom@19.2.8`, Node 25.

## Notes on the repro's shape

- There is deliberately **no `app/page.tsx`**. Adding one would require an `app/layout.tsx`,
  which would move `<html>` above the `[locale]` segment — and the bug would disappear.
  `/` is handled by a `redirects()` entry in `next.config.mjs` instead; a real app would pick
  the locale from `Accept-Language` in `proxy.ts`/`middleware.ts`.
- The dark palette hangs entirely off `html[data-theme="dark"]` in `app/globals.css`, the same
  way Tailwind's `dark:` variant and `next-themes`' `attribute="class"` do. That is why losing
  one attribute repaints the whole page.
