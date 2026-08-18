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

// shields.io no longer renders logo=linkedin; embed the icon as base64 instead.
const LINKEDIN_ICON_B64 =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2MtMS4xNDQgMC0yLjA2My0uOTI2LTIuMDYzLTIuMDY1IDAtMS4xMzguOTItMi4wNjMgMi4wNjMtMi4wNjMgMS4xNCAwIDIuMDY0LjkyNSAyLjA2NCAyLjA2MyAwIDEuMTM5LS45MjUgMi4wNjUtMi4wNjQgMi4wNjV6bTEuNzgyIDEzLjAxOUgzLjU1NVY5aDMuNTY0djExLjQ1MnpNMjIuMjI1IDBIMS43NzFDLjc5MiAwIDAgLjc3NCAwIDEuNzI5djIwLjU0MkMwIDIzLjIyNy43OTIgMjQgMS43NzEgMjRoMjAuNDUxQzIzLjIgMjQgMjQgMjMuMjI3IDI0IDIyLjI3MVYxLjcyOUMyNCAuNzc0IDIzLjIgMCAyMi4yMjIgMGguMDAzeiIvPjwvc3ZnPg==';
const LINKEDIN_LOGIN_BADGE = `https://img.shields.io/badge/LinkedIn_login-0A66C2?style=flat&logo=data:image/svg+xml;base64,${LINKEDIN_ICON_B64}`;

// shields.io has no built-in globe logo; embed a web/globe icon as base64 instead.
const WEB_GLOBE_ICON_B64 =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMS45OSAyQzYuNDcgMiAyIDYuNDggMiAxMnM0LjQ3IDEwIDkuOTkgMTBDMTcuNTIgMjIgMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMS45OSAyem02LjkzIDZoLTIuOTVhMTUuNjUgMTUuNjUgMCAwIDAtMS4zOC0zLjU2QTguMDMgOC4wMyAwIDAgMSAxOC45MiA4ek0xMiA0LjA0Yy44MyAxLjIgMS40OCAyLjUzIDEuOTEgMy45NmgtMy44MmMuNDMtMS40MyAxLjA4LTIuNzYgMS45MS0zLjk2ek00LjI2IDE0QzQuMSAxMy4zNiA0IDEyLjY5IDQgMTJzLjEtMS4zNi4yNi0yaDMuMzhjLS4wOC42Ni0uMTQgMS4zMi0uMTQgMiAwIC42OC4wNiAxLjM0LjE0IDJINC4yNnptLjgyIDJoMi45NWMuMzIgMS4yNS43OCAyLjQ1IDEuMzggMy41NkE3Ljk4NyA3Ljk4NyAwIDAgMSA1LjA4IDE2em0yLjk1LThINS4wOGE3Ljk4NyA3Ljk4NyAwIDAgMSA0LjMzLTMuNTZBMTUuNjUgMTUuNjUgMCAwIDAgOC4wMyA4ek0xMiAxOS45NmMtLjgzLTEuMi0xLjQ4LTIuNTMtMS45MS0zLjk2aDMuODJjLS40MyAxLjQzLTEuMDggMi43Ni0xLjkxIDMuOTZ6TTE0LjM0IDE0SDkuNjZjLS4wOS0uNjYtLjE2LTEuMzItLjE2LTIgMC0uNjguMDctMS4zNS4xNi0yaDQuNjhjLjA5LjY1LjE2IDEuMzIuMTYgMiAwIC42OC0uMDcgMS4zNC0uMTYgMnptLjI1IDUuNTZjLjYtMS4xMSAxLjA2LTIuMzEgMS4zOC0zLjU2aDIuOTVhOC4wMyA4LjAzIDAgMCAxLTQuMzMgMy41NnpNMTYuMzYgMTRjLjA4LS42Ni4xNC0xLjMyLjE0LTIgMC0uNjgtLjA2LTEuMzQtLjE0LTJoMy4zOGMuMTYuNjQuMjYgMS4zMS4yNiAycy0uMSAxLjM2LS4yNiAyaC0zLjM4eiIvPjwvc3ZnPg==';

const WEB_LINK_BADGE_COLOR = '58A6FF';

