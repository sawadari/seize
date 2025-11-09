# Controlling Detail Levels in Claude Code: A Comprehensive Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Author**: SEIZE Project Team

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Comparison](#architecture-comparison)
3. [Control Mechanisms in Claude Code](#control-mechanisms-in-claude-code)
4. [Detail Level Configuration](#detail-level-configuration)
5. [Practical Examples](#practical-examples)
6. [Best Practices](#best-practices)
7. [Advanced Patterns](#advanced-patterns)

---

## Introduction

This guide explains how to control the level of detail and autonomy when using Claude Code's Task tool (subagents), comparing it with the approaches described in [Phil Schmid's "The Rise of Subagents"](https://www.philschmid.de/the-rise-of-subagents).

### Why Control Detail Levels?

**Problem**: Monolithic agents suffer from **context pollution** - when a single agent handles multiple complex tasks, its context window becomes cluttered, leading to:
- Decreased reliability
- Loss of focus on specific tasks
- Mixing of unrelated information

**Solution**: Subagents with controlled scope and detail levels.

---

## Architecture Comparison

### Phil Schmid's Two Approaches

#### 1. **Explicit, User-Defined Subagents** (Claude Code Model)

```
┌─────────────────────────────────────────────┐
│           Main Orchestrator                 │
│  (Analyzes & Decomposes Tasks)              │
└────────────┬────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐      ┌──────────┐
│ Agent  │      │  Agent   │      │  Agent   │
│  Type  │      │   Type   │      │   Type   │
│   A    │      │    B     │      │    C     │
└────────┘      └──────────┘      └──────────┘
 Predefined     Predefined        Predefined
 Tools          Tools             Tools
```

**Characteristics**:
- ✅ Permanent team of specialists
- ✅ Manual tool assignment (full control)
- ✅ Predictable behavior
- ✅ Easy to test in isolation
- ✅ More secure
- ⚠️ Requires explicit agent definitions
- ⚠️ Less flexible for novel tasks

#### 2. **Implicit, On-the-Fly Subagents** (Poke.com Model)

```
┌─────────────────────────────────────────────┐
│        Dynamic Orchestrator                 │
│  (Creates agents as needed)                 │
└────────────┬────────────────────────────────┘
             │
    ┌────────┴────────────┐
    │                     │
┌───▼────────┐      ┌─────▼──────┐
│  Agent     │      │   Agent    │
│ (Created   │      │  (Created  │
│  Runtime)  │      │  Runtime)  │
└────────────┘      └────────────┘
 Dynamic            Dynamic
 Tool Selection     Tool Selection
```

**Characteristics**:
- ✅ Flexible for emerging tasks
- ✅ No need to predefine agents
- ✅ Adapts to novel requirements
- ⚠️ Less predictable
- ⚠️ Harder to debug
- ⚠️ Tool selection can misfire

### Claude Code's Approach

**Claude Code uses the Explicit Model** with sophisticated control mechanisms:

```
User Request
     │
     ▼
┌─────────────────────────────────────┐
│  Claude Code (Main Agent)           │
│  - Intent parsing                   │
│  - Agent type selection             │
│  - Detail level specification       │
└────────────┬────────────────────────┘
             │
             ▼
      Task Tool Invocation
             │
    ┌────────┴─────────┐
    │                  │
┌───▼──────────┐  ┌───▼──────────┐
│ Specialized  │  │ Specialized  │
│ Sub-agent A  │  │ Sub-agent B  │
│              │  │              │
│ - Isolated   │  │ - Isolated   │
│   context    │  │   context    │
│ - Dedicated  │  │ - Dedicated  │
│   tools      │  │   tools      │
│ - Specific   │  │ - Specific   │
│   prompt     │  │   prompt     │
└──────────────┘  └──────────────┘
     │                  │
     └────────┬─────────┘
              ▼
        Final Report
              │
              ▼
      Claude Code Synthesis
```

---

## Control Mechanisms in Claude Code

### 1. **Agent Type Selection**

Claude Code provides **specialized agent types**, each with predefined capabilities:

#### Available Agent Types

| Agent Type | Purpose | Detail Level | Tools Available |
|-----------|---------|--------------|-----------------|
| `general-purpose` | Complex multi-step tasks | High autonomy | All tools (*) |
| `Explore` | Codebase exploration | Variable (quick/medium/thorough) | All tools |
| `Plan` | Planning and decomposition | Variable | All tools |
| `code-reviewer` | Code quality review | Medium | Read, Grep, Glob |
| `tile-efficiency-analyzer` | Mahjong tile analysis | Highly specialized | Read, Write, Bash |
| `3d-designer` | Three.js/3D graphics | Domain-specific | Read, Write, Edit, Bash, Grep, Glob |
| `ui-ux-reviewer` | UI/UX design review | Analysis-focused | Read, Grep, Glob, Write |
| `legal-document-analyzer` | Legal document analysis | Specialized | Read, Grep, Glob, Write |

#### Agent Selection Strategy

```typescript
// Pseudo-code for agent selection logic
function selectAgent(taskIntent: string, complexity: string): AgentType {
  if (isCodebaseExploration(taskIntent)) {
    return {
      type: 'Explore',
      thoroughness: determineExplorationDepth(complexity)
    };
  }

  if (isPlanningTask(taskIntent)) {
    return {
      type: 'Plan',
      thoroughness: determinePlanningDepth(complexity)
    };
  }

  if (isDomainSpecific(taskIntent)) {
    return selectSpecializedAgent(taskIntent);
  }

  return 'general-purpose';
}
```

### 2. **Thoroughness Specification**

For exploration and planning agents, you can explicitly specify detail levels:

#### Thoroughness Levels

```markdown
**quick**: Basic searches, minimal depth
- Single-pass exploration
- Primary files only
- Fast turnaround (~30s)

**medium**: Moderate exploration
- Multi-location search
- Related files included
- Balanced speed/depth (~2min)

**thorough** / **very thorough**: Comprehensive analysis
- Exhaustive codebase scan
- Multiple naming conventions
- Cross-reference analysis (~5min)
```

#### Example Usage

```javascript
// In your prompt to Claude Code:

// Quick exploration (low detail)
"Use the Explore agent with quick thoroughness to find React components"

// Medium exploration (balanced)
"Use the Explore agent with medium thoroughness to understand the auth flow"

// Thorough exploration (high detail)
"Use the Explore agent with very thorough level to map all API endpoints"
```

### 3. **Tool Access Control**

Each agent type has **explicit tool restrictions**:

```yaml
# Example: UI/UX Reviewer Agent
tools:
  - Read      # Can read files
  - Grep      # Can search code
  - Glob      # Can find files
  - Write     # Can write reports

# Explicitly CANNOT:
  - Edit      # Cannot modify code
  - Bash      # Cannot execute commands
  - Task      # Cannot spawn sub-agents
```

**Why this matters**:
- Prevents scope creep
- Maintains security boundaries
- Ensures predictable behavior
- Limits potential damage

### 4. **Prompt Engineering for Detail Control**

#### Structure of Effective Prompts

```markdown
# Detailed Task Specification Template

## Context
[What the agent needs to know]

## Objective
[Primary goal - be specific]

## Detail Level
[quick | medium | thorough]

## Expected Output
[Exactly what you want back]

## Constraints
[What to avoid or limit]

## Success Criteria
[How to know it's complete]
```

#### Examples by Detail Level

**Low Detail (Quick Scan)**:
```
Task: Use Explore agent (quick) to find all TypeScript files
containing "useAuth" hook

Expected: List of file paths only
```

**Medium Detail (Balanced)**:
```
Task: Use Explore agent (medium) to understand how authentication
works in this codebase

Expected:
- Main auth files
- Flow description (2-3 paragraphs)
- Key functions/classes
```

**High Detail (Comprehensive)**:
```
Task: Use Explore agent (very thorough) to create complete
authentication system documentation

Expected:
- Full auth flow diagram
- All involved files with line references
- Configuration details
- Security considerations
- Integration points
- Error handling patterns
```

---

## Detail Level Configuration

### Method 1: Explicit in Prompt

```javascript
// User to Claude Code:
"Use the Explore agent with 'medium' thoroughness to find
all error handling patterns in the codebase"

// Claude Code will invoke:
Task(
  subagent_type: "Explore",
  prompt: "Find all error handling patterns...",
  thoroughness: "medium"  // ← Explicit control
)
```

### Method 2: Implied by Task Complexity

```javascript
// Simple request → Quick
"Find the main component"
→ Explore agent (quick)

// Moderate request → Medium
"Explain how routing works"
→ Explore agent (medium)

// Complex request → Thorough
"Document the entire state management system"
→ Explore agent (very thorough)
```

### Method 3: Model Selection

```javascript
// For lightweight tasks, specify model
Task(
  subagent_type: "Explore",
  model: "haiku",  // ← Faster, less detailed
  prompt: "Quick file search..."
)

// For deep analysis
Task(
  subagent_type: "Explore",
  model: "sonnet",  // ← Default, balanced
  prompt: "Comprehensive analysis..."
)

Task(
  subagent_type: "general-purpose",
  model: "opus",  // ← Most capable, detailed
  prompt: "Complex multi-step task..."
)
```

### Method 4: Iterative Refinement

```javascript
// Start with low detail
const quickResult = await Task({
  type: "Explore",
  thoroughness: "quick",
  prompt: "Find auth-related files"
});

// If insufficient, increase detail
if (needsMoreDetail(quickResult)) {
  const detailedResult = await Task({
    type: "Explore",
    thoroughness: "very thorough",
    prompt: "Comprehensive auth system analysis"
  });
}
```

---

## Practical Examples

### Example 1: Codebase Exploration with Variable Detail

#### Scenario: Understanding a new codebase

```markdown
User: "I need to understand how this e-commerce app works"

Claude Code Decision Tree:
1. Start with quick exploration
2. Identify key areas
3. Deep dive into specific domains
```

**Step 1: Quick Overview**
```javascript
Task({
  subagent_type: "Explore",
  thoroughness: "quick",
  prompt: `
    Provide a high-level overview of this e-commerce application:
    - Main directories
    - Technology stack
    - Entry points
  `
})
```

**Step 2: Medium Detail on Key Areas**
```javascript
Task({
  subagent_type: "Explore",
  thoroughness: "medium",
  prompt: `
    Explain the following systems in this e-commerce app:
    - Product catalog management
    - Shopping cart implementation
    - Checkout flow

    For each, provide:
    - Main files (with line refs)
    - Key functions
    - Data flow (2-3 sentences)
  `
})
```

**Step 3: Deep Dive on Critical Component**
```javascript
Task({
  subagent_type: "Explore",
  thoroughness: "very thorough",
  prompt: `
    Comprehensive analysis of the payment processing system:
    - All involved files with detailed line references
    - Complete flow from cart to confirmation
    - Security measures
    - Error handling
    - Third-party integrations
    - Test coverage
  `
})
```

### Example 2: Specialized Agent with Controlled Scope

#### Scenario: UI/UX Review without code modification

```javascript
// User request
"Review the UI/UX of the checkout page and provide improvement suggestions"

// Claude Code invokes UI/UX reviewer (cannot modify code)
Task({
  subagent_type: "ui-ux-reviewer",
  prompt: `
    Review the checkout page UI/UX:

    Files to review:
    - src/pages/Checkout.tsx
    - src/components/CheckoutForm.tsx
    - src/styles/checkout.css

    Analyze:
    1. User flow clarity (high detail)
    2. Accessibility compliance (WCAG 2.1)
    3. Visual hierarchy
    4. Mobile responsiveness
    5. Form validation UX

    Provide:
    - Detailed findings report
    - Prioritized recommendations
    - Mockup suggestions (describe only, no code)

    DO NOT:
    - Modify any code
    - Execute any commands
    - Create new files
  `
})
```

**Agent Constraints**:
- ✅ Can read files
- ✅ Can search patterns
- ✅ Can write analysis report
- ❌ Cannot edit code
- ❌ Cannot run commands

### Example 3: Multi-Agent Workflow with Varying Details

#### Scenario: Feature implementation with review

```javascript
// Step 1: Planning (high detail)
const plan = await Task({
  subagent_type: "Plan",
  thoroughness: "very thorough",
  model: "sonnet",
  prompt: `
    Create a detailed implementation plan for adding
    a "wishlist" feature to the e-commerce app.

    Include:
    - Database schema changes
    - API endpoints needed
    - Frontend components
    - State management updates
    - Testing strategy
    - Migration plan
  `
});

// Step 2: Implementation (medium autonomy)
const implementation = await Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: `
    Implement the wishlist feature according to this plan:
    ${plan}

    Autonomy level: Medium
    - Implement core functionality
    - Ask before major architectural decisions
    - Create unit tests
    - Update relevant documentation
  `
});

// Step 3: Code Review (high detail)
const review = await Task({
  subagent_type: "code-reviewer",
  model: "sonnet",
  prompt: `
    Comprehensive code review of wishlist implementation:

    Review depth: Very thorough

    Check:
    - Code quality and style
    - Security vulnerabilities
    - Performance issues
    - Test coverage
    - Documentation completeness
    - Edge cases handling

    Provide detailed report with:
    - File:line references for all issues
    - Severity levels
    - Specific fix suggestions
  `
});
```

### Example 4: Parallel Agents with Different Detail Levels

```javascript
// User request
"Analyze this codebase for potential issues"

// Claude Code launches multiple agents in parallel
await Promise.all([
  // Quick security scan
  Task({
    subagent_type: "security-analyzer",
    thoroughness: "quick",
    prompt: "Scan for obvious security vulnerabilities (SQL injection, XSS)"
  }),

  // Medium complexity analysis
  Task({
    subagent_type: "code-reviewer",
    thoroughness: "medium",
    prompt: "Review code quality and style consistency"
  }),

  // Thorough performance analysis
  Task({
    subagent_type: "performance-analyzer",
    thoroughness: "very thorough",
    prompt: "Comprehensive performance profiling with bottleneck identification"
  })
]);
```

---

## Best Practices

### 1. **Match Detail Level to Task Complexity**

```markdown
❌ Bad: Using "very thorough" for simple file search
✅ Good: Use "quick" for file search, "thorough" for system understanding

❌ Bad: Using "quick" for security audit
✅ Good: Always use "very thorough" for security-critical analysis
```

### 2. **Start Broad, Then Deep**

```javascript
// Progressive detail increase
async function exploreCodebase() {
  // 1. Quick overview
  const overview = await quickScan();

  // 2. Identify interesting areas
  const areas = identifyKeyAreas(overview);

  // 3. Deep dive on specific areas
  for (const area of areas) {
    await thoroughAnalysis(area);
  }
}
```

### 3. **Use Specialized Agents**

```markdown
❌ Bad: Using general-purpose for domain-specific tasks
✅ Good: Use specialized agents when available

Example:
- Legal doc analysis → legal-document-analyzer
- 3D graphics → 3d-designer
- Mahjong AI → tile-efficiency-analyzer
```

### 4. **Explicit Output Requirements**

```javascript
// Vague (agent decides detail level)
"Analyze the authentication system"

// Explicit (you control detail level)
`Analyze the authentication system:

Output Requirements:
- List of all auth-related files (full paths)
- Flow diagram (mermaid syntax)
- Security assessment (100-150 words)
- Integration points (bullet list)
- Configuration details (JSON format)

Detail level: Medium (balance speed and thoroughness)`
```

### 5. **Constraint Specification**

```javascript
Task({
  subagent_type: "Explore",
  prompt: `
    Find database migration files.

    Constraints:
    - Search only in 'migrations/' directory
    - Focus on files modified in last 30 days
    - Exclude test migrations
    - Maximum 20 files in report

    Detail level: Quick (file paths only)
  `
})
```

### 6. **Stateless Agent Invocations**

```markdown
⚠️ Remember: Each Task invocation is stateless

❌ Bad:
Task 1: "Analyze auth system"
Task 2: "Now review the files we just found" ← Won't work

✅ Good:
Task: "Analyze auth system and review the files found"
```

### 7. **Model Selection for Performance**

```javascript
// Quick tasks → Use Haiku (fast, cost-effective)
Task({
  model: "haiku",
  subagent_type: "Explore",
  thoroughness: "quick",
  prompt: "Find all .tsx files"
})

// Standard tasks → Use Sonnet (default, balanced)
Task({
  model: "sonnet",  // Can be omitted (default)
  subagent_type: "general-purpose",
  prompt: "Implement feature X"
})

// Complex reasoning → Use Opus (most capable)
Task({
  model: "opus",
  subagent_type: "Plan",
  thoroughness: "very thorough",
  prompt: "Design system architecture for distributed microservices"
})
```

---

## Advanced Patterns

### Pattern 1: Cascading Detail Levels

```javascript
/**
 * Start with low detail, progressively increase if needed
 */
async function cascadingExploration(topic: string) {
  let detail = 'quick';
  let result;

  while (needsMoreDetail(result)) {
    result = await Task({
      subagent_type: "Explore",
      thoroughness: detail,
      prompt: `Explore ${topic} at ${detail} level`
    });

    detail = increaseDetail(detail); // quick → medium → very thorough

    if (detail === 'exhausted') break;
  }

  return result;
}
```

### Pattern 2: Domain-Specific Detail Control

```javascript
/**
 * Different detail levels for different domains
 */
const analysisPlan = {
  frontend: { detail: 'medium', agent: 'ui-ux-reviewer' },
  backend: { detail: 'very thorough', agent: 'security-analyzer' },
  database: { detail: 'medium', agent: 'general-purpose' },
  tests: { detail: 'quick', agent: 'Explore' }
};

for (const [domain, config] of Object.entries(analysisPlan)) {
  await Task({
    subagent_type: config.agent,
    thoroughness: config.detail,
    prompt: `Analyze ${domain} component`
  });
}
```

### Pattern 3: Conditional Detail Escalation

```javascript
/**
 * Escalate detail based on findings
 */
async function smartAnalysis(component: string) {
  const quickScan = await Task({
    subagent_type: "Explore",
    thoroughness: "quick",
    prompt: `Quick security scan of ${component}`
  });

  if (hasSecurityConcerns(quickScan)) {
    // Escalate to thorough analysis
    return await Task({
      subagent_type: "security-analyzer",
      thoroughness: "very thorough",
      model: "opus",  // Use most capable model
      prompt: `
        Comprehensive security audit of ${component}.
        Previous scan flagged potential issues: ${quickScan.concerns}

        Perform:
        - Vulnerability analysis
        - Threat modeling
        - Penetration testing scenarios
        - Compliance check (OWASP Top 10)
      `
    });
  }

  return quickScan;
}
```

### Pattern 4: Multi-Phase with Detail Handoff

```javascript
/**
 * Each phase has appropriate detail level
 */
async function featureImplementation(feature: string) {
  // Phase 1: High-level planning (medium detail)
  const plan = await Task({
    subagent_type: "Plan",
    thoroughness: "medium",
    prompt: `Create implementation plan for ${feature}`
  });

  // Phase 2: Detailed design (high detail)
  const design = await Task({
    subagent_type: "Plan",
    thoroughness: "very thorough",
    prompt: `Detailed technical design based on: ${plan}`
  });

  // Phase 3: Implementation (controlled autonomy)
  const code = await Task({
    subagent_type: "general-purpose",
    prompt: `
      Implement ${feature} following this design: ${design}

      Autonomy: Medium
      - Follow design exactly
      - Ask before deviating
      - Include tests
    `
  });

  // Phase 4: Review (high detail)
  const review = await Task({
    subagent_type: "code-reviewer",
    thoroughness: "very thorough",
    prompt: `Thorough review of implementation: ${code.files}`
  });

  return { plan, design, code, review };
}
```

### Pattern 5: Parallel Multi-Detail Analysis

```javascript
/**
 * Run multiple agents with different detail levels simultaneously
 */
async function comprehensiveAnalysis(codebase: string) {
  const [quick, medium, thorough] = await Promise.all([
    // Quick overview
    Task({
      subagent_type: "Explore",
      thoroughness: "quick",
      model: "haiku",
      prompt: "Quick codebase structure overview"
    }),

    // Medium detail on key areas
    Task({
      subagent_type: "Explore",
      thoroughness: "medium",
      model: "sonnet",
      prompt: "Analyze main business logic"
    }),

    // Deep dive on critical paths
    Task({
      subagent_type: "Explore",
      thoroughness: "very thorough",
      model: "opus",
      prompt: "Comprehensive security and performance analysis"
    })
  ]);

  return synthesize(quick, medium, thorough);
}
```

---

## Comparison Summary

### Claude Code vs Phil Schmid's Approaches

| Aspect | Claude Code | Implicit (Poke.com) |
|--------|-------------|-------------------|
| **Agent Definition** | Explicit, predefined | Dynamic, runtime |
| **Tool Assignment** | Manual, controlled | Automatic |
| **Detail Control** | Thoroughness levels | Implicit in prompt |
| **Predictability** | High | Medium |
| **Flexibility** | Medium (extensible) | High |
| **Security** | High (bounded) | Medium |
| **Debugging** | Easy | Harder |
| **Novel Tasks** | Requires new agent type | Handles automatically |
| **Context Management** | Isolated per agent | Isolated per agent |
| **State** | Stateless | Can persist |

### When to Use Each Model

**Use Claude Code's Explicit Model When**:
- Security is critical
- Predictability required
- Testing in isolation needed
- Clear domain boundaries exist
- You want full control

**Use Implicit Model When**:
- Tasks are highly dynamic
- Flexibility > predictability
- Novel/unexpected requirements
- Rapid prototyping
- Less security-sensitive

---

## Conclusion

Claude Code provides sophisticated control mechanisms for managing subagent detail levels:

1. **Agent Type Selection**: Choose specialized agents
2. **Thoroughness Specification**: quick/medium/thorough
3. **Tool Access Control**: Bounded capabilities
4. **Prompt Engineering**: Explicit detail requirements
5. **Model Selection**: haiku/sonnet/opus

These mechanisms give you fine-grained control over the **balance between autonomy and detail**, making Claude Code's explicit subagent model both powerful and predictable.

---

## Further Reading

- [Phil Schmid: The Rise of Subagents](https://www.philschmid.de/the-rise-of-subagents)
- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Agent State Machine](../architecture/agent-state-machine.md)
- [Practical Examples](../examples/)

---

**Questions or Feedback?**
Open an issue at: https://github.com/anthropics/claude-code/issues
