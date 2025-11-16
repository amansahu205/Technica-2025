-- InvestIQ Beginner Curriculum - 3 Modules, 15 Lessons
-- Comprehensive seed data for the learning platform

-- ============================================
-- MODULE 1: INVESTMENT FUNDAMENTALS (Days 1-5)
-- ============================================

INSERT INTO lessons (id, day, module_number, module_title, module_description, title, description, duration_minutes, difficulty, topics, quiz_questions)
VALUES
(
  'lesson-1',
  1,
  1,
  'Investment Fundamentals',
  'Build a strong foundation in core investment concepts, understanding the difference between saving and investing, and learn how to make your money work for you.',
  'Investing vs. Saving: What''s the Difference?',
  'Learn the fundamental difference between saving and investing, when to use each strategy, and how investing can help you build long-term wealth. Discover why your savings account might not be enough to reach your financial goals.',
  15,
  'beginner',
  '["investing basics", "saving vs investing", "financial goals", "wealth building"]',
  5
),
(
  'lesson-2',
  2,
  1,
  'Investment Fundamentals',
  'Build a strong foundation in core investment concepts, understanding the difference between saving and investing, and learn how to make your money work for you.',
  'Understanding Asset Types: Stocks, Bonds & Real Estate',
  'Explore the three main asset classes available to investors. Learn how stocks represent ownership, bonds represent lending, and real estate offers tangible investment opportunities. Understand the unique characteristics and roles of each asset type.',
  20,
  'beginner',
  '["asset types", "stocks", "bonds", "real estate", "portfolio basics"]',
  6
),
(
  'lesson-3',
  3,
  1,
  'Investment Fundamentals',
  'Build a strong foundation in core investment concepts, understanding the difference between saving and investing, and learn how to make your money work for you.',
  'The Power of Compound Interest & Time Value of Money',
  'Discover why Albert Einstein called compound interest the "eighth wonder of the world." Learn how money grows exponentially over time, understand the time value of money concept, and see real examples of how starting early can dramatically increase your wealth.',
  18,
  'beginner',
  '["compound interest", "time value of money", "exponential growth", "long-term investing"]',
  5
),
(
  'lesson-4',
  4,
  1,
  'Investment Fundamentals',
  'Build a strong foundation in core investment concepts, understanding the difference between saving and investing, and learn how to make your money work for you.',
  'Inflation & Why Your Money Loses Value',
  'Understand how inflation erodes purchasing power over time. Learn why keeping all your money in cash can actually make you poorer, and discover how investing helps you stay ahead of inflation to preserve and grow your wealth.',
  15,
  'beginner',
  '["inflation", "purchasing power", "cash vs investing", "wealth preservation"]',
  4
),
(
  'lesson-5',
  5,
  1,
  'Investment Fundamentals',
  'Build a strong foundation in core investment concepts, understanding the difference between saving and investing, and learn how to make your money work for you.',
  'Risk vs. Reward: The Fundamental Trade-off',
  'Master the core principle of investing: understanding the relationship between risk and potential returns. Learn how to assess your risk tolerance, why higher returns come with higher risks, and how to find the right balance for your financial goals.',
  20,
  'beginner',
  '["risk and reward", "risk tolerance", "investment returns", "risk assessment"]',
  6
),

-- ============================================
-- MODULE 2: STOCK MARKETS & PORTFOLIO BASICS (Days 6-10)
-- ============================================

