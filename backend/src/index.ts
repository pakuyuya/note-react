import express from 'express';
import parser from 'body-parser';

// 共通設定
// ---------------------------

// .envファイルを読み込む
require('dotenv').config();
// DBのコネクションプールの確立
require('@/config/db').initPool();

// Expressアプリケーションの設定
const app = express();
// POSTパラメータ解析を有効化
app.use(parser.json());

app.use(require('@/api/SkillSearchApi').router);
app.use(require('@/api/SkillFetchApi').router);
app.use(require('@/api/SkillAddApi').router);
app.use(require('@/api/SkillUpdateApi').router);
app.use(require('@/api/SkillRemoveApi').router);

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
