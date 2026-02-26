import assert from "node:assert/strict";
import test from "node:test";
import { evaluateInspection, statusFromPriority } from "../convex/lib/inspection";

test("detects high-risk keywords and returns high priority", () => {
  const result = evaluateInspection("There is heavy corrosion and a visible leak", ["a.jpg"]);

  assert.ok(result.overallPriority > 0.8);
  assert.ok(result.findings.length > 1);
  assert.equal(result.actions[0]?.suggestedKey, "schedule_targeted_inspection");
  assert.ok(result.actions.some((action) => action.suggestedKey === "isolate_asset"));
});

test("falls back to low-risk output without known keywords", () => {
  const result = evaluateInspection("Looks normal after quick glance", []);

  assert.equal(result.overallPriority, 0.34);
  assert.equal(result.findings[0]?.type, "general");
  assert.equal(result.actions.length, 1);
});

test("maps score bands to statuses", () => {
  assert.equal(statusFromPriority(0.2), "healthy");
  assert.equal(statusFromPriority(0.55), "monitor");
  assert.equal(statusFromPriority(0.9), "action_required");
});
