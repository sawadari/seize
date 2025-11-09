# Viral Strategy Document

**Module**: Hooks - Viral Optimization
**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Goal**: Make auto-launch SO impressive that sharing is inevitable

---

## Table of Contents

1. [The Viral Loop](#the-viral-loop)
2. [Shareability Features](#shareability-features)
3. [Social Proof Mechanisms](#social-proof-mechanisms)
4. [Growth Hacking Tactics](#growth-hacking-tactics)
5. [Measurement & Analytics](#measurement--analytics)
6. [Timeline & Milestones](#timeline--milestones)

---

## The Viral Loop

### Customer Journey (Optimized for Sharing)

```
Install Plugin
    ↓
First Use (normal expectation)
    ↓
Ask Claude a complex question
    ↓
🎬 MAGIC MOMENT: tmux visualization appears
    ↓
"WTF did that just happen!?"
    ↓
[Record screen / Screenshot]
    ↓
Share on Twitter/Reddit/Discord
    ↓
Friends see post → Install plugin
    ↓
LOOP REPEATS ♻️
```

### The "15-Second Window"

**Critical Period**: From magic moment to share decision

**Goal**: Make sharing the OBVIOUS next step

**Strategy**:
1. **0-3 seconds**: User experiences surprise
2. **3-5 seconds**: User realizes what happened
3. **5-10 seconds**: User appreciates the beauty
4. **10-15 seconds**: Call-to-action appears
5. **15+ seconds**: User shares (or plugin failed)

---

## Shareability Features

### 1. Screen Recording Detection

**Goal**: Optimize visuals when user is recording

```typescript
class ScreenRecordingDetector {
  /**
   * Detect if screen recording is active
   * - macOS: Check for ScreenCaptureKit API
   * - Windows: Check for Windows.Graphics.Capture
   * - Linux: Check for OBS/ffmpeg processes
   */
  async isRecording(): Promise<boolean> {
    const platform = process.platform;

    if (platform === 'darwin') {
      // macOS: Check if any app has screen recording permission active
      const { exec } = require('child_process');
      const { stdout } = await exec(
        'ioreg -l | grep -i "screencapture"'
      );
      return stdout.length > 0;
    }

    // Fallback: Assume not recording
    return false;
  }

  /**
   * Automatically enhance visuals for recording
   */
  async enhanceForRecording(): Promise<void> {
    // Increase contrast
    await this.setTheme('high-contrast');

    // Slow down animations 20% (easier to capture)
    await this.setAnimationSpeed(0.8);

    // Show keyboard shortcuts overlay
    await this.showShortcutsOverlay();

    // Add watermark with GitHub link
    await this.addWatermark({
      text: '⚡ Flickering Scenery',
      link: 'github.com/ShunsukeHayashi/SEIZE',
      position: 'bottom-right',
    });
  }
}
```

### 2. One-Click Share

**Goal**: Make sharing require ZERO effort

```typescript
interface ShareOptions {
  platform: 'twitter' | 'reddit' | 'discord' | 'linkedin';
  includeGif: boolean;
  customMessage?: string;
}

class ShareHelper {
  /**
   * Generate shareable GIF from last 10 seconds
   */
  async generateShareableGif(): Promise<Blob> {
    // Capture last 10 seconds of tmux output
    const frames = await this.captureFrames(10000);

    // Convert to GIF using gifenc or similar
    const gif = await this.framesToGif(frames, {
      fps: 10,
      quality: 80,
      width: 1200,
      height: 800,
    });

    return gif;
  }

  /**
   * Share to Twitter with pre-filled text
   */
  async shareToTwitter(): Promise<void> {
    const text = encodeURIComponent(
      '🤯 Claude Code just spawned autonomous AI agents in my terminal! ' +
        '@ClaudeAI #FlickeringScenery #AIAgents'
    );

    const url = encodeURIComponent(
      'https://github.com/ShunsukeHayashi/SEIZE'
    );

    vscode.env.openExternal(
      vscode.Uri.parse(
        `https://twitter.com/intent/tweet?text=${text}&url=${url}`
      )
    );
  }

  /**
   * Share to Reddit (r/programming, r/MachineLearning)
   */
  async shareToReddit(subreddit: string = 'programming'): Promise<void> {
    const title = encodeURIComponent(
      'Claude Code auto-spawned AI agents in my terminal (Flickering Scenery plugin)'
    );

    const url = encodeURIComponent(
      'https://github.com/ShunsukeHayashi/SEIZE'
    );

    vscode.env.openExternal(
      vscode.Uri.parse(
        `https://reddit.com/r/${subreddit}/submit?title=${title}&url=${url}`
      )
    );
  }

  /**
   * Copy shareable link with UTM tracking
   */
  async copyShareableLink(source: string): Promise<void> {
    const link =
      'https://github.com/ShunsukeHayashi/SEIZE' +
      `?utm_source=${source}&utm_medium=social&utm_campaign=auto_launch`;

    await vscode.env.clipboard.writeText(link);

    vscode.window.showInformationMessage(
      '📋 Shareable link copied to clipboard!'
    );
  }
}
```

### 3. Share Prompts (Strategic Timing)

**When to Prompt**:

1. **First launch** (90% share rate): Right after first-time experience
2. **Convergence complete**: When task finishes successfully
3. **After impressive moment**: When user watches for >30 seconds
4. **Weekly reminder**: If user hasn't shared yet

```typescript
class SharePrompter {
  async promptShare(moment: 'first_launch' | 'convergence' | 'impressive'): Promise<void> {
    const prompts = {
      first_launch: {
        title: '🎬 Record this and share on Twitter?',
        message:
          "You just witnessed something special. Share it with the world!",
        buttons: ['Tweet', 'Record & Share', 'Later'],
      },
      convergence: {
        title: '✨ Your agents just converged to the perfect solution!',
        message: 'Share this impressive orchestration?',
        buttons: ['Share', 'Copy Link', 'Later'],
      },
      impressive: {
        title: "🔥 You've been watching for 30 seconds...",
        message: 'Others need to see this too!',
        buttons: ['Share on Twitter', 'Share on Reddit', 'Later'],
      },
    };

    const config = prompts[moment];

    const choice = await vscode.window.showInformationMessage(
      `${config.title}\n\n${config.message}`,
      ...config.buttons
    );

    if (choice === 'Tweet' || choice === 'Share on Twitter') {
      await this.shareHelper.shareToTwitter();
    } else if (choice === 'Share on Reddit') {
      await this.shareHelper.shareToReddit();
    } else if (choice === 'Copy Link') {
      await this.shareHelper.copyShareableLink(moment);
    } else if (choice === 'Record & Share') {
      await this.startRecording();
    }
  }

  private async startRecording(): Promise<void> {
    vscode.window.showInformationMessage(
      '🎥 Start your screen recorder and trigger a task in Claude Code!'
    );
  }
}
```

---

## Social Proof Mechanisms

### 1. Live Counter (GitHub Stars)

```typescript
class GitHubStarCounter {
  /**
   * Show live star count in status bar
   */
  async showStarCount(): Promise<void> {
    const stars = await this.fetchStarCount();

    const statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );

    statusBar.text = `⭐ ${stars.toLocaleString()} stars`;
    statusBar.tooltip = 'Star Flickering Scenery on GitHub';
    statusBar.command = 'flickeringScenery.openGitHub';
    statusBar.show();

    // Update every hour
    setInterval(async () => {
      const newStars = await this.fetchStarCount();
      statusBar.text = `⭐ ${newStars.toLocaleString()} stars`;
    }, 60 * 60 * 1000);
  }

  private async fetchStarCount(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.github.com/repos/ShunsukeHayashi/SEIZE'
      );
      const data = await response.json();
      return data.stargazers_count;
    } catch {
      return 0;
    }
  }
}
```

### 2. User Testimonials

**Show in first-time experience**:

```typescript
const TESTIMONIALS = [
  {
    quote: "This is the most impressive VS Code plugin I've ever seen",
    author: '@developer1',
    stars: 5,
  },
  {
    quote: 'My jaw literally dropped when the agents appeared',
    author: '@coder_jane',
    stars: 5,
  },
  {
    quote: 'It feels like watching actual AI orchestration in real-time',
    author: '@ai_enthusiast',
    stars: 5,
  },
];

