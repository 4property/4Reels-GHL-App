import { Segmented } from '../../../shared/Segmented.jsx';

export function FormatTab({ state, set }) {
  const {
    currency, currencyPosition, thousandsSep, decimalSep, priceRounding,
    dateFormat, timeFormat, timezone, language, measurement,
  } = state;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Currency & prices</div>
            <div className="card-subtitle">How prices appear in subtitles, overlays and descriptions.</div>
          </div>
        </div>
        <div className="card-body stack" style={{ gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <div className="label">Currency</div>
              <select className="select" value={currency} onChange={(e) => set({ currency: e.target.value })}>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="GBP">GBP — British Pound (£)</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="AUD">AUD — Australian Dollar</option>
              </select>
            </div>
            <div className="field">
              <div className="label">Symbol position</div>
              <Segmented
                options={[{ value: 'prefix', label: '€685,000' }, { value: 'suffix', label: '685,000 €' }]}
                value={currencyPosition}
                onChange={(v) => set({ currencyPosition: v })}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="field">
              <div className="label">Thousands separator</div>
              <Segmented
                options={[{ value: ',', label: ',' }, { value: '.', label: '.' }, { value: ' ', label: 'space' }]}
                value={thousandsSep}
                onChange={(v) => set({ thousandsSep: v })}
              />
            </div>
            <div className="field">
              <div className="label">Decimal</div>
              <Segmented
                options={[{ value: '.', label: '.' }, { value: ',', label: ',' }]}
                value={decimalSep}
                onChange={(v) => set({ decimalSep: v })}
              />
            </div>
            <div className="field">
              <div className="label">Rounding</div>
              <select className="select" value={priceRounding} onChange={(e) => set({ priceRounding: e.target.value })}>
                <option value="exact">Exact</option>
                <option value="k">To nearest 1,000 (€685K)</option>
                <option value="10k">To nearest 10,000 (€690K)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">Date & time</div></div></div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <div className="label">Date format</div>
            <select className="select" value={dateFormat} onChange={(e) => set({ dateFormat: e.target.value })}>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
              <option>DD MMM YYYY</option>
              <option>MMM DD, YYYY</option>
            </select>
          </div>
          <div className="field">
            <div className="label">Time format</div>
            <Segmented
              options={[{ value: '24h', label: '24h · 14:30' }, { value: '12h', label: '12h · 2:30 pm' }]}
              value={timeFormat}
              onChange={(v) => set({ timeFormat: v })}
            />
          </div>
          <div className="field">
            <div className="label">Timezone</div>
            <select className="select" value={timezone} onChange={(e) => set({ timezone: e.target.value })}>
              <option>Europe/Dublin</option>
              <option>Europe/London</option>
              <option>Europe/Madrid</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
            </select>
          </div>
          <div className="field">
            <div className="label">Interface language</div>
            <select className="select" value={language} onChange={(e) => set({ language: e.target.value })}>
              <option value="en-IE">English (Ireland)</option>
              <option value="en-GB">English (UK)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">Measurement</div></div></div>
        <div className="card-body">
          <div className="field">
            <div className="label">Unit system</div>
            <Segmented
              options={[
                { value: 'metric', label: 'Metric · m² · km' },
                { value: 'imperial', label: 'Imperial · ft² · mi' },
              ]}
              value={measurement}
              onChange={(v) => set({ measurement: v })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
