# Dexcelerate Scanner - React Token Tables Component

## Project Overview

A high-performance React app that shows real-time crypto token data in two side-by-side tables with infinite scrolling. Think of it like a live dashboard for tracking trending and new tokens across different blockchains, with data that updates in real-time via WebSocket connections. Perfect for anyone who wants to keep an eye on the crypto market without refreshing their browser every 5 seconds.

## Issues
### Known Problems & Limitations

Here's what's currently broken or missing

#### Data Type Issues
- **priceUsd field**: The API returns `priceUsd` as a number, but it should be a string for proper precision handling. This can cause weird floating-point math issues when dealing with crypto prices.

#### Sorting Woes
- **Limited sorting**: While we have `rankBy` and `orderBy` params in the API, you can't actually sort by Token name or Exchange in the UI. The table headers for these columns are marked as `sortKey: null` with TODO comments. So you're stuck with the default API ordering for now.

#### Missing Market Cap Filter
- **No market cap filtering**: The API docs don't include market cap info in the filter params, so you can't set min/max market cap thresholds. You'll see the market cap data in the results, but can't filter by it.

#### WebSocket Event Issues
- **scanner-pairs event**: Sometimes the WebSocket connection doesn't receive the `scanner-pairs` event properly. This means real-time updates for new token pairs might not work consistently. The event handler is there in the code, but the connection seems flaky.

### 🔧 What We're Working On
- Fixing the priceUsd type mismatch
- Adding proper sorting for Token and Exchange columns  
- Implementing market cap filtering (once the API supports it)
- Making the WebSocket connection more reliable

## Directory Structure

```
dexcelerate-frontend-test-task/
├── public/                 # Static assets and favicon
├── src/                    # Main source code
│   ├── assets/            # Images and static files
│   ├── components/        # React components
│   │   └── tokenTable/    # All the table-related components
│   ├── hooks/             # Custom React hooks for data management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite build config
```

## Setup & Installation

### What You Need

- Node.js 18+ 
- npm or yarn (whatever you prefer)

### Getting Started

1. **Clone the repo**
   ```bash
   git clone <repository-url>
   cd dexcelerate-frontend-test-task
   ```

2. **Install stuff**
   ```bash
   npm install
   ```

3. **Start coding**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview your build**
   ```bash
   npm run preview
   ```

## Development Approach

### How This Is built

The app follows a clean, modular structure that's easy to work with:

- **Components**: Reusable UI pieces that do one thing well
- **Hooks**: Custom logic for managing data and state
- **Types**: Full TypeScript coverage so you know exactly what you're working with
- **Utils**: Pure functions for processing data and calculations
- **Styling**: Utilizing Tailwind to avoid custom styles
- **Coloring**: Generated color palette from the original Dexcelerate website

### Performance Tricks

- **Virtual Scrolling**: Only renders what you can see, so scrolling through thousands of tokens feels smooth
- **Smart Updates**: WebSocket updates with minimal re-renders

### Math That Actually Works

- **BigNumber.js**: No more floating-point weirdness in your crypto calculations
- **Market Cap**: Proper handling of those big numbers and percentage changes

## Usage

### Starting Up

1. Fire up the dev server:
   ```bash
   npm run dev
   ```

2. Open your browser to the local URL (usually `http://localhost:5173`)

3. The app automatically connects to Dexcelerate's API and WebSocket services

### What You Can Do

#### Table Navigation
- **Switch Views**: Toggle between "Trending Tokens" and "New Tokens"
- **Pick Your Chain**: Filter by blockchain (ETH, SOL, BASE, BSC)
- **Sort Stuff**: Click any column header to sort

#### Filtering
- **Volume Filter**: Set minimum volume thresholds
- **Age Filter**: Filter tokens by when they were created
- **Market Cap Filter**: Set minimum market cap
- **No Honeypots**: Toggle to avoid sketchy tokens

#### Real-time Goodness
- **Live Prices**: Token prices update in real-time
- **Audit Updates**: Contract verification and security status
- **Transaction Counts**: Buy/sell counts update live

### API Integration

The app connects to Dexcelerate's API:
- **Base URL**: `https://api-rs.dexcelerate.com`
- **WebSocket**: `wss://api-rs.dexcelerate.com/ws`
- **Scanner Endpoint**: `GET /scanner` for initial token data
- **Real-time Events**: WebSocket subscriptions for live updates