# CodeVector Product Catalog

A modern Next.js product catalog application backed by MongoDB. The app displays products from a cursor-based API, supports category filtering, and provides a responsive product grid with load-more pagination.

Hosted application: [https://codevector-task-eight.vercel.app/](https://codevector-task-eight.vercel.app/)

## Features

- Product listing page with responsive product cards
- Category dropdown filter
- Cursor-based pagination using `nextCursor`
- Load More button for incremental product loading
- Loading, empty, and error states
- MongoDB-backed `/api/products` endpoint
- Seed script for generating sample product data

## Prerequisites

- Node.js 20 or later recommended
- npm
- MongoDB database connection string

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd codevector-task
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the required MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Seed Product Data

To populate the database with sample products:

```bash
npm run seed
```

The seed script creates products across these categories:

```text
Electronics, Books, Clothing, Home, Toys, Sports, Beauty, Automotive, Garden, Health
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

If port `3000` is already in use, Next.js may start the app on another available port.

## Testing

Run the linter:

```bash
npm run lint
```

Verify the production build:

```bash
npm run build
```

You can also manually test the API locally after starting the dev server:

```bash
curl "http://localhost:3000/api/products?limit=12"
curl "http://localhost:3000/api/products?limit=12&category=Electronics"
```

## Build and Deployment

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

For Vercel deployment, configure `MONGODB_URI` in the Vercel project environment variables and deploy the Next.js app.

## API Testing

The products API can be tested using either the local development URL or the hosted application URL.

Hosted API examples:

```bash
curl "https://codevector-task-eight.vercel.app/api/products?limit=12"
curl "https://codevector-task-eight.vercel.app/api/products?limit=12&category=Books"
```

Cursor pagination example:

```bash
curl "https://codevector-task-eight.vercel.app/api/products?limit=12&cursorId=<cursorId>&cursorUpdatedAt=<cursorUpdatedAt>"
```

Category with cursor pagination:

```bash
curl "https://codevector-task-eight.vercel.app/api/products?limit=12&category=Electronics&cursorId=<cursorId>&cursorUpdatedAt=<cursorUpdatedAt>"
```

The API response includes:

- `products`: array of product records
- `hasMore`: whether more products are available
- `count`: number of products returned
- `nextCursor`: cursor object to request the next batch

## Available Scripts

```bash
npm run dev      # Start local development server
npm run seed     # Seed MongoDB with sample products
npm run lint     # Run ESLint
npm run build    # Build for production
npm run start    # Start production server
```
