-- Seed data for InvestIQ
-- Initial lessons for the learning platform

INSERT INTO lessons (id, day, title, description, duration_minutes, difficulty, topics, quiz_questions) VALUES
  ('lesson-1', 1, 'Introduction to Investing', 'Learn the fundamental concepts of investing and why it matters for your financial future', 15, 'beginner', '["basics", "stocks", "bonds", "financial-literacy"]', 3),
  ('lesson-2', 2, 'Stocks vs Bonds', 'Understand the key differences between stocks and bonds and when to use each', 20, 'beginner', '["stocks", "bonds", "asset-classes", "risk"]', 4),
  ('lesson-3', 3, 'Understanding Risk', 'Explore investment risk and learn strategies to manage it effectively', 18, 'beginner', '["risk", "diversification", "volatility"]', 5),
  ('lesson-4', 4, 'Portfolio Diversification', 'Learn how to spread investments across different assets to reduce risk', 22, 'intermediate', '["diversification", "portfolio", "asset-allocation"]', 4),
  ('lesson-5', 5, 'Market Indices Explained', 'What are market indices like S&P 500 and Dow Jones, and how they work', 16, 'beginner', '["indices", "market", "benchmarks"]', 3),
  ('lesson-6', 6, 'Dividend Investing', 'How companies share profits with shareholders through dividends', 19, 'intermediate', '["dividends", "income", "passive-income"]', 4),
  ('lesson-7', 7, 'Understanding P/E Ratios', 'Learn to evaluate if a stock is overvalued or undervalued', 17, 'intermediate', '["valuation", "metrics", "fundamental-analysis"]', 3),
  ('lesson-8', 8, 'Dollar Cost Averaging', 'A simple strategy to invest consistently over time', 14, 'beginner', '["strategy", "timing", "long-term"]', 3),
  ('lesson-9', 9, 'ETFs vs Mutual Funds', 'Compare two popular investment vehicles and their pros and cons', 21, 'intermediate', '["etf", "mutual-funds", "funds"]', 5),
  ('lesson-10', 10, 'Tax-Advantaged Accounts', 'Maximize your returns using IRAs, 401(k)s, and other tax-smart accounts', 23, 'intermediate', '["taxes", "retirement", "401k", "ira"]', 4);
