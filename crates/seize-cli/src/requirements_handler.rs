//! 要求工学コマンドのハンドラー

use colored::*;
use seize_core::{RequirementsEngineer, RequirementsSpecification};
use std::fs;

/// 要求工学コマンドを処理
pub async fn handle_requirements_command(cmd: super::RequirementsCommands) -> anyhow::Result<()> {
    match cmd {
        super::RequirementsCommands::Elicit {
            input,
            stakeholder,
            project,
            output,
        } => {
            elicit_requirements(&input, &stakeholder, &project, output.as_deref()).await?;
        }
        super::RequirementsCommands::Analyze { spec, report } => {
            analyze_requirements(&spec, report.as_deref()).await?;
        }
        super::RequirementsCommands::Trace {
            spec,
            format,
            output,
        } => {
            generate_traceability(&spec, &format, output.as_deref()).await?;
        }
        super::RequirementsCommands::Init {
            project,
            output_dir,
        } => {
            init_requirements_project(&project, &output_dir).await?;
        }
    }

    Ok(())
}

/// 要求抽出
async fn elicit_requirements(
    input_file: &str,
    stakeholder: &str,
    project: &str,
    output_file: Option<&str>,
) -> anyhow::Result<()> {
    println!("{}", "📝 要求抽出 (Requirements Elicitation)".bright_cyan().bold());
    println!();

    // 入力ファイルを読み込み
    let input_text = fs::read_to_string(input_file)?;
    println!("入力ファイル: {}", input_file);
    println!("ステークホルダー: {}", stakeholder.bright_yellow());
    println!("プロジェクト: {}", project.bright_yellow());
    println!();

    // 要求エンジニアを作成
    let mut engineer = RequirementsEngineer::new(project.to_string(), true);

    // 要求を抽出
    println!("{}", "要求を抽出中...".bright_green());
    let requirements = engineer.elicit_requirements(&input_text, stakeholder)?;

    println!("{}", format!("✅ {}個の要求を抽出しました", requirements.len()).bright_green());
    println!();

    // 抽出した要求を表示
    for (i, req) in requirements.iter().enumerate() {
        println!("{}", format!("{}. {} [{}]", i + 1, req.id, format!("{:?}", req.priority)).bright_white().bold());
        println!("   {}", req.description);
        println!();
    }

    // 要求を仕様書に追加
    for req in requirements {
        engineer.add_requirement(req)?;
    }

    // 出力
    let spec = engineer.export_specification();
    let json = serde_json::to_string_pretty(spec)?;

    if let Some(output) = output_file {
        fs::write(output, &json)?;
        println!("{}", format!("📄 要求仕様書を出力: {}", output).bright_green());
    } else {
        println!("{}", "📄 要求仕様書 (JSON):".bright_blue());
        println!("{}", json);
    }

    Ok(())
}

/// 要求分析
async fn analyze_requirements(spec_file: &str, report_file: Option<&str>) -> anyhow::Result<()> {
    println!("{}", "🔍 要求分析 (Requirements Analysis)".bright_cyan().bold());
    println!();

    // 要求仕様書を読み込み
    let spec_json = fs::read_to_string(spec_file)?;
    let spec: RequirementsSpecification = serde_json::from_str(&spec_json)?;

    println!("プロジェクト: {}", spec.project_name.bright_yellow());
    println!("要求数: {}", spec.requirements.len());
    println!();

    // 要求エンジニアを作成
    let engineer = RequirementsEngineer::new(spec.project_name.clone(), true);

    // 各要求を分析
    println!("{}", "要求を分析中...".bright_green());
    let mut report_lines = Vec::new();
    report_lines.push(format!("# 要求分析レポート - {}\n", spec.project_name));
    report_lines.push(format!("バージョン: {}\n", spec.version));
    report_lines.push(format!("要求数: {}\n", spec.requirements.len()));
    report_lines.push("\n---\n\n".to_string());

    let mut valid_count = 0;
    let mut total_issues = 0;

    for req in &spec.requirements {
        let analysis = engineer.analyze_requirement(req)?;

        if analysis.is_valid {
            valid_count += 1;
            println!("{}", format!("✅ {} - 有効", req.id).bright_green());
        } else {
            println!("{}", format!("⚠️  {} - 問題あり", req.id).bright_yellow());
            for issue in &analysis.issues {
                println!("    • {}", issue.bright_red());
                total_issues += 1;
            }
        }

        // レポートに追加
        report_lines.push(format!("## {}: {}\n", req.id, req.description));
        report_lines.push(format!("**ステータス**: {}\n", if analysis.is_valid { "✅ 有効" } else { "⚠️ 問題あり" }));

        if !analysis.issues.is_empty() {
            report_lines.push("\n**問題点**:\n".to_string());
            for issue in &analysis.issues {
                report_lines.push(format!("- {}\n", issue));
            }
        }

        if !analysis.recommendations.is_empty() {
            report_lines.push("\n**推奨事項**:\n".to_string());
            for rec in &analysis.recommendations {
                report_lines.push(format!("- {}\n", rec));
            }
        }

        report_lines.push("\n---\n\n".to_string());
    }

    println!();
    println!("{}", "📊 分析結果".bright_cyan().bold());
    println!("有効な要求: {}/{}", valid_count, spec.requirements.len());
    println!("問題の総数: {}", total_issues);
    println!();

    // レポート出力
    let report_text = report_lines.join("");

    if let Some(output) = report_file {
        fs::write(output, &report_text)?;
        println!("{}", format!("📄 レポートを出力: {}", output).bright_green());
    } else {
        println!("{}", "📄 分析レポート:".bright_blue());
        println!("{}", report_text);
    }

    Ok(())
}

