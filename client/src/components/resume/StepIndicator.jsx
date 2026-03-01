import { Check } from 'lucide-react';
import { STEPS } from '../../utils/resume/constants';

const StepIndicator = ({ currentStep, onStepClick, completedSteps = [] }) => {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-1">
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isPast = step.id < currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium
                  ${isCurrent
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isCompleted || isPast
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-gray-50 text-gray-400 cursor-default'
                  }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${isCurrent
                      ? 'bg-white text-emerald-600'
                      : isCompleted || isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {isCompleted || isPast ? <Check size={14} /> : step.id}
                </span>
                <span className="hidden lg:inline">{step.title}</span>
                <span className="lg:hidden">{step.shortTitle}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-1 ${
                    isPast || isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-emerald-700">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-500">
            {STEPS[currentStep - 1]?.title}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full transition-all ${
                step.id <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
