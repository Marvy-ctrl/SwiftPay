SwiftPay

A seamless digital banking experience with secure accounts, instant transfers, and rewarding lucky draws.
⚠️ Note: This is a practical project for learning purposes only and does not represent a real bank.

✨ Features

. Authentication: signup, login, logout, password reset, email verification

. Account Management: unique account numbers, balance tracking

. Money Transfers: secure transfers within the system with PIN validation

. Lucky Draw: random prize rewards added to user accounts

. Dashboard: balance overview, recent transactions, analytics charts

. Settings: profile update, password & PIN changes, account deletion

. Notifications: email alerts for transactions and account events

. Database Models

User → user profiles & authentication

Account → account number & balance

Transaction → logs all money movements

LuckyDraw → logs all lucky draw wins

 API Endpoints

Auth: POST /auth/register, POST /auth/login, POST /auth/logout, POST /auth/request-password-reset, POST /auth/reset-password

User/Settings: GET /users/me, PATCH /users/me, PATCH /users/me/change-password, PATCH /users/me/change-pin, DELETE /users/me

Accounts: POST /accounts, GET /accounts/me, GET /accounts/{account_number}

Transactions: POST /transactions/transfer, GET /transactions/me, GET /transactions/{id}

Lucky Draw: POST /lucky-draw/play, GET /lucky-draw/history

 Frontend Pages

Dashboard: balance, account info, last transactions, charts, quick actions

Transactions: full history & individual transaction details

Send Money: transfer funds securely

Lucky Draw: participate and view results

Settings: profile, password & PIN management, account deletion

Auth: signup, login, verification, password reset

 Setup

Clone the repo

Install dependencies

Configure database connection

Run migrations

Start backend server

Connect frontend

📄 License

MIT License
