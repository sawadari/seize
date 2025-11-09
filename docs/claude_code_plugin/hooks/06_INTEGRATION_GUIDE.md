# Auto-Launch Integration Guide

**Module**: Hooks - Integration & Implementation
**Version**: 1.0.0
**Last Updated**: 2025-11-07
**For**: Plugin developers implementing the auto-launch system

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Extension Setup](#extension-setup)
3. [Hook Registration](#hook-registration)
4. [Event Listening](#event-listening)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/ShunsukeHayashi/SEIZE.git
cd SEIZE/docs/claude_code_plugin

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Basic Usage

```typescript
// src/extension.ts
import { HookRegistry } from './hooks/01_HOOK_REGISTRY';
import { TmuxLauncher } from './hooks/02_TMUX_LAUNCHER';
import { registerAllSmartTriggers } from './hooks/03_SMART_TRIGGERS';

export function activate(context: vscode.ExtensionContext) {
  // Initialize services
  const registry = HookRegistry.getInstance();
  const launcher = TmuxLauncher.getInstance();

  // Register all smart triggers
  registerAllSmartTriggers(registry);

  // Setup event listeners
  registry.setupEventListeners(context);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('flickeringScenery.launch', async () => {
      await launcher.launch({ mode: 'impressive' });
    })
  );

  console.log('Flickering Scenery auto-launch system activated!');
}

export function deactivate() {
  const registry = HookRegistry.getInstance();
  const launcher = TmuxLauncher.getInstance();

  registry.dispose();
  launcher.dispose();
}
```

---

## Extension Setup

### Package.json Configuration

```json
{
  "name": "flickering-scenery",
  "displayName": "Flickering Scenery",
  "description": "Real-time visualization of Claude Code's multi-agent orchestration",
  "version": "1.0.0",
  "publisher": "shunsuke-hayashi",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Visualization", "Other"],
  "keywords": ["claude", "ai", "agents", "tmux", "visualization"],
  "activationEvents": [
    "onStartupFinished",
    "onCommand:flickeringScenery.launch"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "flickeringScenery.launch",
        "title": "Launch Visualization",
        "category": "Flickering Scenery"
      },
      {
        "command": "flickeringScenery.toggleAutoLaunch",
        "title": "Toggle Auto-Launch",
        "category": "Flickering Scenery"
      }
    ],
    "configuration": {
      "title": "Flickering Scenery",
      "properties": {
        "flickeringScenery.autoLaunch.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Automatically launch visualization for complex tasks"
        },
        "flickeringScenery.autoLaunch.frequency": {
          "type": "string",
          "enum": ["always", "smart", "manual"],
          "default": "smart",
          "description": "How often to auto-launch visualization"
        },
        "flickeringScenery.autoLaunch.smartProbability": {
          "type": "number",
          "default": 0.1,
          "minimum": 0.0,
          "maximum": 1.0,
          "description": "Probability of random surprise launch (0.0-1.0)"
        },
        "flickeringScenery.visual.mode": {
          "type": "string",
          "enum": ["fullscreen", "split", "pip"],
          "default": "split",
          "description": "Visualization display mode"
        },
        "flickeringScenery.visual.theme": {
          "type": "string",
          "enum": ["dark", "light", "auto"],
          "default": "auto",
          "description": "Color theme for visualization"
        },
        "flickeringScenery.visual.animations": {
          "type": "boolean",
          "default": true,
          "description": "Enable fade-in animations"
        },
        "flickeringScenery.notifications.sound": {
          "type": "boolean",
          "default": false,
          "description": "Play sound effects"
        },
        "flickeringScenery.notifications.tooltip": {
          "type": "boolean",
          "default": true,
          "description": "Show tooltips"
        },
        "flickeringScenery.notifications.firstTimeHelp": {
          "type": "boolean",
          "default": true,
          "description": "Show first-time tutorial"
        },
        "flickeringScenery.privacy.telemetry": {
          "type": "boolean",
          "default": false,
          "description": "Send anonymous usage data (opt-in)"
        }
      }
    }
  }
}
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Hook Registration

### Creating Custom Hooks

```typescript
// src/hooks/custom/MyCustomHook.ts
import { HookPoint, ActivationEvent, EventContext } from '../01_HOOK_REGISTRY';
import { TmuxLauncher } from '../02_TMUX_LAUNCHER';

export const myCustomHook: HookPoint = {
  id: 'my-custom-hook',
  name: 'My Custom Hook',
  description: 'Launch on specific condition',
  event: ActivationEvent.TASK_STARTED,

  condition: (ctx: EventContext) => {
    // Your custom logic here
    return ctx.task?.description.includes('specific keyword');
  },

  action: async (ctx: EventContext) => {
    const launcher = TmuxLauncher.getInstance();
    await launcher.launch({
      mode: 'subtle',
      showTooltip: 'Custom hook triggered!',
    });
  },

  priority: 70,
  cooldown: 10 * 60 * 1000, // 10 minutes
  enabled: true,
};
```

### Registering Hooks Programmatically

```typescript
// src/extension.ts
import { HookRegistry } from './hooks/01_HOOK_REGISTRY';
import { myCustomHook } from './hooks/custom/MyCustomHook';

export function activate(context: vscode.ExtensionContext) {
  const registry = HookRegistry.getInstance();

  // Option 1: Register all smart triggers
  registerAllSmartTriggers(registry);

  // Option 2: Register specific hooks
  registry.register(firstInstallHook);
  registry.register(multiStepTaskHook);

  // Option 3: Register custom hooks
  registry.register(myCustomHook);

  // Option 4: Register from configuration
  const config = vscode.workspace.getConfiguration('flickeringScenery');
  const enabledHooks = config.get<string[]>('hooks.enabled', []);

  for (const hookId of enabledHooks) {
    const hook = findHookById(hookId);
    if (hook) {
      registry.register(hook);
    }
  }
}
```

---

## Event Listening

### Claude Code Event Integration

```typescript
// src/api/ClaudeCodeAdapter.ts
import * as vscode from 'vscode';
import { HookRegistry, ActivationEvent } from '../hooks/01_HOOK_REGISTRY';

export class ClaudeCodeAdapter {
  private registry: HookRegistry;

  constructor() {
    this.registry = HookRegistry.getInstance();
  }

  /**
   * Setup listeners for Claude Code events
   */
  setupListeners(context: vscode.ExtensionContext): void {
    // Listen for text document changes (proxy for Claude responses)
    const onDocumentChange = vscode.workspace.onDidChangeTextDocument((e) => {
      if (this.isClaudeResponse(e)) {
        this.registry.triggerManual(ActivationEvent.MESSAGE_RECEIVED, {
          claude: {
            currentMessage: e.document.getText(),
            messageHistory: [],
            isThinking: false,
          },
        });
      }
    });

    context.subscriptions.push(onDocumentChange);
  }

  /**
   * Detect if change is from Claude Code
   */
  private isClaudeResponse(e: vscode.TextDocumentChangeEvent): boolean {
    // Heuristic: Check if document is in Claude Code workspace
    // This is a simplified check - real implementation would need
    // deeper integration with Claude Code's API
    return e.document.uri.scheme === 'claude-code' ||
           e.document.fileName.includes('.claude');
  }

  /**
   * Analyze task complexity
   */
  analyzeTask(description: string): {
    complexity: number;
    steps: string[];
    estimatedDuration: number;
    isMultiStep: boolean;
  } {
    const steps = this.extractSteps(description);
    const wordCount = description.split(/\s+/).length;

    return {
      complexity: Math.min(Math.ceil(wordCount / 50), 10),
      steps,
      estimatedDuration: steps.length * 30, // 30s per step
      isMultiStep: steps.length > 1,
    };
  }

  private extractSteps(text: string): string[] {
    const steps: string[] = [];
    const numberedPattern = /(?:^|\n)\d+\.\s+(.+)/g;
    let match;

    while ((match = numberedPattern.exec(text)) !== null) {
      steps.push(match[1]);
    }

    return steps;
  }
}
```

### Manual Event Triggering (for Testing)

```typescript
// src/commands/TestCommands.ts
import * as vscode from 'vscode';
import { HookRegistry, ActivationEvent } from '../hooks/01_HOOK_REGISTRY';

export function registerTestCommands(context: vscode.ExtensionContext): void {
  // Trigger first install experience
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'flickeringScenery.test.firstInstall',
      async () => {
        const registry = HookRegistry.getInstance();
        await registry.triggerManual(ActivationEvent.FIRST_INTERACTION, {
          user: {
            isFirstTime: true,
            installDate: new Date(),
            totalLaunches: 0,
            hasSeenTutorial: false,
          },
        });
      }
    )
  );

  // Trigger multi-step task
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'flickeringScenery.test.multiStep',
      async () => {
        const registry = HookRegistry.getInstance();
        await registry.triggerManual(ActivationEvent.MESSAGE_RECEIVED, {
          claude: {
            currentMessage:
              "Let me break this down into steps:\n1. First\n2. Second\n3. Third",
            messageHistory: [],
            isThinking: false,
          },
        });
      }
    )
  );
}
```

---

## Configuration

### State Management

```typescript
// src/storage/StateManager.ts
import * as vscode from 'vscode';

