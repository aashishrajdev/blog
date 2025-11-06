"use client";

import React, { useState, useRef } from "react";

type Props = {
  initial?: string;
  onChange?: (md: string) => void;
};

// Minimal, dependency-free markdown -> HTML renderer for preview.
// Supports headings, paragraphs, bold, italic, links, images, code blocks, and lists.
function simpleMarkdownToHtml(md: string) {
  if (!md) return "";

  // Escape HTML
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = md.split(/\r?\n/);
  let inCode = false;
  const out: string[] = [];
  let listOpen = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      if (inCode) {
        out.push("<pre><code>");
      } else {
        out.push("</code></pre>");
      }
      continue;
    }

    if (inCode) {
      out.push(esc(line) + "\n");
      continue;
    }

    // headers
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${parseInline(h[2])}</h${lvl}>`);
      continue;
    }

    // unordered list
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      if (!listOpen) {
        listOpen = true;
        out.push("<ul>");
      }
      out.push(`<li>${parseInline(ul[1])}</li>`);
      continue;
    } else {
      if (listOpen) {
        listOpen = false;
        out.push("</ul>");
      }
    }

    // images: ![alt](url)
    const img = line.match(/!\[(.*?)\]\((.*?)\)/);
    if (img && line.trim() === img[0]) {
      out.push(
        `<img alt="${esc(img[1])}" src="${esc(
          img[2]
        )}" style="max-width:100%"/>`
      );
      continue;
    }

    // horizontal rule
    if (/^-{3,}$/.test(line.trim())) {
      out.push("<hr/>");
      continue;
    }

    // paragraph or empty
    if (line.trim() === "") {
      out.push("");
    } else {
      out.push(`<p>${parseInline(line)}</p>`);
    }
  }

  if (listOpen) out.push("</ul>");

  return out.join("\n");

  function parseInline(text: string) {
    // escape then handle bold/italic/code/links
    let t = esc(text);
    // code span
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    // bold **text**
    t = t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // italic *text*
    t = t.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // links
    t = t.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return t;
  }
}

export default function MarkdownEditor({ initial = "", onChange }: Props) {
  const [md, setMd] = useState(initial);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleMd = (v: string) => {
    setMd(v);
    onChange?.(v);
  };

  // Basic image upload flow: the project already has an imageKit-auth route — we'll POST file there.
  const uploadImage = async (file: File) => {
    try {
      const form = new FormData();
      form.append("file", file);
      // If your imageKit route expects different params, update accordingly.
      const res = await fetch("/api/imageKit-auth", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      // Expect the route to return { url }
      if (data.url) {
        // Insert markdown image tag at cursor end
        handleMd(md + `\n![](${data.url})\n`);
      }
    } catch (err) {
      // Silent for now — in a real editor show a toast
      console.error(err);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) uploadImage(f);
  };

  return (
    <div className="markdown-editor md-editor-grid">
      <div>
        <div className="md-editor-toolbar">
          <button
            type="button"
            className="glass-button btn-small"
            onClick={() => fileRef.current?.click()}
          >
            Upload image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload image"
            onChange={onFileChange}
          />
        </div>
        <textarea
          className="md-editor-textarea"
          value={md}
          onChange={(e) => handleMd(e.target.value)}
          placeholder="Write your article in Markdown..."
        />
      </div>

      <div>
        <div className="md-preview-header">
          <strong>Preview</strong>
          <span className="md-preview-count">
            {md.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <div
          className="markdown-preview glass-card md-preview-body"
          dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(md) }}
        />
      </div>
    </div>
  );
}
