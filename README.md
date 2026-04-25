# antd-dynamic-table-ja

Ant DesignベースのReact動的テーブルコンポーネント（日本語対応）

## 特徴
- データを渡すだけで列を自動生成
- チェックボックスフィルター
- セル編集・変更行の一括保存
- 表示専用モード
- 日本語対応（Ant Design jaJP）

## インストール

npm install antd

## 使い方

import DynamicTable from "./DynamicTable";

// フィルター・編集あり
<DynamicTable items={data} onSave={handleSave} showFilter={true} editable={true} />

// 表示のみ
<DynamicTable items={data} editable={false} />

## Props

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| items | array | 必須 | 表示するデータ |
| onSave | function | - | 保存時のコールバック |
| showFilter | boolean | false | フィルターを表示 |
| editable | boolean | true | 編集を有効にする |