/// トレーサビリティマトリクス生成
async fn generate_traceability(
    spec_file: &str,
    format: &str,
    output_file: Option<&str>,
) -> anyhow::Result<()> {
    println!("{}", "🔗 トレーサビリティマトリクス生成".bright_cyan().bold());
    println!();

    // 要求仕様書を読み込み
    let spec_json = fs::read_to_string(spec_file)?;
    let spec: RequirementsSpecification = serde_json::from_str(&spec_json)?;

    let engineer = RequirementsEngineer::new(spec.project_name.clone(), true);
    let matrix = engineer.analyze_traceability();

    println!("プロジェクト: {}", spec.project_name.bright_yellow());
    println!("トレース可能な要求: {}", matrix.requirements.len());
    println!();

    let output = match format {
        "json" => {
            serde_json::to_string_pretty(&matrix.requirements)?
        }
        "markdown" => {
            let mut lines = Vec::new();
            lines.push(format!("# トレーサビリティマトリクス - {}\n", spec.project_name));
            lines.push("\n| 要求ID | 親要求 | 子要求 | テストケース |\n".to_string());
            lines.push("|--------|--------|--------|-------------|\n".to_string());

            for (req_id, entry) in &matrix.requirements {
                let parents = if entry.parent_ids.is_empty() {
                    "-".to_string()
                } else {
                    entry.parent_ids.join(", ")
                };

                let children = if entry.child_ids.is_empty() {
                    "-".to_string()
                } else {
                    entry.child_ids.join(", ")
                };

                let tests = if entry.test_case_ids.is_empty() {
                    "-".to_string()
                } else {
                    entry.test_case_ids.join(", ")
                };

                lines.push(format!("| {} | {} | {} | {} |\n", req_id, parents, children, tests));
            }

            lines.join("")
        }
        _ => {
            anyhow::bail!("Unsupported format: {}", format);
        }
    };

    if let Some(file) = output_file {
        fs::write(file, &output)?;
        println!("{}", format!("📄 トレーサビリティマトリクスを出力: {}", file).bright_green());
    } else {
        println!("{}", "📄 トレーサビリティマトリクス:".bright_blue());
        println!("{}", output);
    }

    Ok(())
}

/// 要求プロジェクトの初期化
async fn init_requirements_project(project: &str, output_dir: &str) -> anyhow::Result<()> {
    println!("{}", "🚀 要求プロジェクト初期化".bright_cyan().bold());
    println!();

    println!("プロジェクト名: {}", project.bright_yellow());
    println!("出力ディレクトリ: {}", output_dir.bright_yellow());
    println!();

    // ディレクトリ構造を作成
    let project_dir = format!("{}/{}", output_dir, project);
    fs::create_dir_all(&project_dir)?;
    fs::create_dir_all(format!("{}/stakeholders", project_dir))?;
    fs::create_dir_all(format!("{}/requirements", project_dir))?;
    fs::create_dir_all(format!("{}/analysis", project_dir))?;

    // テンプレートファイルを作成
    let readme = format!(
        "# {} - 要求仕様書\n\n\
        ## プロジェクト概要\n\n\
        [プロジェクトの概要を記述]\n\n\
        ## ステークホルダー\n\n\
        - [ステークホルダー1]\n\
        - [ステークホルダー2]\n\n\
        ## ディレクトリ構造\n\n\
        - `stakeholders/` - ステークホルダーインタビュー記録\n\
        - `requirements/` - 要求仕様書\n\
        - `analysis/` - 分析レポート\n",
        project
    );

    fs::write(format!("{}/README.md", project_dir), readme)?;

    let interview_template = "# ステークホルダーインタビュー\n\n\
        **日時**: [日時]\n\
        **インタビュー対象**: [名前、役割]\n\n\
        ## 主要な要求\n\n\
        1. [要求1]\n\
        2. [要求2]\n\n\
        ## その他のコメント\n\n\
        [コメント]\n";

    fs::write(
        format!("{}/stakeholders/interview_template.md", project_dir),
        interview_template,
    )?;

    println!("{}", "✅ プロジェクト構造を作成しました:".bright_green());
    println!("  {}/", project_dir);
    println!("  ├── README.md");
    println!("  ├── stakeholders/");
    println!("  │   └── interview_template.md");
    println!("  ├── requirements/");
    println!("  └── analysis/");
    println!();
    println!("{}", "次のステップ:".bright_yellow());
    println!("  1. stakeholders/ にインタビュー記録を追加");
    println!("  2. seize requirements elicit でinタビューから要求を抽出");
    println!("  3. seize requirements analyze で要求を分析");

    Ok(())
}
