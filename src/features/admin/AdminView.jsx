import { useState } from 'react';
import { Icon } from '../../shared/Icon.jsx';
import { AgenciesTable } from './agencies/AgenciesTable.jsx';
import { InviteAgencyModal } from './agencies/InviteAgencyModal.jsx';
import './admin.css';

/** Super-admin view — agencies across the platform. */
export function AdminView() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">Super-admin view over all agencies on 4reels.</p>
        </div>
        <div className="row gap-4">
          <button className="btn primary" onClick={() => setShowInvite(true)}>
            <Icon name="plus" size={14} /> Invite agency
          </button>
        </div>
      </div>

      <AgenciesTable />

      {showInvite && <InviteAgencyModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