(
  'lesson-6',
  6,
  2,
  'Stock Markets & Portfolio Basics',
  'Dive into how stock markets work, learn to read key financial metrics, and discover the principles of building a balanced investment portfolio.',
  'How Stock Exchanges Work: From Buy Orders to Trades',
  'Demystify the stock market! Learn how exchanges like NYSE and NASDAQ facilitate trading, understand bid-ask spreads, discover the role of market makers, and see exactly what happens when you click "buy" on a stock.',
  18,
  'beginner',
  '["stock exchanges", "trading", "market mechanics", "bid-ask spread", "NYSE", "NASDAQ"]',
  5
),
(
  'lesson-7',
  7,
  2,
  'Stock Markets & Portfolio Basics',
  'Dive into how stock markets work, learn to read key financial metrics, and discover the principles of building a balanced investment portfolio.',
  'Reading Stock Information: Price, Volume & P/E Ratio',
  'Decode the numbers you see on stock quotes. Learn what stock price really means, why trading volume matters, understand the P/E ratio (Price-to-Earnings), and discover other key metrics that help you evaluate investment opportunities.',
  22,
  'beginner',
  '["stock quotes", "P/E ratio", "trading volume", "market cap", "stock valuation", "financial metrics"]',
  7
),
(
  'lesson-8',
  8,
  2,
  'Stock Markets & Portfolio Basics',
  'Dive into how stock markets work, learn to read key financial metrics, and discover the principles of building a balanced investment portfolio.',
  'Portfolio Construction: The 60/40 Rule & Asset Allocation',
  'Learn the classic portfolio strategy used by millions of investors. Understand the traditional 60% stocks / 40% bonds allocation, discover why diversification across asset types reduces risk, and learn how to adjust allocations based on your age and goals.',
  20,
  'beginner',
  '["portfolio construction", "asset allocation", "60/40 rule", "diversification", "balanced portfolio"]',
  6
),
(
  'lesson-9',
  9,
  2,
  'Stock Markets & Portfolio Basics',
  'Dive into how stock markets work, learn to read key financial metrics, and discover the principles of building a balanced investment portfolio.',
  'Index Funds vs. Individual Stocks: The Great Debate',
  'Compare two fundamentally different investment approaches. Understand what index funds are, why Warren Buffett recommends them, learn the pros and cons of stock picking, and discover which strategy might work best for beginners.',
  18,
  'beginner',
  '["index funds", "individual stocks", "passive investing", "active investing", "ETFs", "mutual funds"]',
  6
),
(
  'lesson-10',
  10,
  2,
  'Stock Markets & Portfolio Basics',
  'Dive into how stock markets work, learn to read key financial metrics, and discover the principles of building a balanced investment portfolio.',
  'Portfolio Rebalancing: Keeping Your Investments on Track',
  'Learn the essential maintenance task every investor needs to know. Understand why portfolios drift over time, discover when and how to rebalance, and see how this simple strategy can improve returns while managing risk.',
  16,
  'beginner',
  '["portfolio rebalancing", "portfolio maintenance", "asset allocation", "risk management"]',
  5
),

-- ============================================
-- MODULE 3: GETTING STARTED (Days 11-15)
-- ============================================

(
  'lesson-11',
  11,
  3,
  'Getting Started & Building Your First Portfolio',
  'Take action! Learn how to set investment goals, choose the right brokerage platform, avoid common mistakes, and build your first real investment portfolio.',
  'Setting Investment Goals & Creating Your Timeline',
  'Define clear, achievable investment goals. Learn the SMART goal framework for investing, understand different timelines (short-term vs. long-term), discover how to align your strategy with your life goals, and create your personalized investment plan.',
  18,
  'beginner',
  '["investment goals", "financial planning", "SMART goals", "timeline planning", "goal setting"]',
  5
),
(
  'lesson-12',
  12,
  3,
  'Getting Started & Building Your First Portfolio',
  'Take action! Learn how to set investment goals, choose the right brokerage platform, avoid common mistakes, and build your first real investment portfolio.',
  'Choosing a Brokerage Platform: Features & Fees',
  'Navigate the world of online brokers. Compare popular platforms like Robinhood, Fidelity, Vanguard, and Charles Schwab. Learn about trading fees, account minimums, research tools, and user interfaces to find the perfect platform for your needs.',
  20,
  'beginner',
  '["brokerage platforms", "online brokers", "trading fees", "account setup", "platform comparison"]',
  6
),
(
  'lesson-13',
  13,
  3,
  'Getting Started & Building Your First Portfolio',
  'Take action! Learn how to set investment goals, choose the right brokerage platform, avoid common mistakes, and build your first real investment portfolio.',
  'Account Types: 401(k), IRA, Roth IRA & Taxable Accounts',
  'Understand the different account types available to you. Learn the tax advantages of retirement accounts, discover the power of employer 401(k) matching, understand IRA contribution limits, and know when to use taxable brokerage accounts.',
  22,
  'beginner',
  '["401k", "IRA", "Roth IRA", "retirement accounts", "tax-advantaged investing", "account types"]',
  7
),
(
  'lesson-14',
  14,
  3,
  'Getting Started & Building Your First Portfolio',
  'Take action! Learn how to set investment goals, choose the right brokerage platform, avoid common mistakes, and build your first real investment portfolio.',
  'Avoiding Behavioral Pitfalls: Psychology of Investing',
  'Master the mental game of investing. Learn about common psychological traps like panic selling, FOMO (fear of missing out), overconfidence, and herd mentality. Discover strategies to stay disciplined and avoid costly emotional decisions.',
  20,
  'beginner',
  '["behavioral finance", "investing psychology", "emotional investing", "panic selling", "FOMO", "discipline"]',
  6
),
(
  'lesson-15',
  15,
  3,
  'Getting Started & Building Your First Portfolio',
  'Take action! Learn how to set investment goals, choose the right brokerage platform, avoid common mistakes, and build your first real investment portfolio.',
  'Building Your First Portfolio: Step-by-Step Action Plan',
  'Put everything together! Follow a practical, step-by-step guide to build your first investment portfolio. Learn dollar-cost averaging, understand how much to invest, see a real example portfolio allocation, and get ready to start your investing journey today.',
  25,
  'beginner',
  '["first portfolio", "dollar-cost averaging", "portfolio building", "getting started", "action plan", "beginner strategy"]',
  8
);
