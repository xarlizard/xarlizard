#!/usr/bin/env node
/**
 * Assembles README.md from translation fragments.
 * GitHub profile READMEs cannot dynamically import files at render time —
 * each language is a separate assembled README linked from the language bar.
 *
 * Edit translations/i18n.json, then run: node scripts/build-readme.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const translationsDir = path.join(root, 'translations');

// en, es, nl + requested + pt/hi/id (top speaker counts not already covered)
const LANGS = ['en', 'es', 'nl', 'ru', 'zh', 'ja', 'ar', 'it', 'fr', 'ca', 'de', 'pt', 'hi', 'id', 'ko', 'he', 'tr'];

const LANG_LABELS = {
  en: 'EN',
  es: 'ES',
  nl: 'NL',
  ru: 'RU',
  zh: 'ZH',
  ja: 'JA',
  ar: 'AR',
  it: 'IT',
  fr: 'FR',
  ca: 'CA',
  de: 'DE',
  pt: 'PT',
  hi: 'HI',
  id: 'ID',
  ko: 'KO',
  he: 'HE',
  tr: 'TR',
};

const i18n = JSON.parse(fs.readFileSync(path.join(translationsDir, 'i18n.json'), 'utf8'));

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getLangPath(fromLang, toLang) {
  if (fromLang === 'en' && toLang === 'en') return 'README.md';
  if (fromLang === 'en') return `translations/${toLang}/README.md`;
  if (toLang === 'en') return '../../README.md';
  if (fromLang === toLang) return 'README.md';
  return `../${toLang}/README.md`;
}

function langBar(activeLang) {
  const links = LANGS.map((code) => {
    const label = LANG_LABELS[code];
    const text = code === activeLang ? `<b><u>${label}</u></b>` : `<b>${label}</b>`;
    return `<a href="${getLangPath(activeLang, code)}">${text}</a>`;
  });

  return `<p align="center">\n${links.join('\n&nbsp;&nbsp;\n')}\n</p>\n<br/>\n`;
}

function renderAbout(t) {
  const dir = t.dir ? ` dir="${t.dir}"` : '';
  return `<h2 align="center"><b>${t.about_title}</b></h2>

<div${dir}>
<p>${t.about_intro}</p>

<p>
<a href="https://linkedin.com/in/charlie-rios"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
<img src="https://gitviews.com/user/xarlizard.svg" alt="${t.profile_views_alt}"/>
</p>

<p>${t.about_body}</p>

<p><strong>${t.about_brings_label}</strong> ${t.about_brings}</p>
</div>

<br/><br/>
`;
}

function renderFeatured(t) {
  return `<h2 align="center"><b>${t.featured_title}</b></h2>

<img src="https://raw.githubusercontent.com/token-bar/token-bar/main/.github/icon-cropped.png" width="200" alt="Token Bar" align="left"/>
<a href="https://github.com/token-bar/token-bar/releases"><img src="https://raw.githubusercontent.com/token-bar/token-bar/main/.github/macos_badge_noborder.png" width="175" alt="${t.download_mac_alt}" align="right"/></a>

<div>
<h3><a href="https://github.com/token-bar/token-bar">Token Bar</a></h3>
<p>
<img src="https://img.shields.io/badge/Swift-F54A2A?style=flat&logo=swift&logoColor=white" alt="Swift"/>
<img src="https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white" alt="macOS"/>
</p>
<p>${t.token_bar_desc}</p>
<p>
<a href="https://token-bar.pages.dev/"><img src="https://img.shields.io/badge/LIVE_DEMO-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Live Demo"/></a>
<a href="https://github.com/token-bar/token-bar"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>
</div>

<br/><br/>

<img src="https://raw.githubusercontent.com/xarlizard/email-signature-editor/main/.github/icon-cropped.png" width="200" alt="Email Signature Editor" align="left"/>

<div>
<h3><a href="https://github.com/xarlizard/email-signature-editor">Email Signature Editor</a></h3>
<p>
<img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=radix-ui&logoColor=white" alt="shadcn/ui"/>
<img src="https://img.shields.io/badge/Import_from_LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"/>
</p>
<p>${t.email_sig_desc}</p>
<p>
<a href="https://email-signature-editor.pages.dev/"><img src="https://img.shields.io/badge/LIVE_DEMO-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Live Demo"/></a>
<a href="https://github.com/xarlizard/email-signature-editor"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>
</div>

<br/><br/>

<h3><b>CarBnB</b></h3>
<div>
<p>
<a href="https://carbnb.netlify.app/"><img src="https://img.shields.io/badge/LOVABLE-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Lovable"/></a>
<a href="https://carbnb-v0.netlify.app/"><img src="https://img.shields.io/badge/VERCEL_V0-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="V0"/></a>
</p>
<p>${t.carbnb_desc}</p>
</div>

<br/><br/>
`;
}

function renderOss(t) {
  return `<h2 align="center"><b>${t.oss_title}</b></h2>

| ${t.oss_col_package} | ${t.oss_col_npm} | ${t.oss_col_desc} |
| --- | --- | --- |
| [**lizard-ui**](https://www.npmjs.com/package/lizard-ui) | <a href="https://www.npmjs.com/package/lizard-ui"><img src="https://img.shields.io/npm/v/lizard-ui?style=flat-square&logo=npm" alt="npm"/></a> | ${t.lizard_ui_desc} |
| [**responsive-panel**](https://www.npmjs.com/package/responsive-panel) | <a href="https://www.npmjs.com/package/responsive-panel"><img src="https://img.shields.io/npm/v/responsive-panel?style=flat-square&logo=npm" alt="npm"/></a> | ${t.responsive_panel_desc} |
| [**react-api-forge**](https://www.npmjs.com/package/react-api-forge) | <a href="https://www.npmjs.com/package/react-api-forge"><img src="https://img.shields.io/npm/v/react-api-forge?style=flat-square&logo=npm" alt="npm"/></a> | ${t.react_api_forge_desc} |
| [**react-temporal**](https://www.npmjs.com/package/@xarlizard/react-temporal) | <a href="https://www.npmjs.com/package/@xarlizard/react-temporal"><img src="https://img.shields.io/npm/v/@xarlizard/react-temporal?style=flat-square&logo=npm" alt="npm"/></a> | ${t.react_temporal_desc} |
| [**npm-package-template**](https://www.npmjs.com/package/@xarlizard/npm-package-template) | <a href="https://www.npmjs.com/package/@xarlizard/npm-package-template"><img src="https://img.shields.io/npm/v/@xarlizard/npm-package-template?style=flat-square&logo=npm" alt="npm"/></a> | ${t.npm_package_template_desc} |

<br/><br/>
`;
}

function titledSection(t, titleKey, fragmentPath) {
  return `<h2 align="center"><b>${t[titleKey]}</b></h2>\n${read(fragmentPath).trim()}\n`;
}

function donateSection(lang) {
  const t = i18n[lang];
  const button = read(path.join(translationsDir, 'shared/donate.html')).trim();
  return `<h2 align="center"><b>${t.donate_title}</b></h2>\n${button}\n`;
}

function buildLanguage(lang) {
  const t = i18n[lang];
  const sharedDir = path.join(translationsDir, 'shared');

  if (!t) {
    throw new Error(`Missing translations for language: ${lang}`);
  }

  const parts = [
    langBar(lang),
    renderAbout(t),
    renderFeatured(t),
    renderOss(t),
    titledSection(t, 'tech_stack_title', path.join(sharedDir, 'tech-stack.html')),
    '<br/><br/>\n',
    titledSection(t, 'github_stats_title', path.join(sharedDir, 'stats.html')),
    '<br/><br/>\n',
    titledSection(t, 'github_trophies_title', path.join(sharedDir, 'trophies.html')),
    '<br/><br/>\n',
    donateSection(lang),
    '\n<!-- Proudly created with GPRM ( https://gprm.itsvg.in ). Isometric contribution chart by https://github.com/colincode0/isonometric-github-contributions-chart (forked at xarlizard/isonometric-github-contributions-chart). -->\n',
  ];

  return parts.join('\n');
}

function writeOutput(lang, content) {
  const outputPath =
    lang === 'en'
      ? path.join(root, 'README.md')
      : path.join(translationsDir, lang, 'README.md');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
}

for (const lang of LANGS) {
  writeOutput(lang, buildLanguage(lang));
}
