import React, { useState, useRef } from 'react';
import Footer from '../../components/student/Footer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function GenerateResume() {
  // State for form fields
  const [form, setForm] = useState({
    name: '',
    address: { state: '', country: '' },
    phone: '',
    email: '',
    github: '',
    linkedin: '',
    summary: '',
    skills: '',
    experience: [{ role: '', company: '', date: '' }],
    projects: [{ name: '', summary: '' }],
    awards: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(false);
  const printableRef = useRef();

  // Handlers for dynamic fields
  const handleExperienceChange = (idx, field, value) => {
    const updated = [...form.experience];
    updated[idx][field] = value;
    setForm({ ...form, experience: updated });
  };
  const addExperience = () => setForm({ ...form, experience: [...form.experience, { role: '', company: '', date: '' }] });
  const removeExperience = idx => setForm({ ...form, experience: form.experience.filter((_, i) => i !== idx) });

  const handleProjectChange = (idx, field, value) => {
    const updated = [...form.projects];
    updated[idx][field] = value;
    setForm({ ...form, projects: updated });
  };
  const addProject = () => setForm({ ...form, projects: [...form.projects, { name: '', summary: '' }] });
  const removeProject = idx => setForm({ ...form, projects: form.projects.filter((_, i) => i !== idx) });

  // Handler for other fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state' || name === 'country') {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // PDF generation logic
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Wait for DOM update
    setTimeout(async () => {
      const input = printableRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.name.replace(/\s+/g, '_')}_Resume.pdf`);
      setLoading(false);
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50 to-emerald-50">
      <section className="max-w-2xl mx-auto w-full p-6 md:p-12 bg-white rounded-3xl shadow-xl mt-10 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Generate Your Resume</h1>
        <form className="space-y-6" onSubmit={handleGenerate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="state" value={form.address.state} onChange={handleChange} required placeholder="State" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="country" value={form.address.country} onChange={handleChange} required placeholder="Country" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub Link (optional)" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn Link (optional)" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <textarea name="summary" value={form.summary} onChange={handleChange} maxLength={600} required placeholder="Professional Summary (max 100 words)" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]" />
          <input name="skills" value={form.skills} onChange={handleChange} required placeholder="Skills (comma separated)" className="input input-bordered w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-400" />
          {/* Experience Section */}
          <div>
            <label className="font-semibold">Experience (optional)</label>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
                <input value={exp.role} onChange={e => handleExperienceChange(idx, 'role', e.target.value)} placeholder="Role" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
                <input value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} placeholder="Company" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
                <input value={exp.date} onChange={e => handleExperienceChange(idx, 'date', e.target.value)} placeholder="Date" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
                {form.experience.length > 1 && <button type="button" onClick={() => removeExperience(idx)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button type="button" onClick={addExperience} className="text-blue-600 mt-1">+ Add Experience</button>
          </div>
          {/* Projects Section */}
          <div>
            <label className="font-semibold">Projects</label>
            {form.projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
                <input value={proj.name} onChange={e => handleProjectChange(idx, 'name', e.target.value)} placeholder="Project Name" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
                <input value={proj.summary} onChange={e => handleProjectChange(idx, 'summary', e.target.value)} placeholder="Project Summary" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
                {form.projects.length > 1 && <button type="button" onClick={() => removeProject(idx)} className="text-red-500">Remove</button>}
              </div>
            ))}
            <button type="button" onClick={addProject} className="text-blue-600 mt-1">+ Add Project</button>
          </div>
          <input name="awards" value={form.awards} onChange={handleChange} placeholder="Awards & Achievements (optional)" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
          <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization (if any)" className="input input-bordered w-full rounded-lg px-4 py-2 border" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow transition w-full" disabled={loading}>{loading ? 'Generating PDF...' : 'Generate Resume'}</button>
        </form>
      </section>
      {/* Hidden printable resume for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={printableRef} className="w-[794px] min-h-[1123px] bg-white text-gray-900 p-10 rounded-xl shadow-xl font-sans">
          <h1 className="text-3xl font-bold mb-2">{form.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <span>{form.address.state}, {form.address.country}</span>
            <span>{form.phone}</span>
            <span>{form.email}</span>
            {form.github && <span>GitHub: {form.github}</span>}
            {form.linkedin && <span>LinkedIn: {form.linkedin}</span>}
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Professional Summary</h2>
            <p className="text-gray-700 text-base">{form.summary}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Skills</h2>
            <p className="text-gray-700 text-base">{form.skills}</p>
          </div>
          {form.experience.filter(e => e.role || e.company || e.date).length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Experience</h2>
              <ul className="list-disc ml-6">
                {form.experience.filter(e => e.role || e.company || e.date).map((exp, idx) => (
                  <li key={idx} className="mb-1"><span className="font-semibold">{exp.role}</span> at {exp.company} ({exp.date})</li>
                ))}
              </ul>
            </div>
          )}
          {form.projects.filter(p => p.name || p.summary).length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Projects</h2>
              <ul className="list-disc ml-6">
                {form.projects.filter(p => p.name || p.summary).map((proj, idx) => (
                  <li key={idx} className="mb-1"><span className="font-semibold">{proj.name}</span>: {proj.summary}</li>
                ))}
              </ul>
            </div>
          )}
          {form.awards && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Awards & Achievements</h2>
              <p className="text-gray-700 text-base">{form.awards}</p>
            </div>
          )}
          {form.specialization && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-1">Specialization</h2>
              <p className="text-gray-700 text-base">{form.specialization}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
} 