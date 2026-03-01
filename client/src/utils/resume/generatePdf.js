import jsPDF from 'jspdf';

/* ---------- PDF Layout Constants (A4: 210 × 297 mm) ---------- */
const PW = 210;
const PH = 297;
const M = 12.7; // 0.5-inch margin — industry standard
const CW = PW - 2 * M; // content width
const LH = 4.6; // line height for body text
const SEC_GAP = 3; // gap before a section header

/* ---------- Helpers ---------- */
const makeCtx = (doc) => ({
  doc,
  y: M,
  addPage() {
    doc.addPage();
    this.y = M;
  },
  ensure(needed) {
    if (this.y + needed > PH - M) this.addPage();
  },
});

const drawSectionHeader = (ctx, title) => {
  ctx.ensure(12);
  ctx.y += SEC_GAP;
  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(11);
  ctx.doc.text(title.toUpperCase(), M, ctx.y);
  ctx.y += 1.2;
  ctx.doc.setDrawColor(60, 60, 60);
  ctx.doc.setLineWidth(0.35);
  ctx.doc.line(M, ctx.y, PW - M, ctx.y);
  ctx.y += 3.5;
};

const drawWrappedText = (ctx, text, x, maxW, fontSize = 10, style = 'normal') => {
  ctx.doc.setFont('helvetica', style);
  ctx.doc.setFontSize(fontSize);
  const lines = ctx.doc.splitTextToSize(text, maxW);
  lines.forEach((line) => {
    ctx.ensure(LH);
    ctx.doc.text(line, x, ctx.y);
    ctx.y += LH;
  });
};

const drawBullets = (ctx, text) => {
  const bullets = text.split('\n').filter((b) => b.trim());
  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(10);
  bullets.forEach((bullet) => {
    const clean = bullet.trim().replace(/^[\u2022\-*]\s*/, '');
    if (!clean) return;
    const full = `\u2022  ${clean}`;
    const lines = ctx.doc.splitTextToSize(full, CW - 4);
    lines.forEach((line, i) => {
      ctx.ensure(LH);
      ctx.doc.text(line, M + (i === 0 ? 2 : 5), ctx.y);
      ctx.y += LH;
    });
  });
};

/* ---------- Section Renderers ---------- */

const renderHeader = (ctx, p) => {
  // Name
  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(18);
  ctx.doc.setTextColor(20, 20, 20);
  ctx.doc.text(p.name || 'Your Name', PW / 2, ctx.y, { align: 'center' });
  ctx.y += 7;

  // Contact line
  const parts = [p.email, p.phone].filter(Boolean);
  const location = [p.city, p.state, p.country].filter(Boolean).join(', ');
  if (location) parts.push(location);

  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(9);
  ctx.doc.setTextColor(50, 50, 50);
  if (parts.length) {
    ctx.doc.text(parts.join('  |  '), PW / 2, ctx.y, { align: 'center' });
    ctx.y += 4.5;
  }

  // Links line
  const links = [];
  if (p.linkedin) links.push(p.linkedin);
  if (p.github) links.push(p.github);
  if (links.length) {
    ctx.doc.setFontSize(8.5);
    ctx.doc.text(links.join('  |  '), PW / 2, ctx.y, { align: 'center' });
    ctx.y += 4;
  }

  ctx.doc.setTextColor(20, 20, 20);
};

const renderSummary = (ctx, summary) => {
  if (!summary?.trim()) return;
  drawSectionHeader(ctx, 'Professional Summary');
  drawWrappedText(ctx, summary.trim(), M, CW);
  ctx.y += 1;
};

const renderSkills = (ctx, skills) => {
  if (!skills?.length) return;
  drawSectionHeader(ctx, 'Technical Skills');
  const text = skills.join('  \u2022  ');
  drawWrappedText(ctx, text, M, CW);
  ctx.y += 1;
};

const renderExperience = (ctx, experience) => {
  const valid = experience?.filter((e) => e.role?.trim()) || [];
  if (!valid.length) return;
  drawSectionHeader(ctx, 'Experience');

  valid.forEach((exp, idx) => {
    ctx.ensure(14);

    // Role + dates
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(10.5);
    ctx.doc.text(exp.role, M, ctx.y);

    const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate]
      .filter(Boolean)
      .join(' \u2013 ');
    if (dates) {
      ctx.doc.setFont('helvetica', 'normal');
      ctx.doc.setFontSize(9.5);
      ctx.doc.text(dates, PW - M, ctx.y, { align: 'right' });
    }
    ctx.y += LH;

    // Company
    if (exp.company?.trim()) {
      ctx.doc.setFont('helvetica', 'italic');
      ctx.doc.setFontSize(10);
      ctx.doc.text(exp.company, M, ctx.y);
      ctx.y += LH;
    }

    // Description bullets
    if (exp.description?.trim()) {
      drawBullets(ctx, exp.description);
    }

    if (idx < valid.length - 1) ctx.y += 2;
  });
  ctx.y += 1;
};

