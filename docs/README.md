# Claude Code Detail Control Documentation

**A comprehensive guide to controlling detail levels in Claude Code's subagent system**

---

## 🌐 View the Documentation

**Start here**: [Documentation Index](./index.md)

---

## 📚 What's Included

This documentation site provides:

1. **Complete Guide** - [Controlling Detail Levels](./guides/controlling-detail-levels.md)
   - Architecture comparison (Claude Code vs Phil Schmid's approaches)
   - Control mechanisms and configuration methods
   - Best practices and advanced patterns

2. **Practical Examples** - [Detail Control Examples](./examples/detail-control-examples.md)
   - Real-world scenarios and code snippets
   - CLI usage examples
   - Troubleshooting guide

3. **Architecture** - [Agent State Machine](../.claude/agent-state-machine.puml)
   - Technical deep-dive into Claude Code's agent architecture

---

## 🚀 Quick Links

| Resource | Description |
|----------|-------------|
| [📖 Complete Guide](./guides/controlling-detail-levels.md) | In-depth documentation on detail control |
| [💻 Code Examples](./examples/detail-control-examples.md) | Practical code snippets and patterns |
| [🏠 Documentation Home](./index.md) | Main documentation hub |
| [🏛️ Architecture](../ARCHITECTURE.md) | System architecture details |

---

## 📊 Key Topics Covered

- **Agent Types**: Specialized agents for different tasks
- **Thoroughness Levels**: quick, medium, very thorough
- **Tool Access Control**: Bounded capabilities per agent
- **Prompt Engineering**: Explicit detail specification
- **Model Selection**: haiku, sonnet, opus
- **Performance Optimization**: Cost and speed tradeoffs
- **Real-World Patterns**: Production-ready examples

---

## 🎯 Who Is This For?

- **Developers** using Claude Code for software development
- **Architects** designing AI-augmented workflows
- **Researchers** studying subagent architectures
- **Teams** optimizing AI tool usage
- **Anyone** curious about controlling AI agent behavior

---

## 🔍 Featured Comparison

This documentation compares Claude Code's **explicit subagent model** with approaches from:

- **Phil Schmid's "The Rise of Subagents"**
- **Poke.com's dynamic agent system**
- **Traditional monolithic agent approaches**

Learn when to use each approach and how to get the most from Claude Code's explicit, controllable architecture.

---

## 📖 Reading Guide

### For Beginners

1. Start: [Documentation Index](./index.md#-quick-start)
2. Read: [Introduction](./guides/controlling-detail-levels.md#introduction)
3. Try: [Quick Examples](./examples/detail-control-examples.md#quick-reference-examples)

### For Advanced Users

1. Jump to: [Advanced Patterns](./guides/controlling-detail-levels.md#advanced-patterns)
2. Study: [Real-World Scenarios](./examples/detail-control-examples.md#real-world-scenarios)
3. Optimize: [Performance Benchmarks](./examples/detail-control-examples.md#performance-benchmarks)

---

## 🛠️ Usage Example

```typescript
// Control detail level explicitly
await Task({
  subagent_type: "Explore",
  thoroughness: "medium",  // ← Control detail
  model: "sonnet",         // ← Control model
  prompt: `
    Analyze authentication system:
    - Main files with line refs
    - Flow description (3-5 paragraphs)
    - Security assessment

    Detail level: Medium (balanced)
  `
})
```

---

## 📈 Documentation Structure

```
docs/
├── index.md                              # Main hub
├── README.md                             # This file
├── guides/
│   └── controlling-detail-levels.md      # Complete guide
├── examples/
│   └── detail-control-examples.md        # Code examples
└── architecture/
    └── (see ../.claude/agent-state-machine.puml)
```

---

## 🔗 External References

- [Phil Schmid: The Rise of Subagents](https://www.philschmid.de/the-rise-of-subagents)
- [Claude Code Official Docs](https://docs.claude.com/claude-code)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)

---

## 📝 License

Part of the SEIZE project. See main project LICENSE.

---

## 🤝 Contributing

Issues and improvements welcome!

- Report issues: [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- Discussions: [GitHub Discussions](https://github.com/anthropics/claude-code/discussions)

---

**Ready to learn?** → [Start with the Documentation Index](./index.md)
