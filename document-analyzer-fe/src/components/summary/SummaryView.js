import React from "react";

const formatSummaryText = (text) => {
  if (!text) return "";

  // Convert newlines into actual line breaks
  const lines = text.split("\n").map((line, index) => {
    if (line.trim() === "") return <br key={index} />;

    // Detect and format section titles (e.g., "Key Features:")
    if (/^\s*[A-Za-z\s]+:$/.test(line)) {
      return (
        <div key={index} className="section-title">
          {line}
        </div>
      );
    }

    // Detect and format bullet points (with emoji markers)
    if (/^[✅📌🔹🚀🏆📚🎯]/.test(line.trim())) {
      return <li key={index}>{line.trim()}</li>;
    }

    return <p key={index}>{line}</p>;
  });

  return lines;
};

const SummaryView = ({ summaryText }) => {
  return <div className="summary-view">{formatSummaryText(summaryText)}</div>;
};

export default SummaryView;