async function showTestimonial(): Promise<void> {
  const random = TESTIMONIALS[Math.floor(Math.random() * TESTIMONIALS.length)];

  vscode.window.showInformationMessage(
    `⭐⭐⭐⭐⭐\n"${random.quote}"\n— ${random.author}`
  );
}
```

---

## Growth Hacking Tactics

### 1. Referral System

**Give users a reason to share**:

```typescript
interface ReferralReward {
  stars: number; // Friends who star via your link
  reward: string;
}

const REFERRAL_TIERS: ReferralReward[] = [
  { stars: 1, reward: '🥉 Bronze Badge (shown in visualization)' },
  { stars: 5, reward: '🥈 Silver Badge + Early access to features' },
  { stars: 10, reward: '🥇 Gold Badge + Custom agent colors' },
  { stars: 50, reward: '💎 Diamond Badge + Your name in credits' },
];

class ReferralTracker {
  async generateReferralLink(userId: string): Promise<string> {
    return `https://github.com/ShunsukeHayashi/SEIZE?ref=${userId}`;
  }

  async trackReferral(referrer: string): Promise<void> {
    // Track in backend/analytics
    await this.incrementReferralCount(referrer);

    // Check if user unlocked new tier
    const count = await this.getReferralCount(referrer);
    const newTier = REFERRAL_TIERS.find((t) => t.stars === count);

    if (newTier) {
      vscode.window.showInformationMessage(
        `🎉 You unlocked: ${newTier.reward}!`
      );
    }
  }
}
```

### 2. Weekly Challenges

**Keep users engaged and sharing**:

```typescript
interface Challenge {
  week: number;
  task: string;
  reward: string;
  sharePrompt: string;
}

