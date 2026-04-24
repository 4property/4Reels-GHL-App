import { Toggle } from '../../../shared/Toggle.jsx';
import { IntroOutroCard } from '../IntroOutroCard.jsx';

export function IntroOutroTab({ state, set }) {
  const {
    introEnabled, introSource, introDuration, introFile,
    outroEnabled, outroSource, outroDuration, outroFile,
    skipForRentals,
  } = state;

  return (
    <>
      <IntroOutroCard
        kind="Intro"
        enabled={introEnabled}
        setEnabled={(v) => set({ introEnabled: v })}
        source={introSource}
        setSource={(v) => set({ introSource: v })}
        duration={introDuration}
        setDuration={(v) => set({ introDuration: v })}
        file={introFile}
        setFile={(v) => set({ introFile: v })}
      />
      <IntroOutroCard
        kind="Outro"
        enabled={outroEnabled}
        setEnabled={(v) => set({ outroEnabled: v })}
        source={outroSource}
        setSource={(v) => set({ outroSource: v })}
        duration={outroDuration}
        setDuration={(v) => set({ outroDuration: v })}
        file={outroFile}
        setFile={(v) => set({ outroFile: v })}
      />

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rules</div>
            <div className="card-subtitle">When to skip the intro/outro automatically.</div>
          </div>
        </div>
        <div className="card-body stack" style={{ gap: 10 }}>
          <Toggle
            on={skipForRentals}
            onChange={(v) => set({ skipForRentals: v })}
            label="Skip on rentals"
            sub="Use intro/outro only on sale listings."
          />
          <Toggle
            on={false}
            onChange={() => {}}
            label="Skip when reel is shorter than 15s"
            sub="Avoids a tiny clip of pure branding."
          />
          <Toggle
            on={false}
            onChange={() => {}}
            label="Allow agent to disable per reel"
            sub="Editor will show a toggle to remove the default intro or outro for one reel."
          />
        </div>
      </div>
    </>
  );
}
