import React from 'react';
import { useOffboardingGate } from '../hooks/useOffboardingGate';

export default function ChecklistToggleGroup({ adminUserId, targetUserId, onFinalSubmit }) {
  const {
    steps,
    activeStepIndex,
    setActiveStepIndex,
    isGatePassed,
    toggleStepRevocation,
  } = useOffboardingGate(adminUserId, targetUserId);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Access Revocation Checklist</h2>
        <p style={styles.subtitle}>Target User ID: {targetUserId}</p>
      </header>

      <div style={styles.stepperWrapper}>
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          return (
            <div key={step.stepId} style={styles.stepCard}>
              <div
                style={styles.cardHeader}
                onClick={() => setActiveStepIndex(index)}
              >
                <div style={styles.badgeWrapper}>
                  {step.isRevoked ? (
                    <span style={styles.checkBadge}>✓</span>
                  ) : (
                    <span style={styles.numBadge}>{index + 1}</span>
                  )}
                </div>
                <div style={styles.titleWrapper}>
                  <div style={styles.stepTitle}>{step.systemName}</div>
                  <div style={styles.categoryText}>{step.category} • {step.riskLevel}</div>
                </div>
              </div>

              {isActive && (
                <div style={styles.cardBody}>
                  <p style={styles.description}>{step.description}</p>
                  <div style={styles.actionRow}>
                    <button
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: step.isRevoked ? '#10B981' : '#2563EB',
                        cursor: step.isRevoked || step.isProcessing ? 'not-allowed' : 'pointer',
                      }}
                      disabled={step.isRevoked || step.isProcessing}
                      onClick={() => toggleStepRevocation(index)}
                    >
                      {step.isProcessing
                        ? 'Revoking...'
                        : step.isRevoked
                        ? 'Revoked ✓'
                        : 'Confirm Revoke'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer style={styles.footer}>
        <button
          style={{
            ...styles.submitBtn,
            backgroundColor: isGatePassed ? '#059669' : '#9CA3AF',
            cursor: isGatePassed ? 'pointer' : 'not-allowed',
          }}
          disabled={!isGatePassed}
          onClick={() => onFinalSubmit(steps)}
        >
          {isGatePassed ? 'Complete Offboarding' : 'Complete All Steps to Finish'}
        </button>
      </footer>
    </div>
  );
}

// Material Design 3 Mobile Layout Rules (320px - 430px viewports)
const styles = {
  container: {
    maxWidth: '430px',
    margin: '0 auto',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
  },
  header: { marginBottom: '16px' },
  title: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#111827' },
  subtitle: { fontSize: '12px', color: '#6B7280', margin: 0 },
  stepperWrapper: { display: 'flex', flexDirection: 'column', gap: '12px' },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    backgroundColor: '#FAFAFA',
    minHeight: '48px', // Touch-target boundary standard
  },
  badgeWrapper: { marginRight: '12px' },
  numBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
    color: '#374151',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  checkBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  titleWrapper: { flex: 1 },
  stepTitle: { fontSize: '14px', fontWeight: '600', color: '#111827' },
  categoryText: { fontSize: '11px', color: '#6B7280' },
  cardBody: { padding: '16px', borderTop: '1px solid #F3F4F6' },
  description: { fontSize: '12px', color: '#4B5563', margin: '0 0 16px 0', lineHeight: '1.4' },
  actionRow: { display: 'flex', justifyContent: 'flex-end' },
  toggleBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '13px',
    minHeight: '48px',
  },
  footer: { marginTop: '24px' },
  submitBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '15px',
    minHeight: '48px',
  },
};