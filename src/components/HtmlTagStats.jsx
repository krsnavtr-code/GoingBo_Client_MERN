"use client";
import React from "react";

const HtmlTagStats = ({ html }) => {
  if (!html) return null;

  const regex = /<([a-z0-9]+)(\s|>)/gi;
  const tags = {};
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    tags[tag] = (tags[tag] || 0) + 1;
  }

  const tagEntries = Object.entries(tags);

  if (tagEntries.length === 0) return null;

  return (
    <div className="mt-3 text-xs text-[var(--text-color-secondary)] border-t border-[var(--border-color)] pt-2">
      <h4 className="font-medium text-[var(--text-color)] mb-1">
        HTML Tags Used:
      </h4>
      <div className="flex flex-wrap gap-2">
        {tagEntries.map(([tag, count]) => (
          <span
            key={tag}
            className="px-2 py-1 bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-md"
          >
            &lt;{tag}&gt;{" "}
            <span className="text-[var(--accent-color)] font-semibold">
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default HtmlTagStats;
