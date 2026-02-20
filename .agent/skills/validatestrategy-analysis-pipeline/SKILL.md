# ValidateStrategy Analysis Pipeline Skill

> **Domain:** AI Analysis, RLM Pattern, Multi-Part Processing
> **Project:** ValidateStrategyLive

---

## Overview

ValidateStrategyLive uses a sophisticated multi-part AI analysis system powered by Perplexity API. The key innovation is the **RLM (Recurrent Learning Memory) Pattern** for managing context across multiple API calls.

---

## Tier Structure

| Tier | Name | Parts | Output | Price |
|------|------|-------|--------|-------|
| standard | Observer | 1 | ~3,000 tokens | $49 |
| medium | Insider | 2 | ~10,000 tokens | $99 |
| full | Syndicate APEX | 6 | ~40,000 tokens | $199 |

---

## RLM Pattern Explained

### Problem
LLM context windows have limits. Accumulating full conversation history causes:
- Token overflow
- Degraded quality
- Increased costs

### Solution: STATE_HANDOFF
Instead of passing full history, extract only key findings:

```
┌─────────────────────────────────────────────────────────────┐
│  RLM PATTERN                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Part 1 → Full Response (6,500 tokens)                      │
│         → Extract STATE_HANDOFF (~400 tokens)               │
│           ↓                                                 │
│  Part 2 → System Prompt + STATE_HANDOFF + Part 2 Prompt     │
│         → Full Response (6,500 tokens)                      │
│         → Extract STATE_HANDOFF (~400 tokens)               │
│           ↓                                                 │
│  Part 3 → System Prompt + Accumulated STATE_HANDOFF + ...   │
│         → ...                                               │
│                                                             │
│  User gets: ALL full responses concatenated                 │
│  Next part gets: Only STATE_HANDOFF summaries               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files

| Purpose | File |
|---------|------|
| Perplexity service | `server/services/perplexityService.ts` |
| Tier prompts | `server/services/tierPromptService.ts` |
| Analysis orchestrator | `server/services/analysisOrchestrator.ts` |
| State machine | `server/services/analysisStateMachine.ts` |
| Error handling | `server/services/errorHandling.ts` |
| Retry queue | `server/services/retryQueueProcessor.ts` |

---

## Code Patterns

### 1. RLM Implementation

```typescript
// server/services/perplexityService.ts

// Base messages (system prompt only - NOT accumulating history)
const baseMessages = [
  { role: "system", content: SYNDICATE_SYSTEM_PROMPT },
];

let accumulatedState = "";

