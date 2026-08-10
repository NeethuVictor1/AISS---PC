import { useState, useMemo } from 'react';
import schema from '../../config/offboarding_schema.json';
import { executeRevocation } from '../api/revocationServices';

export function useOffboardingGate(adminUserId, targetUserId) {
  const [steps, setSteps] = useState(() =>
    schema.offboardingItems.map((item) => ({
      ...item,
      isRevoked: false,
      isProcessing: false,
      executionId: null,
    }))
  );

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Binary Zero-Trust Gate Logic: TRUE only when EVERY step is revoked
  const isGatePassed = useMemo(() => {
    return steps.every((s) => s.isRevoked === true);
  }, [steps]);

  const toggleStepRevocation = async (index) => {
    const targetStep = steps[index];
    if (targetStep.isRevoked || targetStep.isProcessing) return;

    setSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isProcessing: true } : s))
    );

    const result = await executeRevocation(targetStep, adminUserId, targetUserId);

    if (result.success) {
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === index
            ? { ...s, isRevoked: true, isProcessing: false, executionId: result.executionId }
            : s
        )
      );

      // Auto-advance to the next accordion item
      if (index < steps.length - 1) {
        setActiveStepIndex(index + 1);
      }
    } else {
      setSteps((prev) =>
        prev.map((s, idx) => (idx === index ? { ...s, isProcessing: false } : s))
      );
    }
  };

  return {
    steps,
    activeStepIndex,
    setActiveStepIndex,
    isGatePassed,
    toggleStepRevocation,
  };
}