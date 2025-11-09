//! # Seize CLI - 統一エージェントのコマンドラインインターフェース

mod requirements_handler;

use clap::{Parser, Subcommand};
use colored::*;
use seize_core::{UnifiedAgent, World};
use tracing_subscriber;
use requirements_handler::handle_requirements_command;

#[derive(Parser)]
#[command(name = "seize")]
#[command(author = "Seize Project Contributors")]
#[command(version = "0.1.0")]
#[command(about = "統一エージェント方程式に基づくAIエージェントCLI", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// ログレベル設定 (trace, debug, info, warn, error)
    #[arg(short, long, default_value = "info")]
    log_level: String,
}

#[derive(Subcommand)]
enum Commands {
    /// エージェントを起動して入力を処理
    Run {
        /// 入力テキスト
        #[arg(short, long)]
        input: String,

        /// 最大反復回数
        #[arg(short, long, default_value = "10")]
        max_iterations: usize,

        /// 収束閾値
        #[arg(short, long, default_value = "0.8")]
        threshold: f64,
    },

    /// 世界の初期状態を表示
    Init {
        /// 出力フォーマット (json, pretty)
        #[arg(short, long, default_value = "pretty")]
        format: String,
    },

    /// エージェントの状態を表示
    Status,

    /// 統一エージェント方程式を表示
    Formula,

    /// 要求工学（Requirements Engineering）
    #[command(subcommand)]
    Requirements(RequirementsCommands),
}

#[derive(Subcommand)]
enum RequirementsCommands {
    /// 要求を抽出（Elicitation）
    Elicit {
        /// 入力ファイル（インタビュー記録など）
        #[arg(short, long)]
        input: String,

        /// ステークホルダー名
        #[arg(short, long)]
        stakeholder: String,

        /// プロジェクト名
        #[arg(short, long, default_value = "Project")]
        project: String,

        /// 出力ファイル
        #[arg(short, long)]
        output: Option<String>,
    },

    /// 要求を分析（Analysis）
    Analyze {
        /// 要求仕様書ファイル（JSON）
        #[arg(short, long)]
        spec: String,

        /// レポート出力ファイル
        #[arg(short, long)]
        report: Option<String>,
    },

    /// トレーサビリティマトリクスを生成
    Trace {
        /// 要求仕様書ファイル（JSON）
        #[arg(short, long)]
        spec: String,

        /// 出力フォーマット (markdown, json)
        #[arg(short, long, default_value = "markdown")]
        format: String,

        /// 出力ファイル
        #[arg(short, long)]
        output: Option<String>,
    },

    /// 新しい要求プロジェクトを初期化
    Init {
        /// プロジェクト名
        #[arg(short, long)]
        project: String,

        /// 出力ディレクトリ
        #[arg(short, long, default_value = ".")]
        output_dir: String,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // ログの初期化
    let log_filter = match cli.log_level.as_str() {
        "trace" => "trace",
        "debug" => "debug",
        "info" => "info",
        "warn" => "warn",
        "error" => "error",
        _ => "info",
    };

    tracing_subscriber::fmt()
        .with_env_filter(log_filter)
        .with_target(false)
        .init();

    match cli.command {
        Commands::Run {
            input,
            max_iterations,
            threshold,
        } => {
            run_agent(&input, max_iterations, threshold).await?;
        }
        Commands::Init { format } => {
            init_world(&format)?;
        }
        Commands::Status => {
            show_status()?;
        }
        Commands::Formula => {
            show_formula()?;
        }
        Commands::Requirements(req_cmd) => {
            handle_requirements_command(req_cmd).await?;
        }
    }

    Ok(())
}

/// エージェントを実行
async fn run_agent(input: &str, max_iterations: usize, threshold: f64) -> anyhow::Result<()> {
    println!("{}", "🎯 統一エージェント起動".bright_cyan().bold());
    println!();

    let agent = UnifiedAgent::new(max_iterations, threshold);
    let world = World::new();

    println!("{}", "📝 入力:".bright_green());
    println!("  {}", input);
    println!();

    let result = agent.run(input, world)?;

    println!();
    println!("{}", "✅ 実行完了".bright_green().bold());
    println!("  反復回数: {}", result.iterations);
    println!("  収束: {}", if result.converged { "✓" } else { "✗" });
    println!("  初期世界: v{}", result.initial_world.version);
    println!("  最終世界: v{}", result.final_world.version);
    println!();

    println!("{}", "📊 実行履歴:".bright_yellow());
    for (i, history) in result.final_world.context.history.iter().enumerate() {
        println!("  {}. {}", i + 1, history);
    }
    println!();

    println!("{}", "🎓 学習内容:".bright_magenta());
    for (i, learning) in result.final_world.knowledge.learnings.iter().enumerate() {
        println!("  {}. {} (信頼度: {:.2})", i + 1, learning.content, learning.confidence);
    }
    println!();

    println!("{}", "📋 意思決定記録:".bright_blue());
    for (i, decision) in result.final_world.knowledge.decisions.iter().enumerate() {
        println!("  {}. {}", i + 1, decision.purpose);
        println!("     承認者: {}", decision.approver);
    }

    Ok(())
}

/// 世界の初期状態を表示
fn init_world(format: &str) -> anyhow::Result<()> {
    let world = World::new();

    match format {
        "json" => {
            let json = serde_json::to_string_pretty(&world)?;
            println!("{}", json);
        }
        "pretty" => {
            println!("{}", "🌍 世界の初期状態".bright_cyan().bold());
            println!();
            println!("バージョン: v{}", world.version);
            println!("作業ディレクトリ: {}", world.context.working_directory);
            println!();
            println!("{}", "📚 組織の原則:".bright_green());
            for principle in &world.knowledge.principles {
                println!("  • {} - {}", principle.name, principle.description);
            }
        }
        _ => {
            anyhow::bail!("Unknown format: {}", format);
        }
    }

    Ok(())
}

/// エージェントの状態を表示
fn show_status() -> anyhow::Result<()> {
    let agent = UnifiedAgent::default();

    println!("{}", "📊 エージェントステータス".bright_cyan().bold());
    println!();
    println!("{}", agent.status());

    Ok(())
}

/// 統一エージェント方程式を表示
fn show_formula() -> anyhow::Result<()> {
    println!("{}", "🎯 統一エージェント方程式".bright_cyan().bold());
    println!();
    println!("{}", "𝔸(Input, World₀) = lim_{n→∞} [∫₀ⁿ (Θ ◦ 𝒞 ◦ ℐ)(t) dt] = World_∞".bright_yellow());
    println!();
    println!("{}", "Where:".bright_green());
    println!("  ℐ : Intent Resolution (意図解決)");
    println!("      Input → Fixed Goal");
    println!();
    println!("  𝒞 : Command Stack (コマンドスタック)");
    println!("      Goal → Execution Plan");
    println!("      𝒞 = C₃ ◦ C₂ ◦ C₁");
    println!();
    println!("  Θ : World Transformation (世界変換)");
    println!("      World_t → World_{{t+1}}");
    println!("      Θ = θ₆ ◦ θ₅ ◦ θ₄ ◦ θ₃ ◦ θ₂ ◦ θ₁");
    println!();
    println!("{}", "変換フェーズ:".bright_magenta());
    println!("  θ₁: Understand  - 理解");
    println!("  θ₂: Generate    - 生成");
    println!("  θ₃: Allocate    - 配分");
    println!("  θ₄: Execute     - 実行");
    println!("  θ₅: Integrate   - 統合");
    println!("  θ₆: Learn       - 学習");

    Ok(())
}
