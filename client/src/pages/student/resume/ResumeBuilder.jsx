import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StepIndicator from '../../../components/resume/StepIndicator';
import StepPersonal from '../../../components/resume/StepPersonal';
import StepSummarySkills from '../../../components/resume/StepSummarySkills';
import StepExperience from '../../../components/resume/StepExperience';
import StepEducation from '../../../components/resume/StepEducation';
import PreviewPanel from '../../../components/resume/PreviewPanel';
import { DEFAULT_RESUME, STORAGE_KEY } from '../../../utils/resume/constants';
import { validateStep, hasErrors } from '../../../utils/resume/validation';
import Footer from '../../../components/student/Footer';

const ResumeBuilder = () => {
  /* ---------- State ---------- */
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_RESUME, ...JSON.parse(saved) } : { ...DEFAULT_RESUME };
    } catch {
      return { ...DEFAULT_RESUME };
    }
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  /* ---------- Autosave ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  /* ---------- Field updater ---------- */
  const updateField = useCallback((section, field, value) => {
    setData((prev) => {
      if (field === null) {
        // Replace entire section (for arrays / string sections like summary)
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
    // Clear related errors on change
    setErrors((prev) => {
      const next = { ...prev };
      if (field) delete next[field];
      return next;
    });
  }, []);

  /* ---------- Navigation ---------- */
  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
    setStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (target) => {
    // Allow going to any past/completed step or the next one
    if (target <= step || completedSteps.includes(target) || target === step + 1) {
      // Validate current step before jumping forward
      if (target > step) {
        const stepErrors = validateStep(step, data);
        if (hasErrors(stepErrors)) {
          setErrors(stepErrors);
          return;
        }
        setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
      }
      setErrors({});
      setStep(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSection = useCallback((sectionKey) => {
    const defaultVal = DEFAULT_RESUME[sectionKey];
    const resetValue = Array.isArray(defaultVal)
      ? []
      : typeof defaultVal === 'object' && defaultVal !== null
        ? { ...defaultVal }
        : defaultVal;
    setData((prev) => ({ ...prev, [sectionKey]: resetValue }));
    setErrors({});
  }, []);

  const clearForm = () => {
    if (window.confirm('Are you sure? This will clear all your resume data.')) {
      setData({ ...DEFAULT_RESUME });
      setStep(1);
      setErrors({});
      setCompletedSteps([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /* ---------- Step renderer ---------- */
  const renderStep = () => {
    const props = { data, errors, updateField, clearSection };
    switch (step) {
      case 1: return <StepPersonal {...props} />;
      case 2: return <StepSummarySkills {...props} />;
      case 3: return <StepExperience {...props} />;
      case 4: return <StepEducation {...props} />;
      case 5: return <PreviewPanel data={data} onClearForm={clearForm} />;
      default: return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resume Builder</h1>
            <p className="text-emerald-200 text-sm sm:text-base max-w-xl mx-auto">
              Build a professional, ATS-optimized resume in minutes.
              Your progress is saved automatically.
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            <StepIndicator
              currentStep={step}
              onStepClick={goToStep}
              completedSteps={completedSteps}
            />
          </div>
        </div>

        {/* Form content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
            {renderStep()}
          </div>

          {/* Navigation buttons (hidden on preview step — it has its own actions) */}
          {step < 5 && (
            <div className="flex justify-between items-center mt-6 gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium
                  text-gray-600 bg-white border border-gray-300 rounded-xl
                  hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="text-xs text-gray-400 hidden sm:block">
                Auto-saved
              </div>

              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium
                  text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                {step === 4 ? 'Preview Resume' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResumeBuilder;
