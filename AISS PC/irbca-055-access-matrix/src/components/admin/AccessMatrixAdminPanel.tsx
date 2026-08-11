import React, { useState } from 'react';

export interface MatrixRowData {
  roleId: string;
  roleName: string;
  description: string;
  assigned: boolean;
  type: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_REVIEW';
  dimensions: string[];
}

interface AccessMatrixAdminPanelProps {
  tenantId: string;
  userId: string;
  data: MatrixRowData[];
  isLoading: boolean;
  onToggleRole: (roleId: string, nextState: boolean) => Promise<void>;
}

export const AccessMatrixAdminPanel: React.FC<AccessMatrixAdminPanelProps> = ({
  tenantId,
  userId,
  data,
  isLoading,
  onToggleRole,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [busyRoleId, setBusyRoleId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Access Matrix Administration</h2>
        <p className="text-sm text-gray-600">Tenant: {tenantId} | User ID: {userId}</p>
      </header>

      {data.map((row) => {
        const isExpanded = expandedRow === row.roleId;
        const isSaving = busyRoleId === row.roleId;

        return (
          <div
            key={row.roleId}
            className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-gray-900">{row.roleName}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {row.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Type: {row.type}</p>
              </div>

              {/* Material 3 Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer p-2">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={row.assigned}
                  disabled={isSaving}
                  aria-label={`Toggle access for ${row.roleName}`}
                  aria-checked={row.assigned}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    setBusyRoleId(row.roleId);
                    try {
                      await onToggleRole(row.roleId, checked);
                    } finally {
                      setBusyRoleId(null);
                    }
                  }}
                />
                <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none ring-2 ring-transparent peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[10px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Expandable Accordion Block */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-expanded={isExpanded}
                onClick={() => setExpandedRow(isExpanded ? null : row.roleId)}
              >
                {isExpanded ? '▲ Hide Permission Details' : '▼ Expand Permission Details'}
              </button>

              {isExpanded && (
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
                  <p><strong>Description:</strong> {row.description}</p>
                  <p><strong>Dimensions:</strong> {row.dimensions.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
