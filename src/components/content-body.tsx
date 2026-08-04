"use client";

import { CodeBlock } from "@/components/code-block";
import { MathInline, MathBlock } from "@/components/katex-renderer";

interface ContentSection {
  slug: string;
  heading: string;
  html: string;
}

function parseHtml(html: string) {
  // 1) Extract <pre><code class="language-x">...</code></pre> blocks
  const segments: React.ReactNode[] = [];
  const codeRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push(parseMath(html.slice(lastIndex, match.index)));
    }
    const lang = match[1];
    let code = match[2];
    // Decode common HTML entities
    code = code
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    segments.push(<CodeBlock key={`code-${match.index}`} language={lang}>{code}</CodeBlock>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) {
    // No code blocks
    return parseMath(html);
  }

  if (lastIndex < html.length) {
    segments.push(parseMath(html.slice(lastIndex)));
  }

  return segments;
}

function parseMath(text: string) {
  // Split on display math $$...$$ and inline math $...$
  const token = /(\$\$.*?\$\$|\$[^\s$].*?[^\s$]\$)/g;
  const parts = text.split(token);

  return parts
    .filter((p) => p)
    .map((part, i) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return <MathBlock key={`math-${i}`} math={part.slice(2, -2)} />;
      }
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        return <MathInline key={`math-${i}`} math={part.slice(1, -1)} />;
      }
      return <span key={`text-${i}`} dangerouslySetInnerHTML={{ __html: part }} />;
    });
}

export function ContentBody({ section }: { section: ContentSection }) {
  return (
    <section key={section.slug} id={section.slug} style={{ marginBottom: "2.25rem" }}>
      <h2 className="section-headline" style={{ fontSize: "1.25rem" }}>{section.heading}</h2>
      <div className="quiz-content-body content-card">{parseHtml(section.html)}</div>
    </section>
  );
}