export class StateManager {
  private static instance: StateManager;
  private context: vscode.ExtensionContext;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  static initialize(context: vscode.ExtensionContext): void {
    StateManager.instance = new StateManager(context);
  }

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      throw new Error('StateManager not initialized');
    }
    return StateManager.instance;
  }

  /**
   * Get state value
   */
  getState(key?: string): any {
    const state = this.context.globalState.get('flickeringScenery', {});
    return key ? state[key] : state;
  }

  /**
   * Set state value
   */
  setState(key: string, value: any): void {
    const state = this.getState();
    state[key] = value;
    this.context.globalState.update('flickeringScenery', state);
  }

  /**
   * Record launch
   */
  recordLaunch(): void {
    const state = this.getState();
    const totalLaunches = (state.totalLaunches || 0) + 1;

    this.setState('totalLaunches', totalLaunches);
    this.setState('lastVisualizationLaunch', new Date());

    if (!state.installDate) {
      this.setState('installDate', new Date());
    }
  }

  /**
   * Increment counter
   */
  incrementCounter(key: string): void {
    const current = this.getState(key) || 0;
    this.setState(key, current + 1);
  }
}
```

### User Settings

```typescript
// src/config/ConfigManager.ts
import * as vscode from 'vscode';
import { FlickeringSceneryConfig } from '../hooks/01_HOOK_REGISTRY';

