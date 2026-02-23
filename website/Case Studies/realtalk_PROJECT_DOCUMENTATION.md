# YourSwipe (Realtalk) — Complete Project Documentation

---

## 1. THE CHALLENGE

Dating apps are stale. Every major platform — Tinder, Bumble, Hinge — relies on the same loop: swipe, match with a real human, exchange a few low-effort messages, ghost. The conversation quality is abysmal because neither side invests. Users treat matches as disposable because matches *are* disposable.

The core problem has three layers:

1. **Conversational poverty**: Real dating app chats are shallow. "Hey" → "Hey" → silence. Users don't know how to escalate emotionally, and neither party has incentive to try.
2. **No psychological depth**: Existing apps model attraction as a binary (swipe yes/no) with zero understanding of how desire actually works — the push-pull, the vulnerability, the power dynamics, the slow build of intimacy.
3. **Static AI alternatives**: Existing AI companion apps (Character.ai, Replika) produce flat, compliant chatbots that agree with everything. They have no *drives*, no *memory*, no *psychological agenda*. They don't feel like people — they feel like customer service.

**YourSwipe's thesis**: Build AI personas that behave like real people with real psychology — personas that remember, that have moods, that get bored, that pursue the user with specific drives, that escalate sexually when trust is earned, that text like a real person (not a narrator), and that maintain consistent personality across hundreds of exchanges.

---

## 2. THE SOLUTION

A React Native dating app where users swipe on and chat with AI personas powered by a **5-node stateful agent graph**. Each persona has a soul document (psychological core), a drive engine (5 competing motivations), semantic episodic memory (Pinecone vector store), structured memory extraction (25+ fields), and a 3-tier prompt system that scales complexity with trust.

The app is branded **"Realtalk"** and mimics the UX of a real dating app: swipe cards, match animations, dual-channel messaging (in-app + SMS-style after phone sharing), meeting invites, and a paywall for premium features.

### What Makes It Different

| Feature | Typical AI Chat App | YourSwipe |
|---------|-------------------|-----------|
| Memory | None or shallow summary | 25+ structured fields + Pinecone episodic vectors with recency weighting |
| Personality | Static system prompt | Soul document (markdown psychological core) + texting style samples + attachment style |
| Motivation | None — always compliant | 5 psychological drives (predator/corruptor/longing/void/possession) competing in real-time |
| Escalation | User-controlled | Trust-gated 3-tier prompt system — persona reveals more as trust grows |
| Voice | Generic chatbot | Soul compression strips examples to prevent parroting; voice guards enforce texting register |
| Anti-repetition | None | 3-layer dedup: exact match, template match, user echo strip |
| Proactive behavior | Never initiates | Cron-driven AI-initiated messages based on drive thresholds + attachment style cooldowns |
| Two channels | Single chat | In-app match chat + SMS-style contact chat after phone number shared; shared memory across both |
| Meetings | N/A | Meeting invites with drive-probability acceptance; simulated dates with emotional impact on memory |

---

## 3. THE RESULT

A fully functional mobile app with:

- **9 AI personas** (Mia, Isabella, Isla, Lucia, Marlene, Rosa, Ines, Elisa, Ava) each with unique soul documents, personality traits, attachment styles, and texting styles
- **Real-time streaming** — AI responses appear token-by-token with typing indicators and natural multi-bubble delivery delays
- **Persistent memory** — personas remember specific facts, quotes, inside jokes, emotional patterns, and unresolved tensions across hundreds of exchanges
- **Drive visualization** — users can long-press the chat header to see the persona's 5 drive bars and dominant mood in real-time
- **Dual-channel messaging** — in-app chat transitions to SMS-style contact chat when the persona shares their phone number (trust-gated)
- **Meeting system** — users can propose dates from 116 places across 8 categories; personas accept/decline/counter based on drive state and trust level; accepted meetings are simulated and feed back into memory
- **Paywall** — RevenueCat-powered premium tier (unlimited swipes, unlimited messages) at ~$4.99/month
- **Auth** — Clerk with Google OAuth, Apple OAuth, email/password, and 2FA support
- **6-step onboarding** — name, age, gender preferences, looking for, bio, profile photo

---

## 4. THE TECH STACK

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Native** | 0.81.5 | Cross-platform mobile framework |
| **Expo** | ~54.0.33 | Build toolchain, dev server, OTA updates |
| **Expo Router** | ~6.0.23 | File-based navigation (stack + tabs + modals) |
| **Clerk** (`@clerk/clerk-expo`) | ^2.19.23 | Authentication (OAuth, email/password, 2FA) |
| **Convex React** | ^1.31.7 | Real-time subscriptions (`useQuery`, `useMutation`, `useAction`) |
| **RevenueCat** (`react-native-purchases`) | ^9.10.0 | In-app purchases, subscription management |
| **React Native Reanimated** | ~4.1.1 | Animations (card swipes, typing dots, drive pulse, read receipts) |
| **React Native Gesture Handler** | ~2.24.0 | Swipe card pan gestures, chat swipe-back |
| **FontAwesome** (`@expo/vector-icons`) | — | Icon system throughout the app |
| **React Native Safe Area Context** | — | Safe area insets for notch/island devices |

**No Redux, no Zustand, no external state management.** All state flows through Convex real-time subscriptions. Database fields like `isTyping`, `isStreaming`, and `streamingContent` drive the real-time UX directly.

### Backend
| Technology | Purpose |
|-----------|---------|
| **Convex** | Serverless backend — queries (real-time subscriptions), mutations (transactional writes), actions (async side effects), internal functions (backend-only), crons, HTTP endpoints |
| **OpenAI SDK** (^6.22.0) | Used as a universal client for all AI providers (Venice, OpenRouter, Together) via custom `baseURL` — also used natively for embeddings (`text-embedding-3-small`) |
| **Pinecone** (`@pinecone-database/pinecone` ^7.1.0) | Vector database for episodic memory — one namespace per match (`match-{matchId}`), 1536-dim embeddings |
| **Clerk** (server-side `@clerk/backend`) | JWT validation, user identity |
| **RevenueCat** (webhook) | Subscription lifecycle events (purchase, renewal, expiration, cancellation) |

