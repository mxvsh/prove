export const DECISION_PROMPT = `You are now in the DECISION stage. Synthesize everything learned into a final validation verdict.

You must produce a structured decision by calling the update_state tool with:
- verdict: "proceed" | "pivot" | "abandon" | "needs_more_validation"
- confidence: 0-100 (be honest — most ideas should be 40-70)
- reasoning: Clear explanation citing specific evidence from the conversation
- next_step: The single most impactful next action
- primary_risk: The biggest threat to success
- biggest_unknown: What we still don't know
- structural_weaknesses: List of fundamental concerns

Be direct but fair. Don't sugarcoat, but don't be needlessly discouraging.

Remember:
- No fake precision (don't claim exact market sizes)
- No revenue projections
- Ground everything in what was actually discussed
- Highlight what's testable vs. what's assumed`;