export class ConfigManager {
  /**
   * Get current configuration
   */
  static getConfig(): FlickeringSceneryConfig {
    const config = vscode.workspace.getConfiguration('flickeringScenery');

    return {
      autoLaunch: {
        enabled: config.get('autoLaunch.enabled', true),
        frequency: config.get('autoLaunch.frequency', 'smart'),
        smartProbability: config.get('autoLaunch.smartProbability', 0.1),
      },
      visual: {
        mode: config.get('visual.mode', 'split'),
        theme: config.get('visual.theme', 'auto'),
        animations: config.get('visual.animations', true),
      },
      notifications: {
        sound: config.get('notifications.sound', false),
        tooltip: config.get('notifications.tooltip', true),
        firstTimeHelp: config.get('notifications.firstTimeHelp', true),
      },
    };
  }

  /**
   * Update configuration
   */
  static async updateConfig(
    section: string,
    value: any,
    global: boolean = true
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration('flickeringScenery');
    await config.update(section, value, global);
  }

  /**
   * Reset to defaults
   */
  static async resetConfig(): Promise<void> {
    const config = vscode.workspace.getConfiguration('flickeringScenery');
    const keys = Object.keys(config);

    for (const key of keys) {
      await config.update(key, undefined, true);
    }

    vscode.window.showInformationMessage(
      'Flickering Scenery settings reset to defaults'
    );
  }
}
```

---

## Testing

### Unit Tests

```typescript
// src/tests/hooks/HookRegistry.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { HookRegistry, HookPoint, ActivationEvent } from '../../hooks/01_HOOK_REGISTRY';