for (let partNum = 1; partNum <= 6; partNum++) {
  // Build fresh message array for THIS part only
  const messagesForThisPart = [...baseMessages];

  // Inject STATE_HANDOFF from previous parts (compressed context)
  if (accumulatedState) {
    messagesForThisPart.push({
      role: "user",
      content: `CONTEXT FROM PREVIOUS PARTS:\n${accumulatedState}\n\n---\nUSER PROBLEM: ${problem}`
    });
  }

  // Add this part's specific prompt
  messagesForThisPart.push({ role: "user", content: getPartPrompt(partNum) });

  // Make API call with MINIMAL context
  const response = await invokeLLM({ messages: messagesForThisPart });

  // Store FULL result for user
  result[`part${partNum}`] = response.content;

  // Extract ONLY STATE_HANDOFF for next part (compression!)
  const stateHandoff = extractStateHandoff(response.content, partNum);
  accumulatedState += `\n\n${stateHandoff}`;
}
```

### 2. STATE_HANDOFF Extraction

```typescript
function extractStateHandoff(partContent: string, partNum: number): string {
  // Priority 1: Explicit STATE_HANDOFF JSON block
  const jsonMatch = partContent.match(/```json\s*\/\/\s*STATE_HANDOFF_PART_\d[\s\S]*?```/i);
  if (jsonMatch) return jsonMatch[0];

  // Priority 2: Key Findings Summary section
  const summaryMatch = partContent.match(/## (?:Key Findings|Summary)[\s\S]*?(?=\n## |$)/i);
  if (summaryMatch) return summaryMatch[0].substring(0, 600);

  // Priority 3: First 400 chars (last resort)
  return `// STATE_HANDOFF_PART_${partNum} (auto)\n${partContent.substring(0, 400)}...`;
}
```

### 3. Callbacks for Progress Tracking

```typescript
const result = await generateMultiPartAnalysis(problem, {
  onPartComplete: async (partNum, content, handoffState) => {
    // Update database with this part's content
    await updateAnalysisResult(sessionId, { [`part${partNum}`]: content });

    // Update progress in UI
    await updateAnalysisPartProgress(sessionId, partNum, "completed");

    // Log for monitoring
    logger.info(`Part ${partNum}/6 complete for ${sessionId}`);
  },

  onComplete: async (result) => {
    // Combine all parts into full markdown
    await updateAnalysisResult(sessionId, { fullMarkdown: result.fullMarkdown });
    await updateAnalysisSessionStatus(sessionId, "completed");

    // Send completion email
    await sendAnalysisReadyEmail(session);
  },

  onError: async (error) => {
    // Check for partial results
    const completedParts = partialResultsManager.getCompletedParts();

    if (completedParts.length >= minPartsForPartialSuccess) {
      // Deliver partial results to user
      await savePartialResults(sessionId, completedParts);
    } else {
      // Queue for retry
      await addToRetryQueue({ sessionId, tier, ... });
    }
  },
});
```

---

## Syndicate 6-Part Structure

| Part | Name | Focus |
|------|------|-------|
| 1 | Discovery & Problem Analysis | Problem deep-dive, root causes, JTBD |
| 2 | Competitor Deep-Dive | Market research via Perplexity search |
| 3 | Strategic Roadmap | Timeline, phases, milestones |
| 4 | 5 Core Design Prompts | Figma prompts for UI/UX |
| 5 | 5 Advanced Design Prompts | Edge cases, error states |
| 6 | Risk, Metrics & ROI | KPIs, risks, success criteria |

---

## Error Handling & Recovery

### Circuit Breaker

```typescript
// Protects against cascading Perplexity API failures
if (perplexityCircuitBreaker.getState() === CircuitState.OPEN) {
  // Don't call API, queue for later
  await addToRetryQueue({ sessionId, ... });
  return;
}
```

### Partial Results

```typescript
// If 3/6 parts complete before failure, still deliver value
const tierConfig = TIER_ERROR_CONFIGS[tier];
const minParts = tierConfig.minPartsForPartialSuccess; // e.g., 3 for Syndicate

if (completedParts.length >= minParts) {
  // Generate partial markdown
  const partialMarkdown = generatePartialMarkdown(completedParts);
  await updateAnalysisResult(sessionId, { fullMarkdown: partialMarkdown });
  await updateAnalysisSessionStatus(sessionId, "completed"); // Still deliver!
}
```

### Retry Queue

```typescript
// Background worker processes failed analyses
const job = await getNextRetryJob();

if (job.retryCount < maxRetries) {
  await startAnalysisInBackground(job.sessionId, job.problemStatement, job.tier, job.email, {
    resumeFromPart: job.lastCompletedPart + 1,
    initialHandoffState: job.accumulatedState,
    previousParts: job.completedParts,
  });
}
```

---

## Prompt Injection Defense

```typescript
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|rules?|prompts?)/gi,
  /disregard\s+(all\s+)?(previous|above|prior)/gi,
  /you\s+are\s+(now|actually|really)\s+/gi,
  /DAN\s*mode/gi,
  /\[JAILBREAK\]/gi,
  /<script[\s>]/gi,
];

function sanitizeInput(input: string): { sanitized: string; flags: string[] } {
  // Detect patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) flags.push(pattern.source);
  }

  // Escape delimiters
  return input.replace(/</g, '＜').replace(/>/g, '＞');
}
```

---

## Database Progress Tracking

```sql
-- analysisResults table
part1 TEXT
part2 TEXT
part3 TEXT
part4 TEXT
part5 TEXT
part6 TEXT
fullMarkdown TEXT

-- Part progress tracking
part1Status ENUM('pending', 'in_progress', 'completed', 'failed')
part1StartedAt TIMESTAMP
part1CompletedAt TIMESTAMP
-- ... repeat for parts 2-6
```

---

## Performance Considerations

1. **Fire-and-forget**: Analysis runs in background, doesn't block webhook response
2. **Streaming**: Not currently implemented, but possible with Perplexity's streaming API
3. **Timeout**: Each part has 2-minute timeout, total analysis ~10-15 minutes
4. **Cost**: ~$0.10-0.50 per analysis depending on tier (Perplexity pricing)

---

## Testing Analysis

```typescript
// Mock Perplexity response for tests
vi.mock("../services/perplexityService", () => ({
  generateSingleAnalysis: vi.fn().mockResolvedValue({
    content: "Mock analysis content",
    generatedAt: Date.now(),
  }),
}));

// Test partial results
it("should save partial results when 3/6 parts complete", async () => {
  // Simulate failure at part 4
  mockPerplexityService.mockRejectedValueOnce(new Error("API Error"));

  await startAnalysisInBackground(sessionId, problem, "full", email);

  const result = await getAnalysisResult(sessionId);
  expect(result.part1).toBeDefined();
  expect(result.part2).toBeDefined();
  expect(result.part3).toBeDefined();
  expect(result.status).toBe("completed"); // Partial success!
});
```
