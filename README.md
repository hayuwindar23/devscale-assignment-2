# Assignment 2 - AI Product with TypeScript Batch I

Produk AI sederhana untuk rekomendasi SMA/SMK di Provinsi DI Yogyakarta.

Flow assignment:

1. User mengirim input lewat API Hono.
2. Input divalidasi menggunakan Zod.
3. Data input disimpan ke PostgreSQL menggunakan Prisma.
4. Job dimasukkan ke BullMQ queue.
5. Worker mengambil job dari Redis.
6. AI menjalankan beberapa prompt:
   - analisis profil siswa,
   - rekomendasi sekolah,
   - evaluator kualitas hasil.
7. Hasil disimpan kembali ke database dan dibuat file Markdown di folder `outputs`.

## Tech Stack

- TypeScript
- Hono
- Zod
- Prisma
- PostgreSQL
- BullMQ
- Redis
- OpenAI API

## Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Buat file .env

```bash
cp .env.example .env
```

Isi `OPENAI_API_KEY` di `.env`.
Kalau belum punya API key, aplikasi tetap jalan dalam mode dummy.

### 3. Jalankan PostgreSQL dan Redis

```bash
docker compose up -d
```

Redis memakai port laptop `2323`, PostgreSQL memakai port `5432`.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Buat tabel database

```bash
npx prisma migrate dev --name init
```

### 6. Jalankan API

```bash
npm run dev:api
```

### 7. Jalankan worker

Buka terminal baru:

```bash
npm run dev:worker
```

## Contoh Request

PowerShell:

```powershell
curl -X POST http://localhost:3000/api/recommendations `
  -H "Content-Type: application/json" `
  -d '{"studentName":"Budi","score":84.5,"preferredMajor":"IPA","preferredLocation":"Sleman","schoolType":"SMA","notes":"Ingin sekolah yang peluangnya realistis"}'
```

CMD:

```cmd
curl -X POST http://localhost:3000/api/recommendations ^
  -H "Content-Type: application/json" ^
  -d "{\"studentName\":\"Budi\",\"score\":84.5,\"preferredMajor\":\"IPA\",\"preferredLocation\":\"Sleman\",\"schoolType\":\"SMA\",\"notes\":\"Ingin sekolah yang peluangnya realistis\"}"
```

Response awal:

```json
{
  "success": true,
  "message": "Input diterima. Job rekomendasi sekolah masuk queue.",
  "data": {
    "id": "job_id",
    "status": "PENDING"
  }
}
```

Cek hasil:

```bash
curl http://localhost:3000/api/recommendations/JOB_ID
```

## Endpoint

### GET /api/schools

Melihat dummy katalog sekolah.

### POST /api/recommendations

Membuat job rekomendasi sekolah.

Body:

```json
{
  "studentName": "Budi",
  "score": 84.5,
  "preferredMajor": "IPA",
  "preferredLocation": "Sleman",
  "schoolType": "SMA",
  "notes": "Ingin sekolah yang peluangnya realistis"
}
```

### GET /api/recommendations

Melihat daftar job.

### GET /api/recommendations/:id

Melihat detail hasil job.
