const sampleAssets = [
  {
    id: "A-204",
    name: "Steam Valve Cluster",
    location: "Engineering Building, Basement",
    risk: 0.91,
    status: "Action required",
    maintainer: "Facilities HVAC Team",
  },
  {
    id: "A-140",
    name: "Electrical Panel 3B",
    location: "Student Center, East Wing",
    risk: 0.67,
    status: "Monitor",
    maintainer: "Campus Electricians",
  },
  {
    id: "A-089",
    name: "Industrial Pump",
    location: "Chem Lab Annex",
    risk: 0.35,
    status: "Healthy",
    maintainer: "Lab Operations",
  },
];

const aiExample = `{
  "summary": "Corrosion near key joints with elevated leak probability.",
  "overall_priority": 0.86,
  "findings": [
    {
      "type": "corrosion",
      "severity": 0.89,
      "evidence": "Visible rust buildup around flange and bolts."
    }
  ],
  "actions": [
    {
      "suggested_key": "schedule_targeted_inspection",
      "title": "Schedule targeted inspection",
      "description": "Dispatch maintenance to inspect and pressure test.",
      "reason": "Corrosion and micro-leak indicators are present.",
      "priority": 0.86,
      "risk_value": 86,
      "recommended_steps": [
        "Isolate valve section",
        "Capture follow-up images",
        "Replace worn gasket"
      ],
      "estimated_cost": 320
    }
  ]
}`;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Hack USU • Startup Track</p>
          <h1 className="mt-2 text-3xl font-bold">NFC + AI Asset Intelligence OS</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            A CMMS-style platform where NFC taps become the entry point and AI handles inspection,
            risk scoring, dedupe, prioritization, and recommended action generation.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Total assets", "184"],
            ["Open work orders", "27"],
            ["High risk assets", "8"],
            ["Avg. response time", "2.3h"],
          ].map(([label, value]) => (
            <article key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-cyan-300">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Risk-ranked assets</h2>
            <div className="mt-4 space-y-3">
              {sampleAssets.map((asset) => (
                <div key={asset.id} className="rounded-lg border border-slate-700 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-slate-400">{asset.location}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                        Maintainer: {asset.maintainer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Risk score</p>
                      <p className="text-lg font-semibold text-cyan-300">{Math.round(asset.risk * 100)}</p>
                      <p className="text-xs text-slate-400">{asset.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">AI inspection payload</h2>
            <p className="mt-2 text-sm text-slate-400">
              The app sends photo + notes to the AI layer and receives structured findings/actions.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-cyan-200">
              {aiExample}
            </pre>
          </article>
        </section>

        <section className="rounded-2xl border border-cyan-900/70 bg-cyan-950/20 p-6">
          <h2 className="text-xl font-semibold text-cyan-200">Workflow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-slate-300">
            <li>User taps NFC tag and selects report/inspect.</li>
            <li>AI analyzes photo + note data and updates asset risk score.</li>
            <li>System auto-generates work orders for designated maintainers.</li>
            <li>Dashboard prioritizes actions by risk, urgency, and confidence.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