function webLinkBadge(label) {
  const encoded = encodeURIComponent(label).replace(/%20/g, '_');
  return `https://img.shields.io/badge/${encoded}-${WEB_LINK_BADGE_COLOR}?style=for-the-badge&logo=data:image/svg+xml;base64,${WEB_GLOBE_ICON_B64}&logoColor=white`;
}

function landingPageBadge(t) {
  return webLinkBadge(t.landing_page_label);
}

function liveDemoBadge(t) {
  return webLinkBadge(t.live_demo_label);
}

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
<img src="https://komarev.com/ghpvc/?username=xarlizard&label=${encodeURIComponent(t.profile_views_alt)}&color=0e75b6&style=flat" alt="${t.profile_views_alt}"/>
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
<a href="https://token-bar.pages.dev/"><img src="${landingPageBadge(t)}" alt="${t.landing_page_label}"/></a>
<a href="https://github.com/token-bar/token-bar"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>
</div>

<br/><br/>

<img src="https://raw.githubusercontent.com/pocket-agent/pocket-agent/main/.github/icon-cropped.png" width="200" alt="Pocket Agent" align="left"/>
<a href="https://github.com/pocket-agent/pocket-agent-desktop-app/releases"><img src="https://raw.githubusercontent.com/token-bar/token-bar/main/.github/macos_badge_noborder.png" width="175" alt="${t.download_mac_alt}" align="right"/></a>

<div>
<h3><a href="https://github.com/pocket-agent/pocket-agent">Pocket Agent</a></h3>
<p>
<img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white" alt="Python"/>
<img src="https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare"/>
<img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white" alt="macOS"/>
</p>
<p>${t.pocket_agent_desc}</p>
<p>
<a href="https://pocket-agent.pages.dev/"><img src="${landingPageBadge(t)}" alt="${t.landing_page_label}"/></a>
<a href="https://github.com/pocket-agent"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>
</div>

<br/><br/>

<img src="https://raw.githubusercontent.com/dropafile/dropafile/main/.github/icon-cropped.png" width="200" alt="dropafile" align="left"/>

<div>
<h3><a href="https://github.com/dropafile/dropafile">dropafile</a></h3>
<p>
<img src="https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white" alt="Cloudflare"/>
<img src="https://img.shields.io/badge/Hono-E36002?style=flat&logo=hono&logoColor=white" alt="Hono"/>
<img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>
<p>${t.dropafile_desc}</p>
<p>
<a href="https://dropafile.app-org-es.workers.dev/"><img src="${liveDemoBadge(t)}" alt="${t.live_demo_label}"/></a>
<a href="https://github.com/dropafile/dropafile"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
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
<img src="${LINKEDIN_LOGIN_BADGE}" alt="LinkedIn login"/>
</p>
<p>${t.email_sig_desc}</p>
<p>
<a href="https://email-signature-editor.pages.dev/"><img src="${liveDemoBadge(t)}" alt="${t.live_demo_label}"/></a>
<a href="https://github.com/xarlizard/email-signature-editor"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
</p>
</div>

<br/><br/>
`;
}

function renderTemplates(t) {
  const templateRows = [
    { name: 'github-repo-template', label: 'github-repo-template', descKey: 'github_repo_template_desc' },
    { name: 'npm-package-template', label: 'npm-package-template', descKey: 'ot_npm_package_template_desc' },
    { name: '.github-template', label: '`.github-template`', descKey: 'github_template_desc' },
  ]
    .map(({ name, label, descKey }) => {
      const repo = `https://github.com/open-templates/${name}`;
      return `| [**${label}**](${repo}) | ${t[descKey]} |`;
    })
    .join('\n');

  return `<h2 align="center"><b>${t.templates_title}</b></h2>

<p align="center">${t.templates_intro}</p>

| ${t.templates_col_template} | ${t.templates_col_summary} |
| --- | --- |
${templateRows}

<p align="center">
<a href="https://github.com/open-templates"><img src="https://img.shields.io/badge/Org%20profile-open--templates-181717?style=for-the-badge&logo=github&logoColor=white" alt="${t.templates_org_profile_alt}"/></a>
&nbsp;
<a href="https://github.com/orgs/open-templates/repositories"><img src="https://img.shields.io/badge/Browse-all%20templates-2088FF?style=for-the-badge&logo=github&logoColor=white" alt="${t.templates_browse_alt}"/></a>
</p>

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
    renderTemplates(t),
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
