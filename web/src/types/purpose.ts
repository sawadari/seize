/**
 * 目的情報
 */
export interface Purpose {
  goal: string;                 // 目的（例: カート放棄率15%削減）
  scope: string;                // 範囲（例: 認証機能）
  mode: 'safe' | 'power';       // 安全モード or パワーユーザーモード
  successCriteria?: string;     // 成功条件
}