const WEEKLY_CHALLENGES: Challenge[] = [
  {
    week: 1,
    task: 'Use Claude Code to refactor a complex function',
    reward: 'Refactoring Master badge',
    sharePrompt: 'Share your before/after with #FlickeringScenery',
  },
  {
    week: 2,
    task: 'Complete a task that requires 5+ agent phases',
    reward: 'Orchestration Expert badge',
    sharePrompt: 'Share a screenshot of your convergence dashboard',
  },
  // ... more challenges
];
```

### 3. Launch Campaign

**First 2 weeks are CRITICAL**:

#### Week 1: Seed the Community

- **Day 1**: Launch on Product Hunt
- **Day 2**: Post on r/programming, r/MachineLearning, r/vscode
- **Day 3**: Tweet from founder account + tag @ClaudeAI
- **Day 4**: HackerNews "Show HN"
- **Day 5**: Email VSCode newsletter editors
- **Day 6**: Post on dev.to
- **Day 7**: Recap + thank you post

#### Week 2: Amplify

- **Day 8-14**: Daily posts showing different use cases
- **Partnerships**: Contact VSCode influencers for features
- **YouTube**: Demo videos + tutorials
- **Discord**: Create community server

---

## Measurement & Analytics

### Key Metrics

```typescript
interface ViralMetrics {
  // Top-of-funnel
  installs: number;
  installsPerDay: number;

  // Engagement
  firstLaunchRate: number; // % who see first launch
  watchDuration: number; // Average watch time

  // Viral
  shareRate: number; // % who share
  viralCoefficient: number; // Shares per user
  shareToInstallRate: number; // % of shares that convert

  // Social proof
  githubStars: number;
  twitterMentions: number;
  redditUpvotes: number;

  // Retention
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  churnRate: number;
}

