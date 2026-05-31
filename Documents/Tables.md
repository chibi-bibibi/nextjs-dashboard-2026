# DB設計書

## テーブル一覧

| テーブル名 | 概要 |
|---|---|
| users | アプリケーションのログインユーザー |
| customers | 請求対象の顧客 |
| invoices | 請求書 |
| revenue | 月次売上データ |
| books | 蔵書データ |

---

## users

ログイン認証に使用するユーザー情報を管理する。

| カラム名 | データ型 | PK | UK | FK | NN | Default | 説明 |
|---|---|:---:|:---:|:---:|:---:|---|---|
| id | UUID | ○ | | | | uuid_generate_v4() | ユーザーID |
| name | VARCHAR(255) | | | | ○ | | ユーザー名 |
| email | TEXT | | ○ | | ○ | | メールアドレス |
| password | TEXT | | | | ○ | | ハッシュ化されたパスワード |

---

## books

書籍情報

| カラム名 | データ型 | PK | UK | FK | NN | Default | 説明 |
|---|---|:---:|:---:|:---:|:---:|---|---|
| id | UUID | ○ | | | | uuid_generate_v4() | 書籍ID |
| name | VARCHAR(255) | | | | ○ | | 書籍名 |
| author_id | VARCHAR(255) | | | ○ | ○ | | 著者ID |


## customers

請求書の宛先となる顧客情報を管理する。

| カラム名 | データ型 | PK | UK | FK | NN | Default | 説明 |
|---|---|:---:|:---:|:---:|:---:|---|---|
| id | UUID | ○ | | | | uuid_generate_v4() | 顧客ID |
| name | VARCHAR(255) | | | | ○ | | 顧客名 |
| email | VARCHAR(255) | | | | ○ | | メールアドレス |
| image_url | VARCHAR(255) | | | | ○ | | プロフィール画像URL |

---

## invoices

顧客への請求書情報を管理する。

| カラム名 | データ型 | PK | UK | FK | NN | Default | 説明 |
|---|---|:---:|:---:|:---:|:---:|---|---|
| id | UUID | ○ | | | | uuid_generate_v4() | 請求書ID |
| customer_id | UUID | | | customers.id | ○ | | 顧客ID |
| amount | INT | | | | ○ | | 金額（セント単位） |
| status | VARCHAR(255) | | | | ○ | | ステータス（`pending` / `paid`） |
| date | DATE | | | | ○ | | 請求日 |

---

## revenue

月次の売上集計データを管理する。

| カラム名 | データ型 | PK | UK | FK | NN | Default | 説明 |
|---|---|:---:|:---:|:---:|:---:|---|---|
| month | VARCHAR(4) | | ○ | | ○ | | 対象月（例: `Jan`, `Feb`） |
| revenue | INT | | | | ○ | | 売上金額（セント単位） |

---

## ER図（概略）

```
users
  └─ (認証のみ、他テーブルとの外部キー関係なし)

customers
  └── invoices (1:N)
        customer_id → customers.id

revenue
  └─ (独立テーブル)

books

```