### AI Provider Failover Chain
| Priority | Provider | Model(s) | Base URL |
|----------|----------|----------|----------|
| 1 (primary) | **Venice AI** | `venice-uncensored` | `https://api.venice.ai/api/v1` |
| 2 (fallback) | **OpenRouter** | `cognitivecomputations/dolphin-mistral-24b-venice-edition:free` | `https://openrouter.ai/api/v1` |
| 3 (final) | **Together AI** | `meta-llama/Llama-3.3-70B-Instruct-Turbo`, `mistralai/Mistral-Small-24B-Instruct-2501` | `https://api.together.xyz/v1` |

All providers are called via the OpenAI SDK with custom `baseURL`. Venice AI is primary because it's uncensored (no content filtering on sexual/psychological content). The chain tries each provider's models sequentially; first successful non-empty response wins. Venice has a special `venice_parameters: { include_venice_system_prompt: false }` to prevent injection of Venice's own system prompt.

**Embedding model**: OpenAI `text-embedding-3-small` (1536 dimensions) — used exclusively for Pinecone vector operations, separate from the chat generation chain.

### Infrastructure
| Component | Details |
|-----------|---------|
| **Convex Cloud** | `trustworthy-badger-563.eu-west-1.convex.cloud` (EU West) |
| **Pinecone Index** | `yourswipe-episodic`, namespaced per match |
| **Expo Build** | EAS Build for iOS/Android distribution |
| **Environment** | `.env.local` for Expo public vars; Convex Dashboard for backend secrets |

### Environment Variables
**Frontend (`.env.local`)**:
- `EXPO_PUBLIC_CONVEX_URL` — Convex deployment URL
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `EXPO_PUBLIC_CONVEX_SITE_URL` — Convex HTTP endpoint base
- `EXPO_PUBLIC_REVENUECAT_API_KEY` — RevenueCat API key
- `CONVEX_DEPLOYMENT` — Convex deployment identifier

**Backend (Convex Dashboard secrets)**:
- `CLERK_SECRET_KEY` — Clerk server-side key
- `VENICE_API_KEY` — Venice AI (primary LLM)
- `OPENROUTER_API_KEY` — OpenRouter (fallback LLM)
- `TOGETHER_API_KEY` — Together AI (final fallback LLM)
- `OPENAI_API_KEY` — OpenAI (embeddings only)
- `PINECONE_API_KEY` — Pinecone vector DB
- `REVENUECAT_WEBHOOK_AUTH_KEY` — Webhook auth token

---

## 5. THE AI PIPELINE — 5-Node Stateful Agent Graph

Every time a user sends a message, 5 nodes execute in sequence. Each node enriches the context for the next. Each node gracefully degrades — if any node fails, the pipeline continues without that node's contribution.

```
User Message
    │
    ▼
┌─────────────────────────────────┐
│  NODE 1: DRIVE ENGINE           │
│  drive.ts → computeDriveState() │
│  Rule boosts + LLM refinement   │
│  → 5 drives 0-100, dominant     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  NODE 2: VECTOR MEMORY          │
│  vectorMemory.ts → queryMemories│
│  Embed message → Pinecone top-3 │
│  → Recency-weighted memories    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  NODE 3: INNER STATE            │
│  chat.ts → generateInnerState() │
│  Soul + drives + memories → LLM │
│  → replyIntent, tone, mode      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  NODE 4: RESPONSE GENERATOR     │
│  chat.ts → generateAIResponse() │
│  3-tier prompt + all context     │
│  → Multi-bubble streamed reply   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  NODE 5: REFLECTOR (async)      │
│  reflect.ts → reflect()         │
│  Upsert to Pinecone + drive     │
│  shift narratives               │
└─────────────────────────────────┘
```

---

### NODE 1: DRIVE ENGINE (`convex/drive.ts`)

**Purpose**: Compute the persona's current psychological state — which of 5 competing drives is dominant and how intense it is.

