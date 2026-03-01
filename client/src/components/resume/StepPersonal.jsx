import { User, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { TextField, SectionHeader } from './FormField';

const StepPersonal = ({ data, errors, updateField, clearSection }) => {
  const p = data.personal;
  const set = (field, val) => updateField('personal', field, val);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <SectionHeader onClear={() => clearSection('personal')} sectionName="Personal Information">
          Personal Information
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-5">
          This appears at the top of your resume. Recruiters use it to contact you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <TextField
            label="Full Name"
            value={p.name}
            onChange={(v) => set('name', v)}
            error={errors.name}
            placeholder="John Doe"
            required
          />
          <User size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <TextField
            label="Email"
            type="email"
            value={p.email}
            onChange={(v) => set('email', v)}
            error={errors.email}
            placeholder="john@example.com"
            required
          />
          <Mail size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <TextField
            label="Phone"
            type="tel"
            value={p.phone}
            onChange={(v) => set('phone', v)}
            error={errors.phone}
            placeholder="+91 98765 43210"
            required
          />
          <Phone size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <TextField
            label="City"
            value={p.city}
            onChange={(v) => set('city', v)}
            placeholder="Mumbai"
          />
          <MapPin size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="State"
          value={p.state}
          onChange={(v) => set('state', v)}
          placeholder="Maharashtra"
        />
        <TextField
          label="Country"
          value={p.country}
          onChange={(v) => set('country', v)}
          placeholder="India"
        />
      </div>

      <div className="border-t border-gray-100 pt-5 mt-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Profile Links <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <TextField
              label="GitHub"
              value={p.github}
              onChange={(v) => set('github', v)}
              error={errors.github}
              placeholder="https://github.com/username"
            />
            <Github size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <TextField
              label="LinkedIn"
              value={p.linkedin}
              onChange={(v) => set('linkedin', v)}
              error={errors.linkedin}
              placeholder="https://linkedin.com/in/username"
            />
            <Linkedin size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPersonal;