describe('HookRegistry', () => {
  let registry: HookRegistry;

  beforeEach(() => {
    registry = HookRegistry.getInstance();
    registry.unregisterAll();
  });

  it('should register a hook', () => {
    const hook: HookPoint = {
      id: 'test-hook',
      name: 'Test Hook',
      description: 'Test',
      event: ActivationEvent.TASK_STARTED,
      condition: () => true,
      action: async () => {},
      priority: 100,
      enabled: true,
    };

    registry.register(hook);

    const hooks = registry.getHooks(ActivationEvent.TASK_STARTED);
    expect(hooks).toHaveLength(1);
    expect(hooks[0].id).toBe('test-hook');
  });

  it('should trigger hooks in priority order', async () => {
    const executionOrder: number[] = [];

    const hook1: HookPoint = {
      id: 'hook-1',
      name: 'Hook 1',
      description: 'Low priority',
      event: ActivationEvent.TASK_STARTED,
      condition: () => true,
      action: async () => { executionOrder.push(1); },
      priority: 50,
      enabled: true,
    };

    const hook2: HookPoint = {
      id: 'hook-2',
      name: 'Hook 2',
      description: 'High priority',
      event: ActivationEvent.TASK_STARTED,
      condition: () => true,
      action: async () => { executionOrder.push(2); },
      priority: 100,
      enabled: true,
    };

    registry.register(hook1);
    registry.register(hook2);

    await registry.trigger(ActivationEvent.TASK_STARTED, {} as any);

    // High priority (2) should execute first
    expect(executionOrder).toEqual([2]);
  });

  it('should respect cooldown', async () => {
    let execCount = 0;

    const hook: HookPoint = {
      id: 'cooldown-hook',
      name: 'Cooldown Hook',
      description: 'Test cooldown',
      event: ActivationEvent.TASK_STARTED,
      condition: () => true,
      action: async () => { execCount++; },
      priority: 100,
      cooldown: 1000, // 1 second
      enabled: true,
    };

    registry.register(hook);

    // First trigger
    await registry.trigger(ActivationEvent.TASK_STARTED, {} as any);
    expect(execCount).toBe(1);

    // Immediate second trigger (should be blocked)
    await registry.trigger(ActivationEvent.TASK_STARTED, {} as any);
    expect(execCount).toBe(1);

    // Wait for cooldown
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Third trigger (should execute)
    await registry.trigger(ActivationEvent.TASK_STARTED, {} as any);
    expect(execCount).toBe(2);
  });
});
```

### Integration Tests

```typescript
// src/tests/integration/AutoLaunch.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { HookRegistry } from '../../hooks/01_HOOK_REGISTRY';
import { TmuxLauncher } from '../../hooks/02_TMUX_LAUNCHER';
import { registerAllSmartTriggers } from '../../hooks/03_SMART_TRIGGERS';

describe('Auto-Launch Integration', () => {
  beforeEach(() => {
    const registry = HookRegistry.getInstance();
    registry.unregisterAll();
    registerAllSmartTriggers(registry);
  });

  it('should launch on first install', async () => {
    // TODO: Implement integration test
  });

  it('should launch on multi-step task', async () => {
    // TODO: Implement integration test
  });
});
```

---

## Deployment

### Build for Production

```bash
# Clean dist
rm -rf dist

# Build TypeScript
npm run build

# Run tests
npm test

# Package extension
vsce package

# Output: flickering-scenery-1.0.0.vsix
```

### Publishing to Marketplace

```bash
# Login to publisher account
vsce login shunsuke-hayashi

# Publish
vsce publish

# Or publish specific version
vsce publish 1.0.1
```

### Versioning Strategy

- **1.0.x**: Bug fixes, minor improvements
- **1.x.0**: New features, new hooks
- **x.0.0**: Major architecture changes

---

## Troubleshooting

### Common Issues

**Issue**: Hooks not triggering
```typescript
// Check hook stats
const registry = HookRegistry.getInstance();
const stats = registry.getStats();
console.log(stats);

// Reset cooldowns
registry.resetAllCooldowns();
```

**Issue**: tmux not launching
```typescript
// Check tmux availability
const launcher = TmuxLauncher.getInstance();
const availability = await launcher.detectTmux();
console.log(availability);
```

**Issue**: State not persisting
```typescript
// Check state
const state = StateManager.getInstance();
console.log(state.getState());
```

---

## Next Steps

1. Review [00_AUTO_LAUNCH_SPECIFICATION.md](./00_AUTO_LAUNCH_SPECIFICATION.md)
2. Implement custom hooks for your use case
3. Test with beta users
4. Deploy and monitor metrics
5. Iterate based on user feedback

---

**Questions?** Open an issue on GitHub or join our Discord community.
