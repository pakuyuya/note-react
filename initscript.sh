# フロントエンド（React）プロジェクトの作成
npx create-react-app frontend

## 必要なライブラリのインストール
cd frontend
npm install react-router-dom@5
npm install --save-dev @types/react-router-dom

## ビルド用ツールのインストール
npm install --save-dev react-app-rewired

## package.jsonの修正
```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```

# バックエンド（APIサーバー）プロジェクトの作成
cd ..

## ディレクトリ作成
mkdir backend
cd backend

## TypeScriptのインストール
npm install typescript ts-node 
npm isntall --save-dev @types/node

## Expressおよび関連ライブラリのインストール
npm install express body-parser dotenv pg
npm install --save-dev @types/express @types/body-parser @types/dotenv @types/pg

## ビルド・実行用ツールのインストール
npm install --save-dev nodemon tsconfig-paths

## package.jsonの追記
```
"scripts": {
    "start": "ts-node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc"
  },
```
## tsconfig.jsonの作成

## サンプルプログラム作成

```typescript
// src/index.ts
import express from 'express';
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

## 実行
npm run dev

## ビルド
npx run build
