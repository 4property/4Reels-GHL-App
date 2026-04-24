import { Icon } from '../../../shared/Icon.jsx';

export function BillingTab({ agency }) {
  return (
    <div className="stack gap-6">
      <div className="card" style={{ padding: 16 }}>
        <div className="t-base t-semibold" style={{ marginBottom: 10 }}>Subscription</div>
        <div className="billing-grid">
          <KV label="Plan" value={agency.plan} />
          <KV label="MRR" value={`€${agency.mrr}`} />
          <KV label="Seats" value={agency.seats} />
          <KV label="Joined" value={agency.joined} />
          <KV label="Next invoice" value="Apr 30, 2026" />
          <KV label="Payment method" value="Visa •••• 4821" />
        </div>
        <div className="row gap-4" style={{ marginTop: 14 }}>
          <button className="btn sm"><Icon name="external" size={12} /> Open in Stripe</button>
          <button className="btn sm">Change plan</button>
        </div>
      </div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div>
      <div className="kv-label">{label}</div>
      <div className="kv-value">{value}</div>
    </div>
  );
}
