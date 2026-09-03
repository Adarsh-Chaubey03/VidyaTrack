import React, { useMemo } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   MarkdownLite — just enough markdown for study answers.

   The assistant is instructed to use headings, bold, lists and fenced code.
   Rendering those four things is ~100 lines; pulling in react-markdown +
   remark would add well over 100 KB to the bundle for the same result.

   Everything is rendered as React elements — no dangerouslySetInnerHTML — so
   model output can never inject markup.
   ──────────────────────────────────────────────────────────────────────────── */

// **bold**, `inline code`, and plain text.
const renderInline = (text, keyPrefix) => {
    const nodes = [];
    // Split on the two inline forms while keeping the delimiters.
    const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    parts.forEach((part, i) => {
        if (!part) return;
        const key = `${keyPrefix}-i${i}`;

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            nodes.push(
                <strong key={key} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                </strong>
            );
        } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
            nodes.push(
                <code
                    key={key}
                    className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[0.9em] font-mono break-words"
                >
                    {part.slice(1, -1)}
                </code>
            );
        } else {
            nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
        }
    });

    return nodes;
};

/**
 * Split raw text into a flat list of blocks.
 * Kept as a pure function so it can be memoised per message.
 */
const parseBlocks = (raw) => {
    const lines = String(raw || '').split('\n');
    const blocks = [];

    let paragraph = [];
    let list = null;        // { ordered: boolean, items: string[] }

    const flushParagraph = () => {
        if (paragraph.length) {
            blocks.push({ type: 'p', text: paragraph.join(' ') });
            paragraph = [];
        }
    };
    const flushList = () => {
        if (list) {
            blocks.push({ type: 'list', ordered: list.ordered, items: list.items });
            list = null;
        }
    };
    const flushAll = () => { flushParagraph(); flushList(); };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // ── Fenced code block ──
        const fence = line.match(/^\s*```(\w+)?\s*$/);
        if (fence) {
            flushAll();
            const lang = fence[1] || '';
            const code = [];
            i++;
            while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
                code.push(lines[i]);
                i++;
            }
            blocks.push({ type: 'code', lang, text: code.join('\n') });
            continue;
        }

        // ── Blank line ──
        if (!line.trim()) {
            flushAll();
            continue;
        }

        // ── Heading ──
        const heading = line.match(/^\s*(#{1,4})\s+(.*)$/);
        if (heading) {
            flushAll();
            blocks.push({ type: 'h', level: heading[1].length, text: heading[2].trim() });
            continue;
        }

        // ── List item ──
        const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
        const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
        if (bullet || numbered) {
            flushParagraph();
            const ordered = Boolean(numbered);
            const item = (bullet ? bullet[1] : numbered[1]).trim();
            if (!list || list.ordered !== ordered) {
                flushList();
                list = { ordered, items: [] };
            }
            list.items.push(item);
            continue;
        }

        // ── Plain text ──
        flushList();
        paragraph.push(line.trim());
    }

    flushAll();
    return blocks;
};

const HEADING_CLASS = {
    1: 'text-base font-semibold text-slate-900 mt-3 first:mt-0',
    2: 'text-[15px] font-semibold text-slate-900 mt-3 first:mt-0',
    3: 'text-sm font-semibold text-emerald-700 mt-3 first:mt-0',
    4: 'text-sm font-semibold text-slate-700 mt-3 first:mt-0',
};

const MarkdownLite = ({ text }) => {
    const blocks = useMemo(() => parseBlocks(text), [text]);

    return (
        <div className="text-sm text-slate-700 leading-relaxed space-y-2">
            {blocks.map((block, index) => {
                const key = `b${index}`;

                if (block.type === 'code') {
                    return (
                        <pre
                            key={key}
                            className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs leading-relaxed"
                        >
                            {block.lang && (
                                <span className="block text-[10px] uppercase tracking-wide text-slate-400 mb-1.5">
                                    {block.lang}
                                </span>
                            )}
                            <code className="font-mono whitespace-pre">{block.text}</code>
                        </pre>
                    );
                }

                if (block.type === 'h') {
                    const Tag = `h${Math.min(block.level + 2, 6)}`;
                    return (
                        <Tag key={key} className={HEADING_CLASS[block.level] || HEADING_CLASS[4]}>
                            {renderInline(block.text, key)}
                        </Tag>
                    );
                }

                if (block.type === 'list') {
                    const ListTag = block.ordered ? 'ol' : 'ul';
                    return (
                        <ListTag
                            key={key}
                            className={`pl-5 space-y-1 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-emerald-500`}
                        >
                            {block.items.map((item, i) => (
                                <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                            ))}
                        </ListTag>
                    );
                }

                return <p key={key}>{renderInline(block.text, key)}</p>;
            })}
        </div>
    );
};

export default React.memo(MarkdownLite);
