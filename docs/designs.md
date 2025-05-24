## 🛠️ 技術設計書（Version 1.0）

### 1. システム構成図

```
[ React UI (Vite) ]  ←HTTP→  [ Cloudflare Functions ]
         |                               |
         | LocalStorage                  | OpenAI GPT-4o API
         |                               |
   [ Service Worker / PWA ]              |
```

### 2. 採用技術

| レイヤ      | 技術スタック                           | 理由                 |
| -------- | -------------------------------- | ------------------ |
| フロントエンド  | **React 18 + TypeScript + Vite** | 高速ビルド＆型安全          |
| ゲームエンジン  | **Phaser 3**                     | 軽量 2D、React との親和性◎ |
| 状態管理     | Zustand                          | シンプル、Context 依存削減  |
| UI ライブラリ | TailwindCSS + daisyUI            | かわいい & 低コスト        |
| アニメーション  | Framer Motion                    | 滑らかな UI 遷移         |
| バックエンド   | Cloudflare Workers (Edge)        | 無サーバー、低レイテンシ       |
| AI       | OpenAI GPT-4o                    | 占い文生成、日本語品質良       |
| 画像生成     | html-to-canvas (html2canvas)     | 占いカードを PNG 化       |
| デプロイ     | Cloudflare Pages                 | GitHub 連携、CDN 配信   |

### 3. アーキテクチャ詳細

#### 3.1 ゲームフロー

1. 起動 → `getTodaySeed()` で日付シード生成。
2. `hasPlayed(seed)` を LocalStorage で確認。未プレイなら **PlayScene** へ遷移。
3. **PlayScene**:

   * `Player`（レオ）Sprite、`Ground` TileSprite。
   * `SnackGroup` でランダムおやつ生成（seed で決定）。
   * 衝突検知 → `collectedSnacks[]` へ push。
4. 10 秒経過 or ゴール到達で `finishRun()`。
5. `POST /fortune` に `{ seed, snacks }` を送信。
6. Worker が GPT-4o へプロンプト → `{ grade, message }` を返却。
7. 結果シーンでアニメーション＋カード生成。`storePlay(seed)` で “今日はおしまい”。

#### 3.2 API インターフェース

```ts
// Request
POST /fortune
{
  "seed": "2025-05-24",
  "snacks": ["COOKIE", "CHICKEN", "COOKIE"]
}

// Response
{
  "grade": "大吉",
  "message": "ワン！クッキーたっぷりで超ハッピー！..."
}
```

#### 3.3 GPT-4o プロンプト骨子

```
システム: あなたは陽気な犬レオです。
入力: おやつリスト
出力: 以下 JSON
  grade: 大吉|中吉|吉|小吉|末吉|凶|大凶
  message: 40文字以内でレオ口調
```

### 4. UI/UX ガイドライン

* **配色**: メイン #FFB347（元気オレンジ）＋アクセント #6EC6FF（空色）。
* **フォント**: “Kiwi Maru”（丸み）で柔らかさ。
* **レイアウト**: 片手操作を意識し、ボタンは下部中央に 48 dp 以上。
* **マイクロインタラクション**: おやつ取得でスパークル + 小さく「ワン！」SE。

### 5. セキュリティ / プライバシー

| 項目                | 対策                               |
| ----------------- | -------------------------------- |
| API Abuse         | CORS オリジン固定、Rate-Limit 60/min/IP |
| Content Filtering | GPT に「不適切ワード禁止」をシステムメッセージで指示     |
| 個人情報              | 取得なし。seed と snack 種類のみ送信。        |

### 6. テスト計画

| テスト種別            | 重点項目                                            |
| ---------------- | ----------------------------------------------- |
| 単体テスト            | `getTodaySeed`, `collisionHandler`, API handler |
| 結合テスト            | Seed→同一おやつ→同一運勢を保証                              |
| E2E (Playwright) | 初回プレイ→結果→翌日ロールオーバー                              |
| パフォーマンス          | Mobile Lighthouse 80+ を CI で自動チェック              |

### 7. CI/CD

* GitHub Actions → `npm test` → Lighthouse CI → Cloudflare Pages deploy。
* `main` ブランチにマージで自動本番更新、`dev` ブランチは preview 環境。

### 8. 今後の拡張案

1. **フレンドランキング**（運勢連勝記録）
2. **多言語化**（英語・韓国語）
3. **季節限定スキン**（お正月レオ衣装など）