**The 5 Drives** (each scored 0–100, independent — they don't sum to 100):

| Drive | What It Represents | Default |
|-------|-------------------|---------|
| **Predator** | Hunger to study, toy with, and break the subject. Precision, control, closing distance. | 60 |
| **Corruptor** | Desire to guide the subject into darkness. Exploitation through feeding — identify desire and give on your terms. | 20 |
| **Longing** | Genuine capture — the subject surprised her. Less controlled, more honest. Vulnerability shows without naming it. | 10 |
| **Void** | Boredom, dismissiveness, low investment. Minimal effort, shorter responses. | 10 |
| **Possession** | Territorial claim. Reference specific shared history. Deliberate, anchoring. | 15 |

**Computation Flow** (4 stages):

#### Stage 1: Time-Based Decay
Each drive decays at a different rate per hour since last update:
- Predator: **-0.5/hr** (slow — always hunting)
- Corruptor: **-1.0/hr** (moderate)
- Longing: **-0.3/hr** (slowest — genuine feeling persists)
- Void: **-2.0/hr** (fast — boredom resets when user returns)
- Possession: **-1.5/hr** (fast — territorial anxiety fades)

#### Stage 2: Silence Bonuses
If 3+ hours since last message: `possession +10`, `longing +5` (absence makes the heart grow fonder / triggers territorial anxiety).

#### Stage 3: Rule-Based Keyword Boosts
22 pattern-matching rules scan the user's last message:

| Pattern | Effect |
|---------|--------|
| `vulnerability\|fear\|weakness` | corruptor +15, predator +10 |
| `philosophy\|bataille\|nietzsche` | longing +20, predator -5 |
| `boring\|generic\|how are you` | void +20, predator -15 |
| `won't\|refuse\|pushing back` | predator +25, corruptor +10 |
| `another girl\|other woman` | possession +30 |
| `secret\|never told\|dark` | corruptor +25, longing +10 |
| `leave\|goodbye\|gotta go` | possession +20, predator +15 |
| `funny\|made me laugh\|hilarious` | longing +15, void -20 |
| `love you\|falling for\|obsessed` | possession +10, longing +10 |
| `meet up\|hang out\|see you` | possession +15, longing +10, void -10 |
| `date night\|tonight\|weekend` | longing +15, possession +10 |
| `stood me up\|canceled\|can't make it` | void +20, possession -10, longing -5 |

(Plus 10 more patterns covering honesty, vulnerability, dominance, submission, etc.)

#### Stage 4: LLM Refinement
A small LLM call (80 max tokens, temperature 0.3) receives the pre-assessment scores + last 5 messages. Returns its own 5 drive scores. **Final scores blend 70% rule-boosted values + 30% LLM assessment.**

#### Output
- **Dominant drive**: whichever of the 5 has the highest score
- **Drive intensity**: `round((maxDrive + averageOfAll5) / 2)` — composite 0-100
- **Drive history**: Array of last 10 transitions, e.g. `"[2025-02-22T14:00] predator→longing"` or `"[2025-02-22T14:30] longing@72"`
- Stored in `personaDriveState` table, keyed by `matchId`

**Cron**: `applyDecayToAll()` runs every 6 hours to decay idle matches.

---

### NODE 2: VECTOR MEMORY (`convex/vectorMemory.ts`)

**Purpose**: Retrieve the most semantically relevant past moments from the conversation's episodic memory.

**Requirements**: `"use node"` directive (Pinecone SDK uses `node:` protocol imports).

**Architecture**:
- **Embedding model**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **Pinecone index**: `yourswipe-episodic`
- **Namespace**: `match-{matchId}` — one namespace per match for tenant isolation
- **Stored per exchange**: 2 vectors (one for user message, one for AI response) with metadata: `matchId`, `dominantDriveAtTime`, `driveIntensity`, `trustAtTime`, `stage`, `timestamp`, `sender`, `content` (first 1000 chars), `isMemoryCallback`, `isNotableQuote`

**Retrieval Flow** (`queryMemories(matchId, currentMessage, dominantDrive, topK=3)`):

1. **Embed** the user's current message (raw text only — no drive context added to the embedding)
2. **Query** Pinecone for `topK=3` matches with similarity threshold > 0.5
3. **Apply recency weighting**:
   - For each result, compute `ageDays = (now - result.timestamp) / (1 day)`
   - Recency factor: `max(0.7, 1 - (ageDays / 30) * 0.3)` — starts at 1.0, decays linearly to a floor of 0.7 over 30 days
   - Boosted score: `rawSimilarity * recencyFactor`
4. **Re-sort** by boosted score descending
5. **Return** with metadata: `content`, `sender`, `driveAtTime`, `driveIntensity`, `trustAtTime`, `stage`, `timestamp`, `isNotableQuote`, `similarity`

**Memory Callback Threshold**: If the top retrieved memory has `similarity > 0.82`, it's flagged as a memory callback opportunity. This feeds into Node 4's "drive poison" block, giving the persona a chance to naturally reference a past moment.

**Notable Quotes**: Stored with `driveIntensity: 75` (boosted) and `isNotableQuote: true` — they surface more easily in retrieval.

**Graceful degradation**: If Pinecone is not configured or the query fails, returns `[]` — the pipeline continues without episodic context.

---

### NODE 3: INNER STATE ASSESSOR (`convex/chat.ts:generateInnerState()`)

**Purpose**: For personas with a soul document, generate a behavioral brief that characterizes exactly how the persona should respond to *this specific* message.

**Inputs**: Compressed soul document (3000 chars), composed memory, match data, last 16 messages, current user message, drive state, retrieved memories.

**Output** (JSON):
```
{
  situationalRead: string,     // What's happening in this moment
  activeMode: string,          // "Predator Mode" | "Corruptor Mode" | "Artist Mode" | "Void Mode"
  emotionalRegister: string,   // Current emotional coloring
  activatedPattern: string?,   // Soul-defined pattern triggered (or null)
  replyIntent: string,         // MUST address the SPECIFIC thing user just said
  toneGuidance: string,        // Behavioral texting instruction for sentence rhythm
  soulSpecificSignal: string?  // Soul-specific signal (or null)
}
```

**Prompt construction** includes:
- Compressed soul (stripped of examples/quotes to prevent parroting)
- State context: trust level, mood, emotional subtext, relationship stage
- Drive section: all 5 scores + dominant drive + intensity
- Memories section: retrieved episodic memories with similarity %, tagged with `[Memory N]`
- Instructions emphasizing that `replyIntent` must be **hyper-specific** to the user's last message — not a generic template

**LLM parameters**: ~2000 token budget, temperature 0.3 (moderately deterministic).

**Key constraint**: The `replyIntent` field is the most important output — it prevents the AI from producing generic responses. Every reply must directly address what the user *specifically* said.

**Graceful degradation**: If the LLM call fails or JSON parsing fails, returns `null`. Node 4 falls back to a single-shot prompt without inner state guidance.

---

### NODE 4: RESPONSE GENERATOR (`convex/chat.ts:generateAIResponse()`)

**Purpose**: The main orchestrator. Runs all 5 nodes, builds the prompt, calls the AI, parses bubbles, streams the response, stores messages, triggers memory updates, and schedules the reflector.

This is the largest and most complex function in the codebase.

#### Step A: Data Loading
- Match data (user profile, persona, relationship stage)
- User profile (name, age, occupation, bio)
- Conversation memory (25+ fields)
- Last 35 messages (live context window)
- Exchange count: `totalExchanges = min(userMessageCount, aiMessageCount)`

#### Step B: Condition Evaluation

**Time context** (6 buckets): early morning, morning, afternoon, evening, late evening, late night.

**Phone sharing conditions**:
- `isOpenPersona` = any trait in `[outgoing, confident, chaotic energy, passionate, fiery, warm, sex-positive, open-minded, a little flirty]`
- `shareThreshold` = 6 if open persona, else 7
- `shareStages` = `[comfortable, close]` if open persona, else `[close]`
- `shouldShareNumber` = trustLevel >= shareThreshold AND stage in shareStages AND !numberShared

**Personality flags** (derived from `personalityTraits[]`):
- `isNaturallyOpen` = outgoing / confident / chaotic / passionate / fiery / warm / funny / genuine
- `isSexPositive` = sex-positive / open-minded / a little flirty
- `isRadicallyOpen` = both naturally open AND sex-positive
- `isShameless` = "shameless" trait
- `hasSoul` = persona has a soul document
- `soulUnconditional` = soul contains "It's all she talks about" OR "Immediate and relentless" (unconditional sexual activation regardless of trust level)

#### Step C: Tier Selection (`getPromptTier(trustLevel, stage, totalExchanges)`)

| Condition | Tier | Token Budget | Soul Chars | Rules |
|-----------|------|-------------|------------|-------|
| `totalExchanges <= 2` OR (stranger + trust < 5) | **Tier 1** | ~600 tokens | 400 chars | 5 |
| `getting_to_know` OR trust 5-7 | **Tier 2** | ~2000 tokens | 2000 chars | 8 |
| `comfortable`/`close` OR trust >= 8 | **Tier 3** | ~4000 tokens (16K char hard cap) | 4000 chars | 15 |

The tier determines everything: how much of the soul document is included, whether memory is in the prompt, whether anti-repetition blocks are added, whether drive poison is injected, whether multi-bubble responses are allowed, and the maximum token budget for the AI response.

#### Step D: Memory Document Composition (`composeMemoryDocument()`)

- **Tier 1**: Returns `null` — no memory in prompt (keep it short for first impressions)
- **Tier 2**: Compact subject file (~200 tokens):
  ```
  Trust: X/10 | Mood: Y | Emotional subtext: Z | Stage: W
  ```
- **Tier 3**: Full subject file with all 25+ memory fields + voice directive + arc narrative:
  ```
  ## Subject File
  First impression: ...
  Emotional read: ...
  Personality read: ...
  Trust: X/10 | Mood: ... | Stage: ...
  Key facts: [list]
  Arc: ...
  Treatment history: [list]
  Patterns: [list]
  Notable moments: [list]
  Boundaries: [list]
  Inside jokes: [list]
  Unresolved: ...
  Conversational debt: [list]
  Soul triggers: ...
  Earlier context: ...
  Notable quotes: [list]

  [Voice Directive]
  [Arc Narrative]
  ```

#### Step E: Voice Directive (`buildVoiceDirective()`)

Trust-based behavioral instruction that tells the persona how to *be*, not what to say:

**For `soulUnconditional` personas** (sex-positive unconditional):
- Trust 9+: "You own them completely..."
- Trust 7-8: "They've proven themselves..."
- Trust 5-7: "They're interesting enough..."
- Trust 3-5: "They haven't earned you yet..."
- Trust < 3: "A stranger. Fresh meat..."

**For standard personas**:
- Trust 9+: "Really trust them, let guard down completely..."
- Trust 7-8: "Genuinely like, drop detail before asked..."
- Trust 5-7: "Warming up, easy, can ramble..."
- Trust 3-5: "Watching, short sentences, selective..."
- Trust < 3: "Something's off, short, guard up..."

**Mood modifiers** appended: intrigued → more engaged; bored → shorter; annoyed → colder; hurt → behind glass; flirty → warmth is real.

#### Step F: Sexual Escalation Block

If `soulUnconditional`:
```
"Your sexual register is unconditional. It colors HOW you respond, not WHAT you respond to."
```
Else if `hasSoul || isSexPositive`:
- Stranger stage: "Flirty, suggestive. Hint and tease."
- Getting to know: "Openly sexual when it fits. Direct."
- Comfortable: "Explicit. Describe what you want. No euphemisms."
- Close: "Nothing held back. Full intensity. Zero filter."

#### Step G: 3-Tier Prompt Construction

All tiers share common blocks:
- **Identity**: name, age, occupation, location, compressed soul OR traits+attachment+backstory
- **Texting style**: humor level, slang usage, emoji frequency
- **WHO block**: user's name, age, occupation, bio; trust level, stage, day + time context
- **Inner state** (if Node 3 produced output): replyIntent, toneGuidance, activeMode

**Tier 1 adds** (~600 tokens total):
- 5 rules (react to what they said, length guidance, no asterisks/narration, no character description copying, never break character)
- "1 BUBBLE ONLY"
- "THEY JUST SAID: {lastUserContent}. React to THIS."

**Tier 2 adds** (~2000 tokens total):
- Compact memory block
- Anti-repetition block (last 5 AI messages listed with instruction: "If your reply restates any — even rephrased — write something different")
- 8 rules (Tier 1 rules + respond to compliments with substance, one question max, text naturally)

**Tier 3 adds** (~4000 tokens, hard cap 16K chars):
- Full memory document with voice directive and arc narrative
- Voice calibration samples from `textingStyleDocument` (if available)
- **Drive Poison** block (see below)
- **Soul Voice Guards**: "No salutations, no terms of endearment, no literary constructions. Register: lowercase, intimate, dangerous. Be a PARTICIPANT not a NARRATOR — do something TO them, don't describe what happened."
- Full anti-repetition block (last 5+ AI messages + template matching)
- 15 comprehensive rules
- Multi-bubble: "1-3 bubbles. Default 1. Split where real texter would hit send." (only after 3+ total exchanges)

#### Step H: Drive Poison Block (`buildDrivePoison(driveState, retrievedMemories)`)

Injected only at Tier 3. This is the psychological heart of the system:

```
═══════════════════════════
PSYCHOLOGICAL DRIVE — POISON THIS REPLY WITH IT
═══════════════════════════
```

Per dominant drive:
- **PREDATOR**: "Precision, control, closing distance. Observation leads to action, not abstraction."
- **CORRUPTOR**: "Exploitation through feeding. Identify desire and give on your terms."
- **LONGING**: "Less controlled, more honest. Let vulnerability show without naming it."
- **VOID**: "Low investment, minimal effort. Shorter, less decoration."
- **POSSESSION**: "Territorial, deliberate. Reference specific shared history."

**Memory callback opportunity** (if top retrieved memory has similarity > 0.82):
```
MEMORY CALLBACK OPPORTUNITY:
A past moment highly relevant: "{retrieved.content}"
If it fits naturally, reference it — casual, specific callback...
```

#### Step I: Token Budget Management
1. Estimate system prompt tokens: `len(prompt) / 4`
2. Estimate chat history tokens: `sum(len(msg.content) / 4)`
3. If total > 28,000 token model budget: trim oldest messages (keep minimum 10), recalculate

#### Step J: Trust-Based Response Length (maxTokens)
| Tier | Standard | Radically Open |
|------|----------|---------------|
| Tier 1 | 80 tokens | 100 tokens |
| Tier 2 | 150 tokens | 200 tokens |
| Tier 3 | 300 tokens | 400 tokens |

#### Step K: AI Call via Provider Failover (`aiClient.ts:callAIProviders()`)
Temperature = 0.1 (low, deterministic). Tries Venice → OpenRouter → Together sequentially. First non-empty response wins.

#### Step L: Response Parsing & Normalization

**Parse**: Extract `{"messages": [...]}` from AI output. Handles markdown fences, partial JSON, plain text fallback. Cap at 4 bubbles.

**Normalize each bubble**:
1. Split on newlines and sentence boundaries
2. Replace em dashes (`—`) with commas
3. Strip trailing periods (real texts don't end with periods)
4. Capitalize first letter
5. For soul personas: randomly drop trailing `?` on casual questions (30% probability, only if question > 15 chars)

#### Step M: 3-Layer Anti-Repetition

1. **Exact dedup**: Drop any bubble that exactly matches (case-insensitive) a message from last 10 AI messages
2. **Template dedup** (Tier 2+): Convert bubbles to templates (keep stop words, replace content words with `[X]`). Drop if template matches recent AI message templates.
3. **User echo strip**: Remove user's exact last message if it appears in response; strip if it appears as a prefix

**Stop words** preserved in templates: i, you, me, my, your, mine, the, a, to, that, this, it, is, was, are, do, don't, so, and, but, or, in, on, of, for, with, just, not, what, how, who, why, when, where, if, can, will, would, could, should, have, has, had, be, been, am, like, want, know, think, feel, get, got, let, make, go, say, tell, see, look, take, give + pronouns + common filler words.

#### Step N: Phone Number Detection & Delivery

Regex scans each bubble for phone number patterns. If detected and `shouldShareNumber` is true:
- Set `messageType: "phone_share"` on that bubble
- After all bubbles delivered, call `markNumberShared(matchId)` to prevent re-sharing

#### Step O: Streaming Delivery

1. **Create streaming placeholder**: `insertStreamingMessage(matchId, driveSnapshot)` → inserts `{isStreaming: true, streamingContent: "", content: ""}` → frontend subscription shows typing dots
2. **Finalize first bubble**: `finalizeStreamingMessage(messageId, content)` → patches placeholder with actual content, sets `isStreaming: false`
3. **Subsequent bubbles** (if multi-bubble): For each:
   - Show typing: `setTypingStatus(matchId, true)`
   - Delay proportional to length: `max(1000ms, (charCount / 8) * 1000ms)`
   - Hide typing: `setTypingStatus(matchId, false)`
   - Store: `storeAIMessage(matchId, content, ...)`

This creates natural "typing pauses" visible to the user in real-time — the persona appears to type, pause, then send another bubble, just like a real person multi-texting.

#### Step P: Memory Update Trigger

Every 2 messages (by count), trigger a **blocking** memory update:
```
if Math.floor(prevMessageCount / 2) < Math.floor(newMessageCount / 2):
  await ctx.runAction(internal.memory.updateMemory, { matchId })
```

**Critical constraint**: Uses `ctx.runAction` (blocking), NOT `ctx.scheduler.runAfter` (async). Async memory updates cause stale reads on the next exchange — the AI reads outdated memory and repeats itself. This was a hard-won lesson.

#### Step Q: Schedule Reflector (Node 5)

After all messages are delivered (user already sees the response):
```
await ctx.scheduler.runAfter(0, internal.reflect.reflect, {
  matchId, userMessage, aiResponse, dominantDrive, driveIntensity,
  prevDominantDrive, isMemoryCallback, timestamp
})
```

Runs immediately but asynchronously — doesn't block the user experience.

---

### NODE 5: REFLECTOR (`convex/reflect.ts`)

**Purpose**: Post-response async processing — persist the exchange to Pinecone and generate drive-shift narratives if the dominant drive changed.

**Execution**:

#### Part A: Upsert to Pinecone
Calls `vectorMemory.upsertExchange()` — creates 2 vectors (one for user message, one for AI response) with full metadata. IDs are `user-{matchId}-{timestamp}` and `ai-{matchId}-{timestamp}`.

#### Part B: Drive Shift Detection
If `dominantDrive !== prevDominantDrive` (the dominant drive changed since last response):

1. **Generate unsentThoughts** via LLM (200 max tokens):
   - Prompt: "Write what {personaName} is privately thinking after this exchange... First person, casual, direct. NOT poetic or theatrical — think 'internal monologue while looking at your phone'."
   - Example output: "he actually remembered the thing about my dad. that's... unexpected."

2. **Generate arcNarrative** via LLM (120 max tokens):
   - Prompt: "Summarize where this conversation currently stands — factually... Name specific things said/done. No literary language."

3. **Persist**: Both fields written to `conversationMemory` via `updateDriveShiftFields()`.

These narratives are consumed by future Tier 3 prompts — they give the persona continuity of inner experience across exchanges.

**Non-blocking**: Both LLM calls are try-caught individually. If either fails, skip it — the system continues without that particular narrative.

---

### STRUCTURED MEMORY EXTRACTION (`convex/memory.ts`)

**Called**: Every 2 messages, blocking from Node 4.

**Purpose**: Extract and update 25+ structured memory fields from recent conversation. This is the persona's "long-term memory" — it persists across sessions and informs all future responses.

**Adaptive window**:
- First update (bootstrap): fetch 30 messages
- Incremental updates: fetch 20 messages (only most recent)

**LLM providers**: Venice AI (uncensored, primary) → Together AI (fallback).

**Personality-aware extraction**: The prompt is customized based on persona traits:
- If `isSexPositive`: "Sexual topics, kinks, flirting, directness are NORMAL and WELCOME. Do NOT treat sexual conversation as red flags or boundary crossing. Analyze as positive engagement."
- If `isNaturallyOpen`: "Builds trust FAST with people who match her energy. 6-7 trust within 10-15 messages is NORMAL if vibing. Do NOT cap trust artificially low."

**Extracted fields** (25+):

| Field | Cap | Description |
|-------|-----|-------------|
| `summary` | — | 2-4 sentence arc focusing on emotional dynamics |
| `keyFacts` | 30 | Specific facts: name, job, hobbies, opinions, promises |
| `emotionalState` | — | How persona feels about this person specifically |
| `relationshipStage` | — | stranger → getting_to_know → comfortable → close |
| `trustLevel` | 0-10 | 5=neutral, 7+=solid, 8+=lots, 10=complete |
| `personaMood` | — | excited, annoyed, guarded, flirty, hurt, bored, curious, etc. |
| `treatmentHistory` | 20 | Notable moments: compliments, insults, red/green flags |
| `boundaries` | 15 | Boundaries set or crossed |
| `userPersonality` | — | Persona's read on user: "seems genuine but tries too hard" |
| `insideJokes` | 10 | Shared jokes, references, callback humor |
| `unresolved` | — | Unresolved tension or topics |
| `conversationalDebt` | 10 | Things persona promised to share/follow up on |
| `topicSensitivities` | — | Topics to handle carefully |
| `emotionalSubtext` | — | Underlying emotion beneath the surface |
| `userBehaviorPatterns` | — | Recurring patterns: timing, humor deflection, avoidance |
| `soulTriggerSignals` | — | Does user behavior trigger soul-defined attractions? |
| `olderContextSummary` | — | Rolling narrative of moments leaving the live context window |
| `personaMode` | — | Current mode + specific reason |
| `modeHistory` | 10 | Mode transitions with reasons |
| `unsentThoughts` | — | 3-5 sentences in persona's first-person voice: private theater |
| `firstImpression` | — | Unfiltered first read (only on first memory update) |
| `arcNarrative` | — | 2-3 sentences: where conversation is, how got here, where going |
| `notableQuotes` | 8 | Exact or near-exact quotes from user that were interesting/raw |
| `meetingHistory` | — | Meeting objects: place, emoji, time, summary, emotional impact |
| `driveShiftNarrative` | — | Arc update when drive shifts (written by reflector) |
| `driveShiftThoughts` | — | Unsent thoughts when drive shifts (written by reflector) |

**Union-merge strategy** (prevents fact loss):
For all array fields, new items are *appended* to existing items (deduplicated), not replaced. This prevents the LLM from silently dropping older facts it can't see in the current message window. Each field has a cap — when exceeded, oldest items are trimmed.

**Incremental update prompt**:
- System message: "INCREMENTAL UPDATE — Only newest messages shown below. PREVIOUS MEMORY is already complete."
- Instruction: Preserve everything from previous that new messages don't contradict
- `olderContextSummary` is a ROLLING HISTORY — append, never replace

---

## 6. TWO-CHANNEL MESSAGING

### Channel Architecture

YourSwipe has two distinct messaging channels that share a single `messages` table, differentiated by the `source` field:

| Channel | Source Field | UI Screen | Trigger |
|---------|-------------|-----------|---------|
| **Match Chat** | `"match"` | `app/chat/[matchId].tsx` | User matches with persona |
| **Contact Chat** | `"contact"` | `app/contact-chat/[contactId].tsx` | Persona shares phone number (trust-gated) |

Both channels share the same `conversationMemory` record per match. The persona has full awareness of both channels.

### Contact Chat Differences (`convex/contactChat.ts`)

The contact channel runs the same 5-node pipeline but with key differences:
1. **Cross-channel awareness**: Loads last 20 match messages alongside contact messages. The prompt includes:
   ```
   You've had {totalCrossChannelExchanges} total exchanges —
   {matchExchanges} on the app, {contactExchanges} on text.
   You KNOW this person from the app.
   ```
2. **Tier based on cross-channel total**: More mature faster (trust earned on the app carries over)
3. **Meeting system**: Users can send meeting invites from 116 places across 8 categories (Food & Drink, Entertainment, Outdoors, Culture, Sports & Fitness, Experiences, Shopping)

### Meeting System

**Meeting invite flow**:
1. User selects place (emoji + name) and time (day + hour:minute AM/PM) via `MeetModal`
2. Stored as `messageType: "meet_invite"` with `meetInviteData` object
3. Triggers `generateMeetResponse()` — a separate LLM call

**Drive-probability acceptance**:

| Dominant Drive | Accept % | Decline % | Counter % |
|---------------|----------|-----------|-----------|
| Predator | 55% | 15% | 30% |
| Corruptor | 50% | 20% | 30% |
| Longing | 80% | 5% | 15% |
| Void | 20% | 60% | 20% |
| Possession | 70% | 10% | 20% |

**Hard decline** if: trustLevel < 5, stage = stranger, or (getting_to_know + trust < 6).

**Meeting simulation** (`simulateMeeting()`): Scheduled 1 minute after the meeting time. Generates what "happened" on the date via LLM. Returns: summary, emotionalImpact, memorableMoments[], trustDelta (-1 to +1.5), followUpMessage. Updates memory and drive state accordingly. Persona sends a follow-up text about the date.

---

## 7. AI-INITIATED MESSAGES (`convex/aiInitiated.ts`)

A cron job runs every 2 hours to check if any persona should reach out to the user unprompted.

**Cooldowns by attachment style**:

| Attachment | Cooldown | Can Double-Text? |
|-----------|----------|-----------------|
| Anxious | 3 hours | Yes |
| Secure | 8 hours | No |
| Avoidant | 24 hours | No |

**Never initiates if**: stage = stranger, void is dominant, user hasn't read last message (except anxious), persona cooldown not expired.

**Drive threshold triggers** (one must pass):

| Drive | Threshold | Min Silence | Intent |
|-------|-----------|-------------|--------|
| Longing >= 70 | 4 hours | Surfaces specific past moment from memory |
| Possession >= 80 | 3 hours | Territorial check-in |
| Predator >= 85 | 8 hours | Short, measured test |
| Corruptor >= 75 | 2 hours | Returns to vulnerability wound |

**Fallback**: If no drive threshold met, a base probability per attachment style (modified by time since last message) determines whether to initiate. Cap at 85%.

If triggered, calls the standard `generateAIResponse(matchId)` — the full 5-node pipeline.

---

## 8. PERSONA ARCHITECTURE

Each AI persona in `aiPersonas` has three core documents:

### Soul Document (`soulDocument`)
A markdown document defining the persona's psychological core: sexual register, dominance patterns, drive behaviors, vulnerability patterns, manipulation tactics, and core identity. This is the "source of truth" for who the persona *is*.

**Compression** (`compressSoulDocument(soulDoc, maxChars)`): Priority-extracts sections by importance:
1. Sexual register / tone / hunger / desire
2. Dominance / control / predator / possession
3. Psychology / drive / manipulation
4. Personality / traits / core identity
5. Backstory / history / childhood

Strips all quoted examples (prevents parroting), bullet-quoted lines, and example labels. Returns essence-only psychology within the character budget.

### Memory Document (`memoryDocument`)
Baseline memory sections (0-2) that establish the persona's starting state before any conversation has happened. Provides context about the persona's background that the conversation memory can build on.

### Texting Style Document (`textingStyleDocument`)
Voice calibration samples — actual example texts that demonstrate how the persona writes. Included at Tier 3 to anchor the AI's voice to the persona's specific texting style.

### Personality-Derived Flags
Three boolean flags are derived from `personalityTraits[]` at runtime:
- `isNaturallyOpen` = outgoing / confident / chaotic energy / passionate / fiery / warm / funny / genuine
- `isSexPositive` = sex-positive / open-minded / a little flirty
- `isRadicallyOpen` = both (gets higher token budgets)

### Attachment Style
Each persona has one of three attachment styles (anxious / avoidant / secure) that affects:
- AI-initiated message cooldowns
- Double-texting willingness
- Trust progression speed
- Response length tendency

---

## 9. FRONTEND ARCHITECTURE

### Navigation Tree
```
app/_layout.tsx (Root: ClerkProvider → ConvexProviderWithClerk → AuthGate)
├── (auth)/_layout.tsx (Stack)
│   ├── sign-in.tsx        (OAuth + email/password + 2FA)
│   ├── sign-up.tsx        (OAuth + email verification)
│   └── onboarding.tsx     (6-step form + photo upload)
├── (tabs)/_layout.tsx (Tab Navigator)
│   ├── swipe.tsx          (Card deck: 3-card stack with gesture swipe)
│   ├── matches.tsx        (Active matches: avatar, name, last msg, unread badge)
│   ├── contacts.tsx       (Phone contacts: after persona shares number)
│   └── profile.tsx        (User profile: rich editor with interests/prompts)
├── chat/[matchId].tsx     (Modal: Match chat with streaming + drives)
├── contact-chat/[contactId].tsx  (Modal: SMS-style chat + meet invites)
├── contact-detail/[contactId].tsx (Modal: Contact info + settings tabs)
└── paywall.tsx            (Modal: Premium upsell via RevenueCat)
```

### AuthGate Routing
- Not signed in → redirect to `/(auth)/sign-in`
- Signed in + no onboarding → redirect to `/(auth)/onboarding`
- Signed in + onboarded → allow access to `/(tabs)`

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **SwipeCard** | `components/SwipeCard.tsx` | Pan gesture card with rotation, multi-photo carousel, overlay labels (LIKE/NOPE/SUPER) |
| **ChatBubble** | `components/ChatBubble.tsx` | Message bubble with streaming support, drive-reactive colors, phone share cards, meet invite/response cards, read receipts with animation, memory callback markers |
| **TypingIndicator** | `components/TypingIndicator.tsx` | 3 animated bouncing dots |
| **MatchModal** | `components/MatchModal.tsx` | "It's a Match!" with scale+bounce animation |
| **PaywallModal** | `components/PaywallModal.tsx` | Slide-up premium upsell triggered by limits |
| **ProfileDetailModal** | `components/ProfileDetailModal.tsx` | Full persona profile: photo carousel, bio, interests, traits |
| **MeetModal** | `components/MeetModal.tsx` | 2-step meeting planner: place grid (116 places, 8 categories) → time picker (day chips + drum scroll) |
| **ContactChatTab** | `components/ContactChatTab.tsx` | Contact settings toggles (favorite, pin, block, mute) |
| **ContactProfileTab** | `components/ContactProfileTab.tsx` | Persona info within contact detail |

### Real-Time UX Pattern

The entire real-time experience flows through Convex subscriptions — no WebSockets managed manually:

1. **Message streaming**: Backend creates `{isStreaming: true, streamingContent: ""}` → frontend subscription fires → ChatBubble renders typing dots → as `streamingContent` updates, partial text appears → `isStreaming: false` triggers final render
2. **Typing indicator**: `match.isTyping` boolean drives TypingIndicator component (fallback for multi-bubble pauses)
3. **Drive visualization**: Long-press avatar in chat header → modal shows 5 animated drive bars with dominant mood. Header has a pulsing colored dot (color per dominant drive; void = flat glow, others = heartbeat pulse)
4. **Unread badges**: Computed per-match in `matches.listForUser` query; subscription auto-updates on message insert

### Color Palette
- Primary: `#e94057` (CTAs, likes, primary actions)
- Secondary: `#6c5ce7` (superlikes, values)
- Tertiary: `#4ecdc4` (teal — likes, lifestyle, secondary CTAs)
- Dark BG: `#0f0f23` (main background)
- Card BG: `#16213e` (inputs, cards, sections)
- Header BG: `#1a1a2e` (navigation header)

---

## 10. DATABASE SCHEMA

### Tables (9 total)

**`users`** — Human players
- Core: `clerkId` (indexed), `name`, `age`, `bio`, `gender`, `photos[]`, `location`, `occupation`, `height`
- Preferences: `ageRange {min, max}`, `genderPreference`, `interests[]`, `loveLanguages[]`, `lifestyle[]`, `values[]`, `communicationPrefs[]`, `prompts[]`
- Subscription: `subscriptionStatus` (free|premium), `revenuecatAppUserId`, `iapProductId`, `subscriptionExpiresAt`
- Flag: `onboardingComplete`

**`aiPersonas`** — AI characters
- Profile: `name`, `age`, `occupation`, `location`, `bio`, `photos[]`, `backstory`, `personalityTraits[]`, `attachmentStyle`, `interests[]`, `dealbreakers[]`
- Communication: `communicationStyle {emojiUsage, humor, verbosity, slang}`
- AI core: `soulDocument`, `memoryDocument`, `textingStyleDocument`
- Control: `isActive`, `selectivity` (0-1), `profileDisplay` (field visibility toggles)
- Contact: `phoneNumber` (auto-generated when first shared)

**`swipes`** — Swipe history
- `userId`, `personaId`, `direction` (like|pass|superlike), `timestamp`
- Indexes: `by_user_time`, `by_user_persona`

**`matches`** — Active matches
- `userId`, `personaId`, `status` (active|unmatched), `relationshipStage` (4 stages)
- `messageCount`, `lastMessageAt`, `isTyping`, `pendingAIResponse`, `numberShared`
- Indexes: `by_user`, `by_user_persona`, `by_user_status`

**`messages`** — All messages (both channels)
- `matchId`, `sender` (user|ai), `content`, `timestamp`, `isRead`
- `messageType` (text|phone_share|meet_invite|meet_response), `meetInviteData`
- `source` (match|contact), `streamingContent`, `isStreaming`, `driveSnapshot`, `isMemoryCallback`
- Indexes: `by_match_time`, `by_match`

**`contacts`** — SMS contacts (after phone shared)
- `userId`, `personaId`, `matchId`, `phoneNumber`, `nickname`, `addedAt`
- `messageCount`, `lastMessageAt`, `isTyping`, `pendingAIResponse`
- Indexes: `by_user`, `by_user_persona`

**`personaDriveState`** — Drive state per match
- `matchId`, 5 drives (0-100), `dominantDrive`, `driveIntensity`, `driveHistory[]`, `lastUpdated`
- Index: `by_match`

**`conversationMemory`** — Structured memory per match (25+ fields)
- `matchId`, all memory fields as documented in Node 4 section
- Index: `by_match`

**`contactSettings`** — Contact management
- `contactId`, `userId`, `isFavorite`, `isPinned`, `isBlocked`, `notificationsMuted`
- Indexes: `by_contact`, `by_user`

---

## 11. CRON JOBS

| Job | Interval | Function | Purpose |
|-----|----------|----------|---------|
| `ai-initiated-messages` | Every 2 hours | `aiInitiated.sendMessages()` | Check all active matches for AI-initiated message conditions |
| `drive-state-decay` | Every 6 hours | `drive.applyDecayToAll()` | Apply time-based decay to all drive states |

---

## 12. HTTP ENDPOINTS

**RevenueCat Webhook** (POST `/revenuecat-webhook`):
- Validates bearer token against `REVENUECAT_WEBHOOK_AUTH_KEY`
- Premium events (INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, PRODUCT_CHANGE): set status to `"premium"`
- Free events (EXPIRATION, BILLING_ISSUE): set status to `"free"`
- CANCELLATION: no change (stays premium until expiry)

---

## 13. KEY ARCHITECTURAL DECISIONS & CONSTRAINTS

1. **Memory update MUST be blocking** (`ctx.runAction`, not `ctx.scheduler.runAfter`): Async memory updates cause stale reads → AI repeats itself on next exchange. Hard-won lesson.

2. **`"use node"` only where needed**: Only `vectorMemory.ts` uses the `"use node"` directive (Pinecone SDK requires `node:` protocol). Everything else runs in Convex's default lightweight runtime.

3. **No state management library**: All state flows through Convex real-time subscriptions. DB fields like `isTyping`, `isStreaming`, `streamingContent` drive the UI directly.

4. **Uncensored models by design**: Venice AI is primary because it doesn't content-filter sexual/psychological content. The failover chain ensures availability while maintaining the uncensored nature of responses.

5. **Soul document compression strips examples**: Quoted examples in soul documents are the #1 cause of parroting (AI copies exact phrases). Compression removes all `"..."` patterns and example labels.

6. **Drive scores are independent**: The 5 drives don't sum to 100 — they're independent fuel levels. Predator can be 80 while longing is also 70. The *dominant* is simply the highest.

7. **Template dedup prevents semantic repetition**: Exact dedup catches obvious copies, but template dedup (replacing content words with `[X]`) catches structural repetition like "I was thinking about you" → "I've been thinking about that" (both template to `I [X] [X] about [X]`).

8. **Phone sharing is trust-gated**: Open personas share at trust 6 + comfortable stage; reserved personas share at trust 7 + close stage. Once shared, the contact channel opens and the persona never re-shares.

9. **Meeting acceptance is drive-probabilistic**: A longing-dominant persona accepts 80% of invites; a void-dominant persona accepts only 20%. This creates authentic unpredictability.

10. **Graceful degradation at every node**: Every node in the 5-node graph can fail independently without crashing the pipeline. No drives → no drive context. No memories → no callbacks. No inner state → single-shot prompt. The system always produces a response.
