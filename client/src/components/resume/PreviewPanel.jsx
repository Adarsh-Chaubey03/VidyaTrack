import { useState } from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { calculateATSScore } from '../../utils/resume/atsScoring';
import { downloadResumePdf } from '../../utils/resume/generatePdf';

const ScoreRing = ({ score, size = 120, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 85 ? '#059669' : score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#e5e7eb" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Score</span>
      </div>
    </div>
  );
};

/* ---------- Resume Preview (HTML mirror of PDF layout) ---------- */
const ResumePreviewDoc = ({ data }) => {
  const p = data.personal;
  const contactParts = [p.email, p.phone, [p.city, p.state, p.country].filter(Boolean).join(', ')].filter(Boolean);
  const links = [p.linkedin, p.github].filter(Boolean);

  const Section = ({ title, children }) => (
    <div className="mb-3">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-400 pb-0.5 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 sm:p-8 font-serif text-[10.5px] leading-[1.5] text-gray-800"
      style={{ fontFamily: "'Times New Roman', 'Helvetica', serif", maxWidth: 680, margin: '0 auto' }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-[18px] font-bold tracking-wide">{p.name || 'Your Name'}</h1>
        {contactParts.length > 0 && (
          <p className="text-[9px] text-gray-600 mt-0.5">{contactParts.join('  |  ')}</p>
        )}
        {links.length > 0 && (
          <p className="text-[8.5px] text-gray-500 mt-0.5">{links.join('  |  ')}</p>
        )}
      </div>

      {/* Summary */}
      {data.summary?.trim() && (
        <Section title="Professional Summary">
          <p className="text-[10px]">{data.summary}</p>
        </Section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Section title="Technical Skills">
          <p className="text-[10px]">{data.skills.join('  \u2022  ')}</p>
        </Section>
      )}

      {/* Experience */}
      {data.experience?.filter((e) => e.role?.trim()).length > 0 && (
        <Section title="Experience">
          {data.experience.filter((e) => e.role?.trim()).map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{exp.role}</span>
                <span className="text-[9px] text-gray-500">
                  {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' \u2013 ')}
                </span>
              </div>
              {exp.company && <p className="italic text-[10px] text-gray-600">{exp.company}</p>}
              {exp.description?.trim() && (
                <ul className="mt-0.5 ml-3 list-disc text-[10px] space-y-0.5">
                  {exp.description.split('\n').filter(Boolean).map((b, i) => (
                    <li key={i}>{b.replace(/^[\u2022\-*]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects?.filter((p) => p.name?.trim()).length > 0 && (
        <Section title="Projects">
          {data.projects.filter((p) => p.name?.trim()).map((proj, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-bold text-[10.5px]">{proj.name}</span>
              {proj.technologies && (
                <span className="text-[9px] text-gray-500">  |  {proj.technologies}</span>
              )}
              {proj.link && <p className="text-[8.5px] text-gray-500">{proj.link}</p>}
              {proj.description && <p className="text-[10px] mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education?.filter((e) => e.degree?.trim()).length > 0 && (
        <Section title="Education">
          {data.education.filter((e) => e.degree?.trim()).map((edu, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[10.5px]">{edu.degree}</span>
                <span className="text-[9px] text-gray-500">{edu.year}</span>
              </div>
              <p className="italic text-[10px] text-gray-600">
                {edu.institution}
                {edu.gpa && `  |  GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {data.certifications?.filter((c) => c.name?.trim()).length > 0 && (
        <Section title="Certifications">
          {data.certifications.filter((c) => c.name?.trim()).map((cert, idx) => (
            <p key={idx} className="text-[10px]">
              {cert.name}
              {cert.issuer && ` \u2014 ${cert.issuer}`}
              {cert.year && ` (${cert.year})`}
            </p>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {data.achievements?.filter(Boolean).length > 0 && (
        <Section title="Achievements">
          <ul className="ml-3 list-disc text-[10px] space-y-0.5">
            {data.achievements.filter(Boolean).map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
};

/* ---------- Main Preview Panel ---------- */
const PreviewPanel = ({ data, onClearForm }) => {
  const [downloading, setDownloading] = useState(false);
  const ats = calculateATSScore(data);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Small delay for UX feedback
      await new Promise((r) => setTimeout(r, 300));
      downloadResumePdf(data);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* ATS Score Card */}
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={ats.score} />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <TrendingUp size={18} className="text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-800">ATS Compatibility</h3>
            </div>
            <p className={`text-sm font-semibold mb-3 ${
              ats.score >= 85 ? 'text-emerald-600' : ats.score >= 70 ? 'text-emerald-500' :
              ats.score >= 50 ? 'text-amber-500' : 'text-red-500'
            }`}>
              {ats.grade} — {ats.score}/100
            </p>

            {ats.tips.length > 0 && (
              <div className="space-y-1.5">
                {ats.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    {ats.score >= 70 ? (
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="mt-0.5 text-amber-400 shrink-0" />
                    )}
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600
            text-white rounded-xl font-semibold text-sm hover:bg-emerald-700
            disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {downloading ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>

        <button
          type="button"
          onClick={onClearForm}
          className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium
            text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>

      {/* Resume Preview */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Preview
        </h3>
        <div className="bg-gray-100 rounded-xl p-4 sm:p-6 overflow-auto">
          <ResumePreviewDoc data={data} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
