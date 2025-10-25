Excellent — now we’ll shift focus from backend to **frontend use cases** 🔥

Below is a **detailed table** showing how each backend endpoint is used on the **frontend** —
which **page** calls it, what **UI element or event** triggers it, and what **response** is shown to the user.

---

## 🌐 Frontend Use of Backend Endpoints

| #      | Endpoint                 | Method | **Frontend Page**                | **Trigger / UI Action**                        | **Frontend Use Case**                                       | **Response Handling / UI Update**                                         |
| ------ | ------------------------ | ------ | -------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| **1**  | `/api/auth/register`     | `POST` | **Login / Signup Page**          | User fills signup form → clicks **“Register”** | Sends form data (name, email, password) to create account   | On success → redirect to *Login Page* + toast `"Registration successful"` |
| **2**  | `/api/auth/login`        | `POST` | **Login Page**                   | User enters credentials → clicks **“Login”**   | Authenticates user and fetches JWT token                    | Stores JWT in `localStorage`, redirects to *Peer Connection Page*         |
| **3**  | `/api/user/profile`      | `GET`  | **Dashboard (Top bar)**          | When Dashboard loads                           | Fetches current user details for header/profile             | Displays username, avatar, email on navbar/profile section                |
| **4**  | `/api/transfer/init`     | `POST` | **File Upload Page (Dashboard)** | User selects file → clicks **“Start Upload”**  | Initializes a transfer session, gets `transferId`           | Displays upload screen + begins chunked upload via socket                 |
| **5**  | `/api/transfer/chunk`    | `POST` | **File Upload Page**             | Called internally during upload (each chunk)   | Uploads chunks progressively with Socket.io or Axios stream | Updates progress bar in real-time using `"progress"` socket event         |
| **6**  | `/api/transfer/complete` | `POST` | **File Upload Page**             | After last chunk uploaded                      | Marks transfer complete and triggers integrity verification | Shows `"Upload Complete"` message and auto-navigates to Integrity Page    |
| **7**  | `/api/verify/:id`        | `GET`  | **Integrity Page**               | When user opens file verification              | Checks MD5/SHA checksum between sender & receiver           | Displays `"Integrity Verified ✅"` or `"Corrupted ❌"`                      |
| **8**  | `/api/logs`              | `GET`  | **Dashboard → History Tab**      | On page load / refresh logs                    | Fetches user’s past transfer sessions                       | Displays logs in a table with status (Success / Failed / In Progress)     |
| **9**  | `/api/settings/update`   | `PUT`  | **Settings Page**                | User updates preferences → clicks **Save**     | Saves settings like chunk size, retry count, bandwidth      | Updates local state + localStorage + shows `"Settings Saved"` toast       |
| **10** | `/api/devices`           | `GET`  | **Device Manager Page**          | On admin view / debug screen load              | Lists active peer socket connections                        | Displays connected peers with device IDs & connection latency             |

---

## 🔁 Frontend Flow Summary

1. **Authentication Flow**

   * User → `/api/auth/register` or `/api/auth/login`
   * On success → stores JWT → navigates to Peer Connection Page

2. **Peer Connection Flow**

   * Peer connects via **Socket.io** (not REST)
   * On successful socket pairing → navigates to **Dashboard**

3. **Transfer Flow**

   * File Upload Page uses:

     * `/api/transfer/init` → create session
     * `/api/transfer/chunk` → upload pieces
     * `/api/transfer/complete` → finalize
     * `/api/verify/:id` → integrity check after upload

4. **Monitoring & Management**

   * `/api/logs` → Show all user’s transfers
   * `/api/devices` → Show connected peers (admin/debug)
   * `/api/settings/update` → Save user preferences

---

## 💡 Example: File Upload Flow in Frontend

**Step 1:** User selects file → clicks Upload
→ `POST /api/transfer/init`
→ returns `{ transferId }`

**Step 2:**
Frontend splits file → sends chunks using `POST /api/transfer/chunk`
→ updates progress bar via Socket.io event `"progress"`

**Step 3:**
After last chunk → `POST /api/transfer/complete`
→ triggers integrity verification → `GET /api/verify/:id`
→ displays `"Transfer Successful ✅"`

---

Would you like me to give the **frontend API integration flow diagram** (showing page → API → response → UI update) next?
It’ll visually connect how each page interacts with these endpoints step-by-step.
