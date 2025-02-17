import React from "react";

const formatSummaryText = (text) => {
  if (!text) return "";

  return text.split("\n").map((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine === "") return <br key={index} />;

    // Detect and format section titles (e.g., "🔹 Overview:")
    const sectionMatch = trimmedLine.match(/^(\p{Emoji}*)\s*\*\*(.+?):\*\*\s*(.*)/u);
    if (sectionMatch) {
      return (
        <p key={index} className="mt-4">
          <strong>{sectionMatch[2]}:</strong> {sectionMatch[3]}
        </p>
      );
    }

    // Detect and format bullet points (any emoji as marker)
    if (/^\p{Emoji}/u.test(trimmedLine)) {
      return <li key={index}>{trimmedLine}</li>;
    }

    return <p key={index}>{trimmedLine}</p>;
  });
};

const SummaryView = ({ summaryText }) => {
  return (
    <div className="summary-view text-gray-800">
      <ul className="list-disc pl-5">{formatSummaryText(summaryText)}</ul>
    </div>
  );
};

export default SummaryView;
