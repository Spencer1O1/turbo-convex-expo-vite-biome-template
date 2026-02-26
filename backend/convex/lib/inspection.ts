export type InspectionFinding = {
  type: string;
  severity: number;
  evidence: string;
};

export type InspectionAction = {
  suggestedKey: string;
  title: string;
  description: string;
  reason: string;
  priority: number;
  riskValue: number;
  recommendedSteps: string[];
  estimatedCost: number;
};

export type InspectionResult = {
  summary: string;
  overallPriority: number;
  findings: InspectionFinding[];
  actions: InspectionAction[];
};

const severityKeywords: Array<{ keyword: string; type: string; base: number }> = [
  { keyword: "corrosion", type: "corrosion", base: 0.86 },
  { keyword: "rust", type: "corrosion", base: 0.8 },
  { keyword: "leak", type: "leak", base: 0.9 },
  { keyword: "crack", type: "structural", base: 0.88 },
  { keyword: "fray", type: "wear", base: 0.65 },
  { keyword: "smoke", type: "electrical", base: 0.95 },
  { keyword: "sparks", type: "electrical", base: 0.92 },
  { keyword: "noise", type: "vibration", base: 0.54 },
  { keyword: "vibration", type: "vibration", base: 0.61 },
  { keyword: "stuck", type: "operational", base: 0.58 },
];

export function evaluateInspection(notes: string, photoUrls: string[]): InspectionResult {
  const lower = notes.toLowerCase();
  const findings = severityKeywords
    .filter(({ keyword }) => lower.includes(keyword))
    .map(({ keyword, type, base }) => ({
      type,
      severity: Number((base + Math.min(photoUrls.length * 0.01, 0.08)).toFixed(2)),
      evidence: `Detected keyword "${keyword}" in report notes.`,
    }));

  const normalizedFindings =
    findings.length > 0
      ? findings
      : [
          {
            type: "general",
            severity: 0.34,
            evidence: "No high-risk terms found; maintaining a monitor posture.",
          },
        ];

  const overallPriority = Number(
    (
      normalizedFindings.reduce((sum, finding) => sum + finding.severity, 0) /
      normalizedFindings.length
    ).toFixed(2),
  );

  const topRisk = normalizedFindings.reduce(
    (max, item) => (item.severity > max.severity ? item : max),
    normalizedFindings[0],
  );

  const actions: InspectionAction[] = [
    {
      suggestedKey: "schedule_targeted_inspection",
      title: "Schedule targeted inspection",
      description: "Dispatch a maintenance worker for a focused physical inspection.",
      reason: `Top detected risk category is ${topRisk.type}.`,
      priority: overallPriority,
      riskValue: Math.round(overallPriority * 100),
      recommendedSteps: [
        "Verify issue on-site and capture close-up photos",
        "Tag components requiring immediate replacement",
        "Create or update work order with findings",
      ],
      estimatedCost: Math.max(40, Math.round(overallPriority * 450)),
    },
  ];

  if (overallPriority >= 0.75) {
    actions.push({
      suggestedKey: "isolate_asset",
      title: "Temporarily isolate asset",
      description: "Prevent use until a maintainer marks it safe.",
      reason: "Priority exceeds high-risk threshold.",
      priority: Number((overallPriority - 0.04).toFixed(2)),
      riskValue: Math.round(overallPriority * 100),
      recommendedSteps: [
        "Place visible out-of-service label",
        "Notify assigned maintainer and manager",
        "Re-test after mitigation",
      ],
      estimatedCost: 75,
    });
  }

  return {
    summary:
      overallPriority >= 0.75
        ? "High-risk signals detected. Immediate maintenance action recommended."
        : overallPriority >= 0.5
          ? "Moderate risk profile detected. Prompt follow-up is recommended."
          : "Low risk profile. Continue monitoring and routine inspections.",
    overallPriority,
    findings: normalizedFindings,
    actions,
  };
}

export function statusFromPriority(priority: number): "healthy" | "monitor" | "action_required" {
  if (priority >= 0.75) {
    return "action_required";
  }

  if (priority >= 0.45) {
    return "monitor";
  }

  return "healthy";
}