const renderProjects = (ctx, projects) => {
  const valid = projects?.filter((p) => p.name?.trim()) || [];
  if (!valid.length) return;
  drawSectionHeader(ctx, 'Projects');

  valid.forEach((proj, idx) => {
    ctx.ensure(12);

    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(10.5);

    let titleLine = proj.name;
    if (proj.technologies?.trim()) {
      titleLine += `  |  ${proj.technologies}`;
    }
    ctx.doc.text(titleLine, M, ctx.y);
    ctx.y += LH;

    if (proj.link?.trim()) {
      ctx.doc.setFont('helvetica', 'normal');
      ctx.doc.setFontSize(8.5);
      ctx.doc.setTextColor(60, 60, 60);
      ctx.doc.text(proj.link, M, ctx.y);
      ctx.doc.setTextColor(20, 20, 20);
      ctx.y += LH;
    }

    if (proj.description?.trim()) {
      drawWrappedText(ctx, proj.description, M, CW);
    }

    if (idx < valid.length - 1) ctx.y += 2;
  });
  ctx.y += 1;
};

const renderEducation = (ctx, education) => {
  const valid = education?.filter((e) => e.degree?.trim()) || [];
  if (!valid.length) return;
  drawSectionHeader(ctx, 'Education');

  valid.forEach((edu) => {
    ctx.ensure(10);
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(10.5);
    ctx.doc.text(edu.degree, M, ctx.y);
    if (edu.year) {
      ctx.doc.setFont('helvetica', 'normal');
      ctx.doc.setFontSize(9.5);
      ctx.doc.text(edu.year, PW - M, ctx.y, { align: 'right' });
    }
    ctx.y += LH;
    if (edu.institution) {
      ctx.doc.setFont('helvetica', 'italic');
      ctx.doc.setFontSize(10);
      let instLine = edu.institution;
      if (edu.gpa?.trim()) instLine += `  |  GPA: ${edu.gpa}`;
      ctx.doc.text(instLine, M, ctx.y);
      ctx.y += LH;
    }
    ctx.y += 1.5;
  });
};

const renderCertifications = (ctx, certifications) => {
  const valid = certifications?.filter((c) => c.name?.trim()) || [];
  if (!valid.length) return;
  drawSectionHeader(ctx, 'Certifications');

  valid.forEach((cert) => {
    ctx.ensure(6);
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(10);
    let line = cert.name;
    if (cert.issuer?.trim()) line += ` \u2014 ${cert.issuer}`;
    if (cert.year?.trim()) line += ` (${cert.year})`;
    const lines = ctx.doc.splitTextToSize(line, CW);
    lines.forEach((l) => {
      ctx.ensure(LH);
      ctx.doc.text(l, M, ctx.y);
      ctx.y += LH;
    });
  });
  ctx.y += 1;
};

const renderAchievements = (ctx, achievements) => {
  const valid = achievements?.filter((a) => a?.trim()) || [];
  if (!valid.length) return;
  drawSectionHeader(ctx, 'Achievements');

  valid.forEach((ach) => {
    ctx.ensure(LH);
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(10);
    const text = `\u2022  ${ach.trim()}`;
    const lines = ctx.doc.splitTextToSize(text, CW - 4);
    lines.forEach((line, i) => {
      ctx.ensure(LH);
      ctx.doc.text(line, M + (i === 0 ? 2 : 5), ctx.y);
      ctx.y += LH;
    });
  });
};

/* ---------- Main Export ---------- */

export const generateResumePdf = (resume) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const ctx = makeCtx(doc);

  renderHeader(ctx, resume.personal);
  renderSummary(ctx, resume.summary);
  renderSkills(ctx, resume.skills);
  renderExperience(ctx, resume.experience);
  renderProjects(ctx, resume.projects);
  renderEducation(ctx, resume.education);
  renderCertifications(ctx, resume.certifications);
  renderAchievements(ctx, resume.achievements);

  return doc;
};

export const downloadResumePdf = (resume) => {
  const doc = generateResumePdf(resume);
  const fileName =
    (resume.personal.name || 'resume').replace(/\s+/g, '_').toLowerCase() +
    '_resume.pdf';
  doc.save(fileName);
};
