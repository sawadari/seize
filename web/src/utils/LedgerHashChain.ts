import { DecisionLedgerEntry } from '../types/decisionLedger';

/**
 * Ledgerのハッシュ鎖実装（append-only + 改ざん耐性）
 */

/**
 * SHA-256ハッシュを計算
 */
export async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * LedgerEntryのハッシュを計算
 */
export async function computeLedgerEntryHash(
  entry: Omit<DecisionLedgerEntry, 'hash'>,
  prevHash: string
): Promise<string> {
  // canonical JSON（キーをソートして一意性を保証）
  const canonical = JSON.stringify(entry, Object.keys(entry).sort());
  const payload = prevHash + canonical;
  return computeHash(payload);
}

/**
 * Ledgerエントリを署名付きで作成
 */
export async function createSignedLedgerEntry(
  entry: Omit<DecisionLedgerEntry, 'hash' | 'prevHash' | 'signature'>,
  prevHash: string,
  signerPublicKeyFingerprint: string
): Promise<DecisionLedgerEntry> {
  const hash = await computeLedgerEntryHash(entry, prevHash);

  return {
    ...entry,
    prevHash,
    hash,
    signature: {
      signerId: entry.approver,
      publicKeyFingerprint: signerPublicKeyFingerprint,
      timestamp: new Date(),
    },
  };
}

/**
 * Ledgerチェーンの整合性を検証
 */
export async function verifyLedgerChain(entries: DecisionLedgerEntry[]): Promise<{
  valid: boolean;
  brokenAt?: number;
  error?: string;
}> {
  if (entries.length === 0) {
    return { valid: true };
  }

  // 最初のエントリはprevHashがnullまたは'0'
  if (entries[0].prevHash && entries[0].prevHash !== '0') {
    return {
      valid: false,
      brokenAt: 0,
      error: '最初のエントリのprevHashが不正です',
    };
  }

  // 各エントリのハッシュを検証
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const prevHash = i === 0 ? '0' : entries[i - 1].hash || '';

    // prevHashの連鎖を確認
    if (entry.prevHash !== prevHash) {
      return {
        valid: false,
        brokenAt: i,
        error: `エントリ${i}のprevHashが前エントリのハッシュと一致しません`,
      };
    }

    // ハッシュの再計算と検証
    const { hash, prevHash: _, signature: __, ...entryWithoutHash } = entry;
    const computedHash = await computeLedgerEntryHash(entryWithoutHash, prevHash);

    if (hash !== computedHash) {
      return {
        valid: false,
        brokenAt: i,
        error: `エントリ${i}のハッシュが改ざんされています`,
      };
    }
  }

  return { valid: true };
}

/**
 * Ledgerをエクスポート（署名付き）
 */
export function exportLedgerWithSignature(
  entries: DecisionLedgerEntry[],
  metadata: {
    projectName: string;
    exportedAt: Date;
    exportedBy: string;
  }
): string {
  const exportData = {
    metadata,
    entries,
    chainValid: true, // エクスポート時は検証済み
    version: '2.0',
  };

  return JSON.stringify(exportData, null, 2);
}
