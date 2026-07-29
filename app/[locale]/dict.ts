export const LOCALES = ["en", "ja", "ko"] as const;
export type Locale = (typeof LOCALES)[number];
export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

export const LABEL: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
};

export const DICT = {
  en: {
    heading: "Switching locale wipes <html> attributes",
    theme: "Theme",
    toDark: "Switch to dark",
    toLight: "Switch to light",
    language: "Language",
    attrs: "<html> attributes",
    ok: "data-theme is present — the page is themed correctly.",
    bad: "data-theme is GONE — the page just reverted to light.",
    steps: "Steps to reproduce",
    s1: "Click “Switch to dark”. The page turns dark.",
    s2: "Click another language. This is a soft navigation — the document is NOT reloaded.",
    s3: "The page turns white and data-theme disappears. Going back does not restore it.",
    s4: "Hard-reload (Cmd/Ctrl-R): dark comes back, proving the inline script never re-runs on a soft navigation.",
    note: "Your choice is still in localStorage — it is the DOM attribute that was destroyed.",
  },
  ja: {
    heading: "言語切り替えで <html> の属性が消える",
    theme: "テーマ",
    toDark: "ダークにする",
    toLight: "ライトにする",
    language: "言語",
    attrs: "<html> の属性",
    ok: "data-theme があります — テーマは正しく適用されています。",
    bad: "data-theme が消えました — ライトに戻ってしまいました。",
    steps: "再現手順",
    s1: "「ダークにする」を押す。画面が暗くなる。",
    s2: "別の言語を押す。これはソフトナビゲーションで、ドキュメントは再読み込みされない。",
    s3: "画面が白くなり data-theme が消える。戻っても復元されない。",
    s4: "リロード（Cmd/Ctrl-R）するとダークに戻る — インラインスクリプトがソフトナビゲーションでは再実行されない証拠。",
    note: "選択自体は localStorage に残っている — 壊れたのは DOM の属性のほう。",
  },
  ko: {
    heading: "언어 전환 시 <html> 속성이 지워짐",
    theme: "테마",
    toDark: "다크로 전환",
    toLight: "라이트로 전환",
    language: "언어",
    attrs: "<html> 속성",
    ok: "data-theme 있음 — 테마가 정상 적용된 상태입니다.",
    bad: "data-theme 사라짐 — 방금 라이트로 되돌아갔습니다.",
    steps: "재현 절차",
    s1: "“다크로 전환”을 누른다. 화면이 어두워진다.",
    s2: "다른 언어를 누른다. 소프트 내비게이션이라 문서는 리로드되지 않는다.",
    s3: "화면이 하얘지고 data-theme이 사라진다. 되돌아가도 복구되지 않는다.",
    s4: "새로고침(Cmd/Ctrl-R)하면 다크로 돌아온다 — 인라인 스크립트가 소프트 내비게이션에서 재실행되지 않는다는 증거.",
    note: "선택 자체는 localStorage에 그대로 있다 — 파괴된 건 DOM 속성 쪽이다.",
  },
} as const;
