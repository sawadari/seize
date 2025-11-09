# ECサイト ユーザー認証機能 - サンプルプロジェクト

このサンプルプロジェクトは、統一エージェント方程式を用いた要求工学の実践例です。

## プロジェクト概要

**プロジェクト名**: ECサイト ユーザー認証機能の改善
**期間**: 2025年1月〜3月
**目的**: 既存のECサイトにセキュアで使いやすい認証機能を実装

## ビジネス背景

現在のECサイトは基本的なログイン機能しかなく、以下の課題があります：

- パスワードリセット機能がない
- 二要素認証に対応していない
- ソーシャルログイン（Google/Facebook）が使えない
- セッション管理が脆弱
- ログイン試行回数の制限がない

## ステークホルダー

| 役割 | 名前 | 関心事 |
|------|------|--------|
| Product Owner | 田中 太郎 | ユーザー体験の向上、売上増加 |
| セキュリティ担当 | 佐藤 花子 | データ保護、GDPR準拠 |
| エンドユーザー | - | 簡単で安全なログイン |
| 開発チーム | 山田 次郎 | 実装の容易性、保守性 |

## プロジェクト構成

```
ecommerce-auth/
├── README.md                          # このファイル
├── stakeholders/                      # ステークホルダー資料
│   ├── product_owner_interview.md    # POインタビュー
│   ├── security_team_interview.md    # セキュリティチームインタビュー
│   └── user_feedback.md              # ユーザーフィードバック
├── requirements/                      # 要求仕様書
│   ├── requirements_v1.json          # 抽出された要求（JSON）
│   ├── requirements_v1.md            # 要求仕様書（Markdown）
│   └── acceptance_criteria.md        # 受入基準
├── analysis/                          # 分析結果
│   ├── requirements_analysis.md      # 要求分析レポート
│   ├── traceability_matrix.md        # トレーサビリティマトリクス
│   └── risk_assessment.md            # リスク評価
├── design/                            # 設計ドキュメント
│   └── authentication_design.md      # 認証設計書
└── tests/                             # テスト計画
    └── test_plan.md                  # テスト計画書
```

## ワークフロー

### ステップ1: 要求抽出

```bash
# ステークホルダーインタビューから要求を抽出
seize requirements elicit \
  --input stakeholders/product_owner_interview.md \
  --stakeholder "Product Owner" \
  --project "ECサイト認証" \
  --output requirements/requirements_v1.json
```

### ステップ2: 要求分析

```bash
# 要求の品質をチェック（5C原則）
seize requirements analyze \
  --spec requirements/requirements_v1.json \
  --report analysis/requirements_analysis.md
```

### ステップ3: トレーサビリティマトリクス生成

```bash
# 要求→設計→実装→テストのトレーサビリティを生成
seize requirements trace \
  --spec requirements/requirements_v1.json \
  --format markdown \
  --output analysis/traceability_matrix.md
```

## 主要な要求

### ビジネス要求

- **BR-001**: ユーザーの利便性を向上させ、カート放棄率を削減する
- **BR-002**: セキュリティを強化し、顧客データを保護する
- **BR-003**: GDPR/個人情報保護法に準拠する

### ユーザー要求

- **UR-001**: 簡単にログインできる（ソーシャルログイン対応）
- **UR-002**: パスワードを忘れても復旧できる
- **UR-003**: セキュリティが保証されている（二要素認証）

### システム要求

- **SR-001**: OAuth 2.0によるソーシャルログインを実装
- **SR-002**: メール/SMSによるパスワードリセット機能
- **SR-003**: TOTPベースの二要素認証

### 機能要求

- **FR-001**: ユーザーは、メールアドレスとパスワードでログインできる
- **FR-002**: ユーザーは、Google/Facebookアカウントでログインできる
- **FR-003**: ユーザーは、パスワードリセットをリクエストできる
- **FR-004**: ユーザーは、二要素認証を有効化できる
- **FR-005**: システムは、5回連続ログイン失敗でアカウントをロックする

### 非機能要求

- **NFR-001 (Security)**: パスワードはbcryptでハッシュ化して保存
- **NFR-002 (Security)**: セッショントークンは暗号学的に安全な乱数で生成
- **NFR-003 (Performance)**: ログイン処理は1秒以内に完了
- **NFR-004 (Availability)**: システム稼働率99.9%以上
- **NFR-005 (Compliance)**: GDPR Article 32準拠（データ保護）

## 技術スタック

- **バックエンド**: Rust (Actix-web)
- **認証**: OAuth 2.0, JWT, TOTP
- **データベース**: PostgreSQL
- **キャッシュ**: Redis
- **暗号化**: bcrypt, AES-256

## 成功基準

1. カート放棄率を15%削減
2. ログイン関連のサポート問い合わせを50%削減
3. セキュリティ監査で重大な脆弱性ゼロ
4. ユーザー満足度スコア4.5/5以上

## スケジュール

- **Week 1-2**: 要求抽出・分析
- **Week 3-4**: 設計
- **Week 5-8**: 実装
- **Week 9-10**: テスト
- **Week 11**: リリース準備
- **Week 12**: 本番デプロイ

## 参考資料

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [GDPR Article 32](https://gdpr-info.eu/art-32-gdpr/)

---

**このサンプルプロジェクトで、統一エージェント方程式を使った要求工学の実践を学びましょう！**