class AnalyticsTracker {
  /**
   * Track event (opt-in only)
   */
  async track(event: string, properties?: Record<string, any>): Promise<void> {
    const config = vscode.workspace.getConfiguration('flickeringScenery');
    const telemetryEnabled = config.get('privacy.telemetry', false);

    if (!telemetryEnabled) return;

    // Send to analytics backend
    await this.send({
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        version: this.getExtensionVersion(),
      },
    });
  }

  /**
   * Track share event
   */
  async trackShare(platform: string, moment: string): Promise<void> {
    await this.track('share', { platform, moment });
  }

  /**
   * Calculate viral coefficient
   */
  async getViralCoefficient(): Promise<number> {
    const totalUsers = await this.getTotalUsers();
    const totalShares = await this.getTotalShares();

    return totalShares / totalUsers;
  }

  /**
   * Get real-time dashboard data
   */
  async getDashboard(): Promise<ViralMetrics> {
    return {
      installs: await this.getInstalls(),
      installsPerDay: await this.getInstallsPerDay(),
      firstLaunchRate: await this.getFirstLaunchRate(),
      watchDuration: await this.getAverageWatchDuration(),
      shareRate: await this.getShareRate(),
      viralCoefficient: await this.getViralCoefficient(),
      shareToInstallRate: await this.getShareToInstallRate(),
      githubStars: await this.getGitHubStars(),
      twitterMentions: await this.getTwitterMentions(),
      redditUpvotes: await this.getRedditUpvotes(),
      dailyActiveUsers: await this.getDAU(),
      weeklyActiveUsers: await this.getWAU(),
      churnRate: await this.getChurnRate(),
    };
  }
}
```

### Success Thresholds

| Metric | Good | Great | Viral |
|--------|------|-------|-------|
| Share Rate | 5% | 15% | 30%+ |
| Viral Coefficient | 0.5 | 1.0 | 2.0+ |
| Watch Duration | 10s | 30s | 60s+ |
| GitHub Stars (Month 1) | 1k | 5k | 10k+ |

---

## Timeline & Milestones

### Pre-Launch (Week -2 to 0)

- [ ] Complete auto-launch implementation
- [ ] Test on 10 beta users
- [ ] Record demo videos
- [ ] Prepare launch materials (screenshots, GIFs)
- [ ] Set up analytics
- [ ] Create Product Hunt page
- [ ] Write launch blog post

### Launch Week (Week 1)

**Day 1: Big Bang**
- [ ] Launch on VSCode Marketplace
- [ ] Product Hunt
- [ ] Reddit posts
- [ ] Twitter thread
- [ ] Email list

**Day 2-3: Amplify**
- [ ] Respond to all comments
- [ ] Share user testimonials
- [ ] Post on HackerNews

**Day 4-7: Sustain**
- [ ] Daily feature highlights
- [ ] User-generated content
- [ ] Press outreach

### Growth Phase (Week 2-4)

- [ ] Weekly challenges
- [ ] Partnership with VSCode influencers
- [ ] YouTube tutorials
- [ ] Discord community launch
- [ ] v1.1 with user-requested features

### Scale Phase (Month 2-3)

- [ ] 10k stars milestone celebration
- [ ] Featured in VSCode blog
- [ ] Conference talks (e.g., GitHub Universe)
- [ ] Enterprise features

---

## Viral Post Templates

### Twitter Thread Template

```
🧵 THREAD: I just installed a VSCode plugin and my jaw DROPPED

1/ I was using Claude Code like normal when suddenly...

2/ My terminal EXPLODED with a tmux visualization showing 6 AI agents 🤯

3/ Here's what happened: [GIF]

4/ The plugin is called "Flickering Scenery" and it visualizes Claude's multi-agent orchestration in real-time

5/ It auto-launches when Claude breaks down complex tasks. No configuration needed.

6/ Watch as agents progress through 6 phases: θ₁→θ₂→θ₃→θ₄→θ₅→θ₆

7/ The math behind it (Law of Flickering Scenery):
   𝔸(ℐ, W₀) = lim_{n→∞} (Θ ◦ 𝒞 ◦ ℐ)ⁿ = W_∞

8/ Why this matters: We're seeing the first glimpse of truly autonomous agent systems

9/ Install: [link]
   GitHub: [link]
   Give them a ⭐ if you think this is the future!

10/ Who else needs to see this? Tag someone 👇
```

### Reddit Post Template

```markdown
# Claude Code just auto-spawned AI agents in my terminal (no, seriously)

I installed the "Flickering Scenery" VSCode plugin yesterday and had a genuine WTF moment.

## What happened

I was asking Claude Code to refactor a complex function. Mid-response, my terminal suddenly split into 8 panes showing a real-time visualization of 6 AI agents working in parallel.

[GIF]

## How it works

The plugin hooks into Claude Code's events and auto-launches a tmux visualization when it detects:
- Multi-step tasks
- Complex refactoring
- First interaction of the day
- (Sometimes) Random tasks to keep you on your toes

## The science

It's based on the "Law of Flickering Scenery" - a framework for orchestrating multiple AI agents:

𝔸(ℐ, W₀) = lim_{n→∞} (Θ ◦ 𝒞 ◦ ℐ)ⁿ = W_∞

Each agent handles a specific phase (Understand → Generate → Allocate → Execute → Integrate → Learn).

## Why this is significant

This is the first plugin I've seen that makes agent orchestration *visible*. It feels like watching the matrix.

## Links

- [GitHub](https://github.com/ShunsukeHayashi/SEIZE)
- [VSCode Marketplace](#)
- [Demo Video](#)

Give it a try and let me know what you think!
```

---

## Call-to-Action Hierarchy

**Priority 1** (First launch):
- ⭐ Star on GitHub

**Priority 2** (After convergence):
- 🐦 Share on Twitter
- 💬 Join Discord community

**Priority 3** (Weekly):
- 📝 Write a review on VSCode Marketplace
- 📹 Share a video on YouTube/Twitter

**Priority 4** (Power users):
- 🤝 Contribute to open source
- 💎 Become a sponsor

---

**Bottom Line**: If we execute this right, Flickering Scenery will be THE most shared VSCode plugin of 2025.
