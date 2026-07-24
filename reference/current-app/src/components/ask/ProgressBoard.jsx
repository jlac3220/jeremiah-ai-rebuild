// src/components/ask/ProgressBoard.jsx
import React from "react";

export default function ProgressBoard({ curriculum, standardProgress, standardStats, onStartStandard }) {
  if (!curriculum) return null;
  return (
    <div className="pb-board">
      <div className="pb-chalk-header">
        <span className="pb-chalk-icon">🖊️</span>
        <span className="pb-chalk-title">Progress Board</span>
        <span className="pb-chalk-sub">Tap any standard to study</span>
      </div>
      <div className="pb-subjects">
        {Object.values(curriculum).map(subject => {
          if (!subject.domains?.length) return null;
          return (
            <div key={subject.code} className="pb-subject">
              <div className="pb-subject-hdr">
                <span className="pb-subject-pill" style={{ background: subject.color }}>{subject.code}</span>
                <span className="pb-subject-name">{subject.title}</span>
              </div>
              {subject.domains.map(domain => {
                const stds = domain.standards || [];
                const masteredCount = stds.filter(s => (standardProgress[typeof s === "object" ? s.code : s] || 0) >= 4).length;
                const pct = stds.length ? Math.round((masteredCount / stds.length) * 100) : 0;
                return (
                  <div key={domain.code} className="pb-domain">
                    <div className="pb-domain-hdr">
                      <span className="pb-domain-code">{domain.code}</span>
                      <span className="pb-domain-title">{domain.title}</span>
                      <span className="pb-domain-pct">{pct}%</span>
                    </div>
                    <div className="pb-std-grid">
                      {stds.map(std => {
                        const code = typeof std === "object" ? std.code : std;
                        const title = typeof std === "object" ? std.title : "";
                        const lvl = standardProgress[code] || 0;
                        const cls = lvl >= 4 ? "pb-std-cell--mastered" : lvl >= 1 ? "pb-std-cell--progress" : "pb-std-cell--new";
                        const icon = lvl >= 4 ? "✦" : lvl >= 1 ? "◐" : "○";
                        return (
                          <button key={code} className={`pb-std-cell ${cls}`}
                            onClick={() => onStartStandard({ code, title, domain: domain.code, domainTitle: domain.title, subject: subject.code, subjectTitle: subject.title })}
                            title={`${code}${title ? ` — ${title}` : ""}`}>
                            <span className="pb-cell-icon">{icon}</span>
                            <span className="pb-cell-code">{code.split(".").slice(1).join(".")}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
