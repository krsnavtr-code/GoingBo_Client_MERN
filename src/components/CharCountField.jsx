"use client";
import React from "react";

const CharCountField = ({ value = "", minLength = 0, maxLength }) => {
  const len = value.length;
  const hasMaxLimit = typeof maxLength === "number" && maxLength > 0;
  const isTooShort = len < minLength;
  const isTooLong = hasMaxLimit && len > maxLength;

  const colorClass = isTooShort
    ? "text-red-500"
    : isTooLong
    ? "text-orange-500"
    : "text-green-500";

  return (
    <div className="mt-1 text-xs flex items-center justify-between">
      <div>
        <span className={colorClass}>
          {len}
          {hasMaxLimit ? `/${maxLength}` : ""} characters
        </span>

        {isTooShort && (
          <span className="text-gray-400 ml-2">
            (Minimum {minLength} required)
          </span>
        )}

        {hasMaxLimit && isTooLong && (
          <span className="text-gray-400 ml-2">(Max limit exceeded)</span>
        )}
      </div>

      {/* ✅ Show progress bar only if maxLength is defined */}
      {hasMaxLimit && (
        <div className="w-28 h-2 bg-[rgba(0,0,0,0.06)] rounded overflow-hidden">
          <div
            className="h-full rounded"
            style={{
              width: `${Math.min((len / maxLength) * 100, 100)}%`,
              background: isTooShort
                ? "#f87171" // red
                : isTooLong
                ? "#fb923c" // orange
                : "#34d399", // green
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CharCountField;
