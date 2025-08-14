# WhatsApp Clone – Express + Mongoose API

Quick start
- cd server
- cp .env.example .env  # update MONGO_URI and API_KEY as needed
- npm i
- npm run dev

Default: http://localhost:4000 (CORS allows http://localhost:8080)

Endpoints
- GET /api/health
- GET /api/conversations?wa_id=YOUR_NUMBER
- GET /api/conversations/:contact/messages?limit=50&page=1&wa_id=YOUR_NUMBER
- POST /api/conversations/:contact/messages { text, meta_msg_id? }
- PATCH /api/messages/:msg_id/status { status }
- POST /api/webhook/process { kind: 'message'|'status', data: {...} }

Headers
- Optional: x-api-key: <API_KEY>

Notes
- Schema matches the plan: unique msg_id, indexes for wa_id+timestamp and meta_msg_id.
- For conversation listing, wa_id is the owner (MY_NUMBER), and contact is the other party (from/to based on direction).
