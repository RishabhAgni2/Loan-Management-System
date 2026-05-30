'use client';

interface Step {
  label: string;
  path: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentPath: string;
}

export default function StepIndicator({ steps, currentPath }: StepIndicatorProps) {
  const currentStep = Math.max(
    0,
    steps.findIndex((step) => currentPath.includes(step.path.split('/').pop() || ''))
  );

  return (
    <div className="mb-8 flex items-center">
      {steps.map((step, index) => {
        const done = index < currentStep;
        const active = index === currentStep;

        return (
          <div key={step.path} className="flex flex-1 items-center">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                done
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : active
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              {done ? '✓' : index + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={`text-xs font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-3 h-0.5 flex-1 ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
