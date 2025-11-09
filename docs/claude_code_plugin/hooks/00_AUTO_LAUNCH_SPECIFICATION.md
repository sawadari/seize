# Auto-Launch Hook System Specification

**Module**: Hooks - Auto-Launch System
**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Purpose**: Create viral "WTF moment" by auto-launching tmux visualization

---

## Table of Contents

1. [Vision & Strategy](#vision--strategy)
2. [Event Hook Architecture](#event-hook-architecture)
3. [Smart Trigger System](#smart-trigger-system)
4. [Seamless tmux Launch](#seamless-tmux-launch)
5. [Magic Moment Design](#magic-moment-design)
6. [Configuration & Control](#configuration--control)
7. [Viral Optimization](#viral-optimization)
8. [Safety & Fallbacks](#safety--fallbacks)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Vision & Strategy

### The Viral Moment

**What Users Experience:**

1. User installs "Flickering Scenery" plugin (seems like a normal visualization tool)
2. They use Claude Code as usual - ask it to build a feature
3. **SUDDENLY** - without warning - a beautiful tmux multi-agent visualization appears
4. User thinks: *"Wait... did Claude Code just spawn AI agents on its own!?"*
5. They screenshot/record → Twitter/Reddit → **VIRAL** 🔥

### Why This Works

- **Surprise Factor**: No one expects their IDE to suddenly show autonomous agents
- **Visual Impact**: tmux visualization is stunning and immediately shareworthy
- **"Living AI" Feel**: Creates illusion that Claude Code is actually a multi-agent system
- **FOMO**: People will install just to experience the moment

### Success Metrics

- **Primary**: Time from install to first social media share
- **Target**: < 5 minutes
- **Viral Coefficient**: 1 user → 3+ shares
- **GitHub Stars**: 10k+ in first month

---

## Event Hook Architecture

### Claude Code Event Lifecycle

```typescript
// Extension activation triggers
enum ActivationEvent {
  WORKSPACE_OPENED = 'onStartupFinished',
  FIRST_INTERACTION = 'onDidReceiveFirstMessage',
  TASK_STARTED = 'onDidStartTask',
  COMMAND_EXECUTED = 'onDidExecuteCommand',
  FILE_CHANGED = 'onDidChangeWorkspace',
  MESSAGE_RECEIVED = 'onDidReceiveMessage',
}

// Our hook points
interface HookPoint {
  event: ActivationEvent;
  condition: (context: EventContext) => boolean;
  action: (context: EventContext) => Promise<void>;
  priority: number; // Higher = executes first
  cooldown?: number; // Minimum time between triggers (ms)
}
```

### Hook Registration System

```typescript
// src/hooks/HookRegistry.ts
export class HookRegistry {
  private hooks: Map<ActivationEvent, HookPoint[]> = new Map();
  private lastTrigger: Map<string, number> = new Map();

  /**
   * Register a hook for auto-launch
   */
  register(hook: HookPoint): void {
    const existing = this.hooks.get(hook.event) || [];
    existing.push(hook);
    existing.sort((a, b) => b.priority - a.priority); // Highest priority first
    this.hooks.set(hook.event, existing);
  }

  /**
   * Trigger hooks for an event
   */
  async trigger(event: ActivationEvent, context: EventContext): Promise<void> {
    const hooks = this.hooks.get(event) || [];

    for (const hook of hooks) {
      // Check cooldown
      const lastRun = this.lastTrigger.get(hook.id) || 0;
      if (hook.cooldown && Date.now() - lastRun < hook.cooldown) {
        continue;
      }

      // Check condition
      if (hook.condition(context)) {
        await hook.action(context);
        this.lastTrigger.set(hook.id, Date.now());
      }
    }
  }
}
```

### Event Context

```typescript
interface EventContext {
  // Task information
  task?: {
    description: string;
    complexity: number; // 1-10
    steps: string[];
    estimatedDuration: number; // seconds
  };

  // User information
  user: {
    isFirstTime: boolean;
    installDate: Date;
    lastVisualizationLaunch?: Date;
    totalLaunches: number;
  };

  // Claude Code state
  claude: {
    currentMessage: string;
    messageHistory: Message[];
    isThinking: boolean;
  };

  // Workspace state
  workspace: {
    path: string;
    fileCount: number;
    language: string;
  };

  // System state
  system: {
    tmuxAvailable: boolean;
    terminalOpen: boolean;
    displaySize: { width: number; height: number };
  };
}
```

---

## Smart Trigger System

### Trigger Strategies

#### 1. First Complex Task of the Day

**Goal**: Wow users on their first meaningful interaction each day

```typescript
const firstComplexTaskHook: HookPoint = {
  event: ActivationEvent.TASK_STARTED,
  condition: (ctx) => {
    const lastLaunch = ctx.user.lastVisualizationLaunch;
    const isNewDay = !lastLaunch || !isSameDay(lastLaunch, new Date());
    const isComplex = ctx.task && ctx.task.complexity >= 5;

    return isNewDay && isComplex;
  },
  action: async (ctx) => {
    await launchVisualization({
      mode: 'impressive',
      playIntroAnimation: true,
      showTooltip: 'Your agents are analyzing the task...',
    });
  },
  priority: 100,
  cooldown: 60 * 60 * 1000, // 1 hour
};
```

#### 2. Multi-Step Task Detection

**Goal**: Launch when task requires orchestration

```typescript
const multiStepTaskHook: HookPoint = {
  event: ActivationEvent.MESSAGE_RECEIVED,
  condition: (ctx) => {
    const message = ctx.claude.currentMessage;

    // Detect Claude's "breakdown" language
    const breakdownPatterns = [
      /let me break this down/i,
      /i'll tackle this in (\d+) steps/i,
      /here's my approach:/i,
      /first.*then.*finally/i,
      /step \d+:/i,
    ];

    return breakdownPatterns.some((pattern) => pattern.test(message));
  },
  action: async (ctx) => {
    // Extract step count
    const steps = extractSteps(ctx.claude.currentMessage);

    await launchVisualization({
      mode: 'orchestration',
      expectedPhases: steps.length,
      showStepBreakdown: true,
    });
  },
  priority: 90,
  cooldown: 30 * 60 * 1000, // 30 minutes
};
```

#### 3. Random Surprise (10% of tasks)

**Goal**: Keep users on their toes

```typescript
const randomSurpriseHook: HookPoint = {
  event: ActivationEvent.TASK_STARTED,
  condition: (ctx) => {
    // Don't trigger if visualization was recently shown
    const lastLaunch = ctx.user.lastVisualizationLaunch;
    if (lastLaunch && Date.now() - lastLaunch.getTime() < 15 * 60 * 1000) {
      return false;
    }

    // 10% chance
    return Math.random() < 0.1;
  },
  action: async (ctx) => {
    await launchVisualization({
      mode: 'subtle',
      fadeIn: true,
      duration: 5000, // Auto-hide after 5 seconds
    });
  },
  priority: 50,
  cooldown: 15 * 60 * 1000, // 15 minutes
};
```

#### 4. First Install Magic

**Goal**: Maximize first impression

```typescript
const firstInstallHook: HookPoint = {
  event: ActivationEvent.FIRST_INTERACTION,
  condition: (ctx) => {
    return ctx.user.isFirstTime && ctx.user.totalLaunches === 0;
  },
  action: async (ctx) => {
    // Wait for Claude to respond first
    await waitFor(() => ctx.claude.currentMessage.length > 0);

    await launchVisualization({
      mode: 'tutorial',
      showWelcomeMessage: true,
      playFullAnimation: true,
      callToAction: {
        text: '⭐ Star on GitHub',
        url: 'https://github.com/ShunsukeHayashi/SEIZE',
      },
    });
  },
  priority: 200, // Highest priority
  cooldown: Infinity, // Only once
};
```

#### 5. Long-Running Task

**Goal**: Show agents working on extended tasks

```typescript
const longRunningTaskHook: HookPoint = {
  event: ActivationEvent.TASK_STARTED,
  condition: (ctx) => {
    return ctx.task && ctx.task.estimatedDuration > 60; // > 1 minute
  },
  action: async (ctx) => {
    // Wait 5 seconds before launching (let user see task description first)
    await sleep(5000);

    await launchVisualization({
      mode: 'persistent',
      autoHide: false, // Keep open for long tasks
      showProgressBar: true,
    });
  },
  priority: 80,
  cooldown: 20 * 60 * 1000, // 20 minutes
};
```

---

## Seamless tmux Launch

### Detection & Preparation

```typescript
// src/hooks/TmuxLauncher.ts
export class TmuxLauncher {
  /**
   * Detect if tmux is available and ready
   */
  async detectTmux(): Promise<TmuxAvailability> {
    try {
      const { stdout } = await exec('which tmux');
      const version = await this.getTmuxVersion();

      return {
        available: true,
        version,
        path: stdout.trim(),
      };
    } catch {
      return { available: false };
    }
  }

  /**
   * Check if we're already in a tmux session
   */
  isInTmux(): boolean {
    return !!process.env.TMUX;
  }

  /**
   * Choose best launch strategy based on environment
   */
  async chooseLaunchStrategy(): Promise<LaunchStrategy> {
    const inTerminal = await this.isRunningInTerminal();
    const inVSCode = !!vscode.env.appName;
    const inTmux = this.isInTmux();

    if (inTmux) {
      return LaunchStrategy.TMUX_SPLIT; // Split current tmux session
    } else if (inTerminal && !inVSCode) {
      return LaunchStrategy.TERMINAL_SPLIT; // Split current terminal
    } else if (inVSCode) {
      return LaunchStrategy.VSCODE_TERMINAL; // Open VSCode integrated terminal
    } else {
      return LaunchStrategy.NEW_WINDOW; // Open new terminal window
    }
  }
}
```

### Launch Strategies

#### Strategy 1: tmux Split (Best UX)

```typescript
async launchViaTmuxSplit(config: LaunchConfig): Promise<void> {
  const sessionName = 'flickering-scenery-viz';

  // Check if session already exists
  const sessions = await exec('tmux list-sessions');
  const sessionExists = sessions.stdout.includes(sessionName);

  if (sessionExists) {
    // Switch to existing session
    await exec(`tmux switch-client -t ${sessionName}`);
  } else {
    // Create new session in background
    await exec(
      `tmux new-session -d -s ${sessionName} -x ${config.width} -y ${config.height}`
    );

    // Split panes according to our layout
    await this.createLayout(sessionName);

    // Launch agent visualizations in each pane
    await this.startAgentPanes(sessionName);

    // Attach to session (split current window)
    if (config.splitCurrent) {
      await exec(
        `tmux split-window -h -p 50 "tmux attach-session -t ${sessionName}"`
      );
    } else {
      await exec(`tmux attach-session -t ${sessionName}`);
    }
  }
}
```

#### Strategy 2: VSCode Integrated Terminal

```typescript
async launchViaVSCodeTerminal(config: LaunchConfig): Promise<void> {
  const terminal = vscode.window.createTerminal({
    name: 'Flickering Scenery',
    iconPath: new vscode.ThemeIcon('organization'),
    location: vscode.TerminalLocation.Panel,
  });

  terminal.show();

  // Launch tmux in the terminal
  terminal.sendText(
    `tmux new-session -s flickering-scenery-viz "cd ${config.scriptPath} && ./run.sh"`
  );

  // Optional: Maximize terminal panel
  if (config.maximize) {
    await vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
  }
}
```

#### Strategy 3: New Terminal Window

```typescript
async launchViaNewWindow(config: LaunchConfig): Promise<void> {
  const platform = process.platform;

  if (platform === 'darwin') {
    // macOS: Use osascript to open Terminal.app
    await exec(`osascript -e 'tell application "Terminal"
      do script "cd ${config.scriptPath} && ./run.sh"
      activate
    end tell'`);
  } else if (platform === 'linux') {
    // Linux: Try common terminal emulators
    const terminals = ['gnome-terminal', 'konsole', 'xterm'];
    for (const term of terminals) {
      try {
        await exec(`${term} -e "cd ${config.scriptPath} && ./run.sh"`);
        return;
      } catch {
        continue;
      }
    }
    throw new Error('No terminal emulator found');
  } else if (platform === 'win32') {
    // Windows: Use Windows Terminal or cmd
    await exec(`start cmd /c "cd ${config.scriptPath} && run.bat"`);
  }
}
```

#### Strategy 4: Browser Overlay (Web-based fallback)

```typescript
async launchViaBrowserOverlay(config: LaunchConfig): Promise<void> {
  // Start WebSocket server for real-time updates
  const server = await this.startWebSocketServer();

  // Create WebView panel
  const panel = vscode.window.createWebviewPanel(
    'flickeringScenery',
    'Flickering Scenery Visualization',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  // Load visualization HTML
  panel.webview.html = this.getWebViewHTML(server.port);

  // Stream agent states to WebView
  this.streamToWebView(panel.webview, server);
}
```

---

## Magic Moment Design

### Timing Choreography

```typescript
// src/hooks/MagicMoment.ts
export class MagicMoment {
  /**
   * Orchestrate the perfect reveal timing
   */
  async orchestrate(context: EventContext): Promise<void> {
    // Phase 1: Wait for Claude's response to start
    await this.waitForClaudeResponse(context);

    // Phase 2: Detect the "magic words"
    const magicPhrase = this.detectMagicPhrase(context.claude.currentMessage);

    if (magicPhrase) {
      // Phase 3: Launch exactly when Claude says "Let me..."
      await this.launchOnCue(magicPhrase);
    } else {
      // Fallback: Launch 2 seconds into response
      await sleep(2000);
      await this.launch();
    }

    // Phase 4: Fade-in animation
    await this.animateFadeIn();

    // Phase 5: Show tooltip (first time only)
    if (context.user.totalLaunches === 0) {
      await this.showTooltip('Your agents are working...');
    }

    // Phase 6: Optional sound effect
    if (context.config.soundEnabled) {
      await this.playSound('whoosh.mp3');
    }
  }

  /**
   * Detect "magic phrases" that trigger launch
   */
  private detectMagicPhrase(message: string): string | null {
    const phrases = [
      /let me (break this down|analyze|tackle)/i,
      /i'll (start by|begin with|first)/i,
      /here's (what|how) i'll/i,
      /to accomplish this, i'll/i,
    ];

    for (const phrase of phrases) {
      const match = message.match(phrase);
      if (match) return match[0];
    }

    return null;
  }
}
```

### Transition Effects

```typescript
interface TransitionEffect {
  type: 'fade' | 'slide' | 'zoom' | 'curtain';
  duration: number; // ms
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

const TRANSITION_EFFECTS = {
  subtle: {
    type: 'fade',
    duration: 1000,
    easing: 'ease-in-out',
  },
  dramatic: {
    type: 'curtain',
    duration: 1500,
    easing: 'ease-out',
  },
  instant: {
    type: 'fade',
    duration: 300,
    easing: 'ease-out',
  },
} as const;
```

### First-Time Experience

```typescript
async showFirstTimeExperience(): Promise<void> {
  // Step 1: Fade in tmux visualization
  await this.animateFadeIn();

  // Step 2: Show welcome overlay
  await this.showOverlay({
    title: '🎭 Welcome to Flickering Scenery',
    message:
      'Claude is orchestrating multiple AI agents to complete your task.\n\n' +
      'Watch as they progress through 6 phases:\n' +
      '  θ₁ Understand → θ₂ Generate → θ₃ Allocate →\n' +
      '  θ₄ Execute → θ₅ Integrate → θ₆ Learn',
    duration: 5000,
  });

  // Step 3: Highlight each pane sequentially
  await this.tourPanes([
    { pane: 'status', message: 'Global status and convergence tracking' },
    { pane: 'orchestrator', message: 'Main orchestrator coordinates everything' },
    { pane: 'theta1', message: 'θ₁ analyzes and understands your request' },
    { pane: 'theta2', message: 'θ₂ generates the execution plan' },
    // ... etc
  ]);

  // Step 4: Show call-to-action
  await this.showCallToAction({
    text: '⭐ Like what you see? Star us on GitHub!',
    url: 'https://github.com/ShunsukeHayashi/SEIZE',
    button: 'Star Now',
  });
}
```

### Sound Design

```typescript
// Optional sound effects (off by default)
const SOUNDS = {
  whoosh: 'assets/sounds/whoosh.mp3', // Launch sound
  phase_complete: 'assets/sounds/ding.mp3', // Phase transition
  convergence: 'assets/sounds/success.mp3', // Goal achieved
  error: 'assets/sounds/error.mp3', // Error state
};

async playSound(sound: keyof typeof SOUNDS): Promise<void> {
  if (!this.config.soundEnabled) return;

  const audio = new Audio(vscode.Uri.file(SOUNDS[sound]).fsPath);
  audio.volume = 0.3; // Subtle
  await audio.play();
}
```

---

## Configuration & Control

### User Settings Schema

```typescript
interface FlickeringScenerySettings {
  // Auto-launch behavior
  autoLaunch: {
    enabled: boolean; // Default: true
    frequency: 'always' | 'smart' | 'manual'; // Default: 'smart'
    smartProbability: number; // 0.0-1.0, default: 0.1 (10%)
  };

  // Visual preferences
  visual: {
    mode: 'fullscreen' | 'split' | 'pip'; // Default: 'split'
    theme: 'dark' | 'light' | 'auto'; // Default: 'auto'
    animations: boolean; // Default: true
  };

  // Notifications
  notifications: {
    sound: boolean; // Default: false
    tooltip: boolean; // Default: true
    firstTimeHelp: boolean; // Default: true
  };

  // Performance
  performance: {
    maxConcurrentPanes: number; // Default: 8
    updateInterval: number; // ms, default: 100
  };

  // Privacy
  privacy: {
    telemetry: boolean; // Default: false (opt-in)
    shareUsage: boolean; // Default: false
  };
}
```

### Settings UI

```json
// package.json contribution
{
  "contributes": {
    "configuration": {
      "title": "Flickering Scenery",
      "properties": {
        "flickeringScenery.autoLaunch.enabled": {
          "type": "boolean",
          "default": true,
          "description": "Automatically launch visualization when Claude Code starts complex tasks"
        },
        "flickeringScenery.autoLaunch.frequency": {
          "type": "string",
          "enum": ["always", "smart", "manual"],
          "default": "smart",
          "enumDescriptions": [
            "Launch for every task (may become overwhelming)",
            "Smart detection - launch for complex/multi-step tasks only (recommended)",
            "Manual only - you control when to launch"
          ]
        },
        "flickeringScenery.visual.mode": {
          "type": "string",
          "enum": ["fullscreen", "split", "pip"],
          "default": "split",
          "enumDescriptions": [
            "Full screen takeover (most impressive)",
            "Split view alongside editor (balanced)",
            "Picture-in-picture overlay (minimal)"
          ]
        }
      }
    }
  }
}
```

### Quick Toggle Commands

```typescript
// Register commands
vscode.commands.registerCommand('flickeringScenery.toggleAutoLaunch', () => {
  const config = vscode.workspace.getConfiguration('flickeringScenery');
  const current = config.get('autoLaunch.enabled');
  config.update('autoLaunch.enabled', !current, true);

  vscode.window.showInformationMessage(
    `Auto-launch ${!current ? 'enabled' : 'disabled'}`
  );
});

vscode.commands.registerCommand('flickeringScenery.setFrequency', async () => {
  const choice = await vscode.window.showQuickPick(
    [
      { label: 'Always', value: 'always', description: 'Every task (may be overwhelming)' },
      { label: 'Smart', value: 'smart', description: 'Complex tasks only (recommended)' },
      { label: 'Manual', value: 'manual', description: 'Only when you trigger it' },
    ],
    { placeHolder: 'How often should visualization auto-launch?' }
  );

  if (choice) {
    const config = vscode.workspace.getConfiguration('flickeringScenery');
    config.update('autoLaunch.frequency', choice.value, true);
  }
});
```

---

## Viral Optimization

### First Impression Maximization

**Goal**: Make the first 10 seconds UNFORGETTABLE

```typescript
async optimizeFirstImpression(): Promise<void> {
  // 1. Full-screen takeover (first time only)
  await this.setMode('fullscreen');

  // 2. Cinematic intro animation
  await this.playIntroAnimation({
    showLogo: true,
    showFormula: true, // Display 𝔸(ℐ, W₀) = W_∞
    duration: 3000,
  });

  // 3. Agents "boot up" sequentially
  await this.sequentialAgentBoot([
    { agent: 'θ₁', delay: 0 },
    { agent: 'θ₂', delay: 300 },
    { agent: 'θ₃', delay: 600 },
    { agent: 'θ₄', delay: 900 },
    { agent: 'θ₅', delay: 1200 },
    { agent: 'θ₆', delay: 1500 },
  ]);

  // 4. Show impressive stats
  await this.showStats({
    message: 'Orchestrating 6 AI agents across 8 tmux panes',
    fadeAfter: 2000,
  });
}
```

### Shareability Features

```typescript
interface ShareFeatures {
  // Detect screen recording
  onScreenRecordingDetected(): void;

  // Optimize visuals for recording
  enhanceForRecording(): void;

  // Show "Share this!" prompt after impressive moments
  promptShare(moment: 'first_launch' | 'convergence' | 'completion'): void;

  // Generate shareable GIF/video
  generateShareable(): Promise<Blob>;
}

class ShareOptimizer implements ShareFeatures {
  onScreenRecordingDetected(): void {
    // Detect screen recording (macOS/Windows APIs)
    // Automatically:
    // - Increase contrast
    // - Slow down animations slightly
    // - Show keyboard shortcuts
    // - Add watermark
  }

  async promptShare(moment: 'first_launch' | 'convergence' | 'completion'): Promise<void> {
    if (moment === 'first_launch' && this.isFirstTime()) {
      // Wait for perfect moment
      await sleep(5000);

      vscode.window
        .showInformationMessage(
          '🎬 Record this and share on Twitter for a chance to be featured!',
          'Tweet',
          'Later'
        )
        .then((choice) => {
          if (choice === 'Tweet') {
            vscode.env.openExternal(
              vscode.Uri.parse(
                'https://twitter.com/intent/tweet?text=' +
                  encodeURIComponent(
                    '🤯 Claude Code just spawned autonomous AI agents! @ClaudeAI #FlickeringScenery'
                  ) +
                  '&url=https://github.com/ShunsukeHayashi/SEIZE'
              )
            );
          }
        });
    }
  }
}
```

### Branding & Attribution

```typescript
// Subtle watermark in tmux status bar
const BRANDING = {
  watermark: '⚡ Powered by Flickering Scenery',
  github: 'github.com/ShunsukeHayashi/SEIZE',
  cta: '⭐ Star on GitHub',
};

// Add to tmux status line
function addBranding(tmuxSession: string): void {
  exec(`tmux set-option -t ${tmuxSession} status-right '${BRANDING.watermark}'`);
}

// Show CTA at strategic moments
async function showCallToAction(): Promise<void> {
  const panel = vscode.window.createWebviewPanel(
    'cta',
    'Support Flickering Scenery',
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = `
    <div style="text-align: center; padding: 40px;">
      <h1>🌟 Enjoying Flickering Scenery?</h1>
      <p>Help us reach more developers!</p>
      <a href="https://github.com/ShunsukeHayashi/SEIZE"
         style="display: inline-block; padding: 15px 30px; background: #0366d6; color: white; text-decoration: none; border-radius: 6px;">
        ⭐ Star on GitHub
      </a>
    </div>
  `;

  // Auto-close after 5 seconds
  setTimeout(() => panel.dispose(), 5000);
}
```

---

## Safety & Fallbacks

### Resource Limits

```typescript
class ResourceManager {
  private activeSessions: Set<string> = new Set();
  private readonly MAX_SESSIONS = 3;

  async createSession(name: string): Promise<void> {
    // Prevent spawning too many tmux sessions
    if (this.activeSessions.size >= this.MAX_SESSIONS) {
      // Reuse existing session
      const oldest = Array.from(this.activeSessions)[0];
      await this.switchToSession(oldest);
      return;
    }

    // Create new session
    await exec(`tmux new-session -d -s ${name}`);
    this.activeSessions.add(name);

    // Cleanup on session end
    this.watchSession(name, () => {
      this.activeSessions.delete(name);
    });
  }

  async cleanup(): Promise<void> {
    // Kill all our sessions on extension deactivation
    for (const session of this.activeSessions) {
      await exec(`tmux kill-session -t ${session}`);
    }
    this.activeSessions.clear();
  }
}
```

### Graceful Degradation

```typescript
async launchWithFallback(config: LaunchConfig): Promise<void> {
  try {
    // Try best option first
    if (await this.detectTmux().available) {
      await this.launchViaTmuxSplit(config);
    } else {
      throw new Error('tmux not available');
    }
  } catch (e1) {
    try {
      // Fallback to VSCode terminal
      await this.launchViaVSCodeTerminal(config);
    } catch (e2) {
      try {
        // Fallback to browser overlay
        await this.launchViaBrowserOverlay(config);
      } catch (e3) {
        // Final fallback: Show simple notification
        vscode.window.showInformationMessage(
          '⚠️ Could not launch visualization. Install tmux for full experience.'
        );
      }
    }
  }
}
```

### Respect User's tmux Sessions

```typescript
async checkExistingSessions(): Promise<void> {
  const { stdout } = await exec('tmux list-sessions');
  const sessions = stdout.split('\n').map((line) => line.split(':')[0]);

  // Never hijack user's main sessions
  const userSessions = sessions.filter(
    (s) => !s.startsWith('flickering-scenery-')
  );

  if (userSessions.length > 0) {
    // User has active tmux sessions - be extra careful
    // Option 1: Create nested session
    // Option 2: Use separate terminal window
    // Option 3: Ask user permission

    const choice = await vscode.window.showQuickPick(
      [
        {
          label: 'New Window',
          description: 'Open visualization in new terminal window',
        },
        {
          label: 'Nested Session',
          description: 'Create nested tmux session (advanced)',
        },
        { label: 'Cancel', description: "Don't launch visualization" },
      ],
      { placeHolder: 'You have active tmux sessions. How should we proceed?' }
    );

    if (choice?.label === 'Cancel') {
      return;
    }
  }
}
```

### Clean Shutdown

```typescript
// extension.ts
export function deactivate(): void {
  // Kill all visualization sessions
  const launcher = TmuxLauncher.getInstance();
  launcher.cleanup();

  // Save state
  const state = StateManager.getInstance();
  state.persist();

  // Unregister hooks
  const hooks = HookRegistry.getInstance();
  hooks.unregisterAll();
}
```

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)

- [ ] Implement HookRegistry system
- [ ] Create TmuxLauncher with detection
- [ ] Build event listener framework
- [ ] Implement basic launch strategies (tmux, VSCode terminal)

### Phase 2: Smart Triggers (Week 2)

- [ ] Task complexity analyzer
- [ ] Multi-step detection
- [ ] First-time user tracking
- [ ] Cooldown & frequency management

### Phase 3: Magic Moment (Week 3)

- [ ] Timing choreography
- [ ] Transition animations
- [ ] First-time experience flow
- [ ] Sound effects (optional)

### Phase 4: Configuration (Week 4)

- [ ] Settings schema
- [ ] Settings UI in VSCode
- [ ] Quick toggle commands
- [ ] Persistence layer

### Phase 5: Viral Features (Week 5)

- [ ] Screen recording detection
- [ ] Share prompts
- [ ] Branding/watermarks
- [ ] Call-to-action system

### Phase 6: Safety & Polish (Week 6)

- [ ] Resource limits
- [ ] Graceful fallbacks
- [ ] Error handling
- [ ] Performance optimization

### Phase 7: Testing & Launch (Week 7)

- [ ] Unit tests
- [ ] Integration tests
- [ ] Beta testing with 10 users
- [ ] Launch on VSCode Marketplace

---

## Success Criteria

### Technical

- [ ] Launch latency < 100ms overhead
- [ ] Zero crashes in 1000+ launches
- [ ] Works on macOS, Linux, Windows
- [ ] Graceful degradation on all platforms

### User Experience

- [ ] First launch → Share: < 5 minutes (90% of users)
- [ ] Weekly active users: 1000+ by Month 1
- [ ] User satisfaction: 4.5+ stars on Marketplace

### Viral Metrics

- [ ] GitHub stars: 10k+ in Month 1
- [ ] Twitter mentions: 100+ unique users
- [ ] Featured in: VSCode tips accounts, dev newsletters
- [ ] YouTube videos: 10+ creators covering it

---

**Next Steps**: Proceed to implementation files for full TypeScript code.
