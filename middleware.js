import { next, rewrite } from '@vercel/edge';

export const config = {
  matcher: [
    '/',
    '/about',
    '/ai-shift',
    '/contact',
    '/crm-integration',
    '/daily-work-tracking',
    '/execution-gap',
    '/for-ceo',
    '/for-founders',
    '/for-vp-sales',
    '/how-it-works',
    '/platform-overview',
    '/pricing',
    '/problems',
    '/project-tracking-software-small-business',
    '/sales',
    '/salesforce-integration',
    '/standing-vs-timeboxed-work',
    '/vs-spreadsheets',
    '/why-you-stopped-knowing',
    '/work',
  ],
};

// Clean route → markdown source path
const MD_MAP = {
  '/': '/markdown/index.md',
  '/about': '/markdown/about.md',
  '/ai-shift': '/markdown/ai-shift.md',
  '/contact': '/markdown/contact.md',
  '/crm-integration': '/markdown/crm-integration.md',
  '/daily-work-tracking': '/markdown/daily-work-tracking.md',
  '/execution-gap': '/markdown/execution-gap.md',
  '/for-ceo': '/markdown/for-ceo.md',
  '/for-founders': '/markdown/for-founders.md',
  '/for-vp-sales': '/markdown/for-vp-sales.md',
  '/how-it-works': '/markdown/how-it-works.md',
  '/platform-overview': '/markdown/platform-overview.md',
  '/pricing': '/markdown/pricing.md',
  '/problems': '/markdown/problems.md',
  '/project-tracking-software-small-business': '/markdown/project-tracking-software-small-business.md',
  '/sales': '/markdown/sales.md',
  '/salesforce-integration': '/markdown/salesforce-integration.md',
  '/standing-vs-timeboxed-work': '/markdown/standing-vs-timeboxed-work.md',
  '/vs-spreadsheets': '/markdown/vs-spreadsheets.md',
  '/why-you-stopped-knowing': '/markdown/why-you-stopped-knowing.md',
  '/work': '/markdown/work.md',
};

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  const url = new URL(request.url);

  // Serve markdown only when the client explicitly asks for it.
  // Agents send Accept: text/markdown; browsers send Accept: text/html,...
  const wantsMarkdown =
    accept.includes('text/markdown') &&
    !accept.startsWith('text/html');

  if (!wantsMarkdown) {
    return next();
  }

  const mdPath = MD_MAP[url.pathname];
  if (!mdPath) {
    return next();
  }

  // Rewrite to the markdown file. The Content-Type header for /(.*)\.md
  // configured in vercel.json will set text/markdown on the response.
  const rewriteUrl = new URL(mdPath, request.url);
  return rewrite(rewriteUrl);
}
