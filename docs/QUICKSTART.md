# Orchestrator-Subagent System - Quick Start

**Version**: 1.0.0
**Last Updated**: 2025-11-07

Quick guide to get started with the orchestrator-subagent architecture.

---

## 🚀 Quick Start

### 1. Build the Project

```bash
cd /devb/seize
cargo build --release
```

### 2. Run Tests

```bash
# Run all tests
cargo test

# Run orchestrator-specific tests
cargo test --package orchestrator-core

# Run with output
cargo test -- --nocapture
```

### 3. Run Demo

```bash
cargo run --release
```

**Expected Output:**

```
Starting Orchestrator-Subagent System
=====================================

Registering subagents...
✓ Registered 3 subagents

Processing user request: Analyze the codebase and generate a comprehensive report
Request ID: <uuid>

=====================================
Final Answer:
=====================================

Final Answer for request: Analyze the codebase and generate a comprehensive report

- general-purpose: Completed task: Subtask 1
- code-analysis: Analyzed code for task: Subtask 2

Total execution time: ~200ms
```

---

## 📖 Basic Usage

### Example 1: Simple Request

```rust
use orchestrator_core::{Orchestrator, UserRequest};
use orchestrator_core::subagent::GeneralPurposeSubagent;
use std::sync::Arc;
use uuid::Uuid;
use std::collections::HashMap;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Create orchestrator
    let mut orchestrator = Orchestrator::new();

    // Register subagent
    orchestrator.register_subagent(
        "general-purpose".to_string(),
        Arc::new(GeneralPurposeSubagent::new()),
    );

    // Create request
    let request = UserRequest {
        id: Uuid::new_v4(),
        content: "Your task here".to_string(),
        context: HashMap::new(),
    };

    // Process
    let result = orchestrator.process(request).await?;
    println!("{}", result.answer);

    Ok(())
}
```

### Example 2: Multiple Subagents

```rust
use orchestrator_core::subagent::{
    GeneralPurposeSubagent,
    CodeAnalysisSubagent,
    DataProcessingSubagent,
};

// Register multiple subagents
orchestrator.register_subagent(
    "general-purpose".to_string(),
    Arc::new(GeneralPurposeSubagent::new()),
);

orchestrator.register_subagent(
    "code-analysis".to_string(),
    Arc::new(CodeAnalysisSubagent::new()),
);

orchestrator.register_subagent(
    "data-processing".to_string(),
    Arc::new(DataProcessingSubagent::new()),
);

// Create complex request
let request = UserRequest {
    id: Uuid::new_v4(),
    content: "Analyze code quality, process data, and generate report".to_string(),
    context: HashMap::new(),
};

// Orchestrator will distribute tasks to appropriate subagents
let result = orchestrator.process(request).await?;
```

### Example 3: Custom Subagent

```rust
use orchestrator_core::subagent::{Subagent, SubagentContext};
use orchestrator_core::types::{Task, SubagentResult};
use async_trait::async_trait;
use anyhow::Result;
use std::collections::HashMap;

pub struct MyCustomSubagent {
    name: String,
}

impl MyCustomSubagent {
    pub fn new() -> Self {
        Self {
            name: "my-custom-subagent".to_string(),
        }
    }
}

#[async_trait]
impl Subagent for MyCustomSubagent {
    fn name(&self) -> &str {
        &self.name
    }

    fn capabilities(&self) -> Vec<String> {
        vec!["custom-analysis".to_string(), "special-processing".to_string()]
    }

    async fn execute(&self, task: &Task, context: &SubagentContext) -> Result<SubagentResult> {
        let start = std::time::Instant::now();

        // Your custom logic here
        let output = format!("Processed: {}", task.description);

        Ok(SubagentResult {
            task_id: task.id,
            subagent_name: self.name.clone(),
            success: true,
            output,
            artifacts: HashMap::new(),
            execution_time_ms: start.elapsed().as_millis() as u64,
        })
    }
}

// Register your custom subagent
orchestrator.register_subagent(
    "my-custom-subagent".to_string(),
    Arc::new(MyCustomSubagent::new()),
);
```

---

## 🏗️ Architecture Overview

