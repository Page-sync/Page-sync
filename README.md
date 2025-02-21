# Page-Sync

A platform that enables users to search books by ISBN, access notes by page annotations, take notes, and engage in meaningful discussions. The platform brings together students, professionals, and experts to share insights and perspectives across different fields.

## Features

- ISBN-based book search
- Online PDF reader
- Make notes based on page annotations in PDF file

## Installation

Clone the repository

```bash
git clone https://github.com/Page-sync/Page-sync.git
```

Install dependencies

```bash
cd server
npm run build
cd ../client
npm install
```

## Run Locally

Run server

Go to the project directory

```bash
cd server/
```

Start server

```bash
npm run start
```

Go to frontend folder

```bash
cd ../client
```

Start vite

```bash
  npm run dev
```

Open http://localhost:5173/

## Acknowledgements

- [Google books api](https://www.googleapis.com/books/v1/volumes)
- [Internet Archive](https://archive.org/developers/index-apis.html)