```
User Request
    ↓
Orchestrator Agent
    ├─ Analyze (θ₁)
    ├─ Decompose (θ₂)
    ├─ Delegate (θ₃)
    ↓
Isolated Execution
    ├─ Subagent 1 (parallel)
    ├─ Subagent 2 (parallel)
    └─ Subagent n (parallel)
    ↓
Results Collection
    ↓
Synthesize (θ₅)
    ↓
Final Answer
```

---

## 📊 Performance

### Parallel Execution Benefits

```
Sequential Execution:
Task₁ (100ms) → Task₂ (100ms) → Task₃ (100ms) = 300ms total

Parallel Execution:
Task₁ (100ms) ┐
Task₂ (100ms) ├─ max(100ms) = 100ms total
Task₃ (100ms) ┘

Speedup: 3x
```

### Benchmarking

```bash
# Run benchmarks (if available)
cargo bench

# Time a run
time cargo run --release
```

---

## 🧪 Testing

### Unit Tests

```bash
# Orchestrator core tests
cargo test --package orchestrator-core

# Specific test
cargo test test_orchestrator_basic_flow
```

### Integration Tests

```bash
# All integration tests
cargo test --test integration_test

# Specific integration test
cargo test test_multiple_subagents_parallel_execution
```

### Test Coverage

```bash
# Install tarpaulin (if not already)
cargo install cargo-tarpaulin

# Run coverage
cargo tarpaulin --out Html
```

---

## 📚 Documentation

### Generate Docs

```bash
# Generate and open documentation
cargo doc --open --no-deps

# Generate for specific crate
cargo doc --package orchestrator-core --open
```

### Key Documentation Files

- **ORCHESTRATOR_ARCHITECTURE.md**: Complete architecture guide
- **README.md**: Project overview
- **.claude/*.puml**: PlantUML diagrams
  - `orchestrator-architecture.puml`
  - `orchestrator-execution-flow.puml`
  - `orchestrator-state-machine.puml`
  - `subagent-isolation.puml`

---

## 🔍 Viewing PlantUML Diagrams

### Option 1: VS Code

```bash
# Install PlantUML extension
code --install-extension jebbs.plantuml

# Open any .puml file
code .claude/orchestrator-architecture.puml
```

### Option 2: Online Viewer

Visit: https://www.plantuml.com/plantuml/uml/

Paste contents of `.puml` files

### Option 3: Command Line

```bash
# Install PlantUML
brew install plantuml  # macOS
# or
sudo apt install plantuml  # Linux

# Generate PNG
plantuml .claude/orchestrator-architecture.puml

# Output: .claude/orchestrator-architecture.png
```

---

## 🎯 Next Steps

1. **Explore the Code**
   ```bash
   # Main orchestrator logic
   cat crates/orchestrator-core/src/orchestrator.rs

   # Subagent implementations
   cat crates/orchestrator-core/src/subagent.rs

   # Execution environment
   cat crates/orchestrator-core/src/executor.rs
   ```

2. **Create Your Own Subagent**
   - Copy example from `subagent.rs`
   - Implement custom logic
   - Register with orchestrator

3. **Extend the System**
   - Add more sophisticated task decomposition
   - Implement intelligent subagent selection
   - Add performance metrics
   - Create specialized subagents for your domain

4. **Integrate with Claude Code**
   - Connect to Claude Code Task tool
   - Use as foundation for custom agents
   - Implement learning loop (θ₆)

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean and rebuild
cargo clean
cargo build --release
```

### Test Failures

```bash
# Run with verbose output
cargo test -- --nocapture

# Run specific failing test
cargo test test_name -- --nocapture
```

### Performance Issues

```bash
# Build with optimizations
cargo build --release

# Profile with perf (Linux)
perf record cargo run --release
perf report
```

---

## 📞 Support

- **Documentation**: See `ORCHESTRATOR_ARCHITECTURE.md`
- **Issues**: Check GitHub issues
- **Examples**: See `src/main.rs` and `tests/`

---

## 🔗 Related Resources

- **Claude Code Agent Equation**: See `CLAUDE.md`
- **Miyabi Project**: Advanced agent orchestration patterns
- **Main README**: See `README.md`

---

**Ready to orchestrate? 🎭**

```bash
cargo run --release
```
