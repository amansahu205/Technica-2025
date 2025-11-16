-- Import questions.json into D1 database
-- Generated on: 2025-11-16T08:56:26.328Z
-- Total questions: 30

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B1', 1, 'What is a stock?', '[{"key":"A","value":"A loan to a company"},{"key":"B","value":"Ownership in a company"},{"key":"C","value":"A type of government bond"},{"key":"D","value":"A guaranteed return investment"}]', 'B', 'A stock represents partial ownership in a company. If the company grows, your investment may grow.', '["stocks","basics"]', 'stocks');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B2', 1, 'What does “risk” mean in investing?', '[{"key":"A","value":"Guaranteed loss"},{"key":"B","value":"Chance of making a profit"},{"key":"C","value":"Possibility that returns may differ from expected"},{"key":"D","value":"A type of tax"}]', 'C', 'Risk is uncertainty. Returns might be higher or lower than expected — both outcomes are possible.', '["risk-management","basics"]', 'risk-management');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B3', 1, 'What is diversification?', '[{"key":"A","value":"Investing all money in one stock"},{"key":"B","value":"Spreading investments across different assets"},{"key":"C","value":"Keeping money only as cash"},{"key":"D","value":"Buying only gold"}]', 'B', 'Diversification reduces overall risk by not relying on a single investment.', '["diversification","basics"]', 'diversification');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B4', 1, 'Which asset is typically considered less risky?', '[{"key":"A","value":"Government bonds"},{"key":"B","value":"Small-cap stocks"},{"key":"C","value":"Cryptocurrencies"},{"key":"D","value":"Venture capital funds"}]', 'A', 'Government bonds have lower volatility and default risk compared to other assets.', '["risk-management","basics"]', 'risk-management');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B5', 1, 'What is a mutual fund?', '[{"key":"A","value":"A savings account"},{"key":"B","value":"A pool of investor money managed by professionals"},{"key":"C","value":"A type of loan"},{"key":"D","value":"A government subsidy"}]', 'B', 'Mutual funds allow small investors to own diversified portfolios with professional management.', '["funds","basics"]', 'funds');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B6', 1, 'What is compound interest?', '[{"key":"A","value":"Interest calculated only on the initial amount"},{"key":"B","value":"Interest earned on both principal and previous interest"},{"key":"C","value":"Penalty for delaying payments"},{"key":"D","value":"Interest charged by stock brokers"}]', 'B', 'Compound interest grows faster because you earn interest on past interest.', '["interest","basics"]', 'interest');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B7', 1, 'What happens when inflation rises?', '[{"key":"A","value":"Purchasing power decreases"},{"key":"B","value":"Asset values always increase"},{"key":"C","value":"Investment returns are guaranteed"},{"key":"D","value":"Stocks stop trading"}]', 'A', 'Higher inflation reduces the value of money over time.', '["inflation","basics"]', 'inflation');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B8', 1, 'What is an ETF (Exchange-Traded Fund)?', '[{"key":"A","value":"A loan from the government"},{"key":"B","value":"A fund that trades on an exchange like a stock"},{"key":"C","value":"A form of cryptocurrency"},{"key":"D","value":"A private company share"}]', 'B', 'ETFs combine diversification of mutual funds with the trading flexibility of stocks.', '["funds","basics"]', 'funds');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B9', 1, 'Why do people invest?', '[{"key":"A","value":"To avoid paying taxes"},{"key":"B","value":"To grow their money over time"},{"key":"C","value":"To guarantee profits"},{"key":"D","value":"Because banks force them"}]', 'B', 'Investing helps people build wealth through growth, interest, or dividends.', '["investing-basics","basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('B10', 1, 'What is a dividend?', '[{"key":"A","value":"A fee paid to brokers"},{"key":"B","value":"A company’s share of profits paid to shareholders"},{"key":"C","value":"A guarantee of future returns"},{"key":"D","value":"A penalty for selling stocks"}]', 'B', 'Some companies distribute part of their earnings to investors through dividends.', '["dividends","basics"]', 'dividends');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I1', 2, 'Why do stock prices move up or down?', '[{"key":"A","value":"Random government changes"},{"key":"B","value":"Changes in supply and demand"},{"key":"C","value":"Because companies adjust prices"},{"key":"D","value":"Banks control it"}]', 'B', 'Stock prices fluctuate when investor demand rises or falls due to news, earnings, and expectations.', '["stocks"]', 'stocks');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I2', 2, 'What does the P/E ratio indicate?', '[{"key":"A","value":"A company’s debt level"},{"key":"B","value":"How expensive a stock is relative to its earnings"},{"key":"C","value":"Dividend payout"},{"key":"D","value":"Interest rate risk"}]', 'B', 'A higher P/E suggests investors expect future growth; a low P/E may indicate undervaluation.', '["valuation"]', 'valuation');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I3', 2, 'What happens to markets when interest rates rise?', '[{"key":"A","value":"Stock prices typically fall"},{"key":"B","value":"Stock prices always rise"},{"key":"C","value":"Bond prices rise"},{"key":"D","value":"Nothing changes"}]', 'A', 'Higher interest rates increase borrowing costs, reducing company profits and lowering stock valuations.', '["interest"]', 'interest');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I4', 2, 'What is dollar-cost averaging?', '[{"key":"A","value":"Buying stocks only during market crashes"},{"key":"B","value":"Investing a fixed amount regularly, regardless of price"},{"key":"C","value":"Buying all shares at once"},{"key":"D","value":"Timing the market"}]', 'B', 'This strategy reduces the effect of volatility and avoids emotional decisions.', '["investment-strategies"]', 'investment-strategies');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I5', 2, 'What is market volatility?', '[{"key":"A","value":"Predictable price behavior"},{"key":"B","value":"A measure of how much prices fluctuate"},{"key":"C","value":"Guaranteed losses"},{"key":"D","value":"Government-controlled pricing"}]', 'B', 'High volatility means prices move rapidly; low volatility means more stable pricing.', '["investing-basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I6', 2, 'Index funds track:', '[{"key":"A","value":"Individual investor portfolios"},{"key":"B","value":"The performance of a market index like S&P 500"},{"key":"C","value":"Only government bonds"},{"key":"D","value":"Only technology companies"}]', 'B', 'Index funds passively replicate an index’s performance, offering low-cost diversification.', '["funds"]', 'funds');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I7', 2, 'A bear market refers to:', '[{"key":"A","value":"Rising stock prices"},{"key":"B","value":"Falling stock prices"},{"key":"C","value":"Stable markets"},{"key":"D","value":"Government-backed markets"}]', 'B', 'A bear market is a prolonged decline, typically defined as a 20% drop from recent highs.', '["investing-basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I8', 2, 'Which investment typically has the highest long-term returns?', '[{"key":"A","value":"Cash"},{"key":"B","value":"Bonds"},{"key":"C","value":"Stocks"},{"key":"D","value":"Certificates of deposit"}]', 'C', 'Historically, stocks outperform bonds and cash over long periods despite short-term volatility.', '["investing-basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I9', 2, 'What does “asset allocation” mean?', '[{"key":"A","value":"Trading stocks frequently"},{"key":"B","value":"Splitting investments among different asset classes"},{"key":"C","value":"Investing only in real estate"},{"key":"D","value":"Reducing investment expenses"}]', 'B', 'Proper allocation helps balance risk and return based on investor goals.', '["investing-basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('I10', 2, 'What is the role of a financial advisor?', '[{"key":"A","value":"Guarantee returns"},{"key":"B","value":"Help plan and manage investments based on goals and risk tolerance"},{"key":"C","value":"Control the market"},{"key":"D","value":"Approve stock trades"}]', 'B', 'Advisors provide guidance but cannot guarantee profits.', '["investing-basics"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A1', 3, 'According to Modern Portfolio Theory, an “efficient portfolio” is one that:', '[{"key":"A","value":"Eliminates all risk"},{"key":"B","value":"Maximizes returns for a given level of risk"},{"key":"C","value":"Avoids international markets"},{"key":"D","value":"Invests only in bonds"}]', 'B', 'Efficient portfolios lie on the efficient frontier, balancing optimal risk and return.', '["portfolio-theory","advanced-concepts"]', 'portfolio-theory');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A2', 3, 'What does ‘beta’ measure?', '[{"key":"A","value":"A stock’s total risk"},{"key":"B","value":"Systematic risk relative to the market"},{"key":"C","value":"A portfolio’s diversification"},{"key":"D","value":"A company’s profitability"}]', 'B', 'Beta shows sensitivity to market movements — key for expected return calculations in CAPM.', '["risk-metrics","advanced-concepts"]', 'risk-metrics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A3', 3, 'Alpha represents:', '[{"key":"A","value":"Market return"},{"key":"B","value":"Performance above or below a benchmark"},{"key":"C","value":"Total portfolio risk"},{"key":"D","value":"Interest rate sensitivity"}]', 'B', 'Positive alpha means the portfolio outperformed; negative alpha means underperformed.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A4', 3, 'The Sharpe Ratio measures:', '[{"key":"A","value":"Return per unit of total risk"},{"key":"B","value":"Only volatility"},{"key":"C","value":"Portfolio size"},{"key":"D","value":"Market timing efficiency"}]', 'A', 'Sharpe ratio = (Return – risk-free rate) ÷ volatility.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A5', 3, 'Yield curve inversion typically signals:', '[{"key":"A","value":"Strong economic growth"},{"key":"B","value":"Upcoming recession"},{"key":"C","value":"High inflation"},{"key":"D","value":"Low volatility"}]', 'B', 'Historically, inverted yield curves have preceded many recessions.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A6', 3, 'DCF valuation determines a company’s value by:', '[{"key":"A","value":"Adding total revenue"},{"key":"B","value":"Discounting future cash flows to present value"},{"key":"C","value":"Summing assets"},{"key":"D","value":"Comparing stock prices"}]', 'B', 'DCF uses future cash projections discounted by a company’s WACC.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A7', 3, 'What is the “efficient frontier”?', '[{"key":"A","value":"A set of portfolios with the lowest possible risk"},{"key":"B","value":"Portfolios offering the highest return for a given risk"},{"key":"C","value":"All possible market portfolios"},{"key":"D","value":"A set of uncorrelated assets"}]', 'B', 'Combines assets optimally to create the best risk-return combinations.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A8', 3, 'Which derivative gives the right, not the obligation, to buy an asset?', '[{"key":"A","value":"Put option"},{"key":"B","value":"Call option"},{"key":"C","value":"Swap"},{"key":"D","value":"Forward contract"}]', 'B', 'A call option lets investors buy the underlying asset at a set price before expiry.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A9', 3, 'What does WACC represent?', '[{"key":"A","value":"Company tax liabilities"},{"key":"B","value":"Average cost of debt and equity financing"},{"key":"C","value":"Total revenue"},{"key":"D","value":"Annual cash flow"}]', 'B', 'WACC acts as the discount rate for valuing cash flows.', '["investing-basics","advanced-concepts"]', 'investing-basics');

INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES
  ('A10', 3, 'In CAPM, expected return increases with:', '[{"key":"A","value":"Total risk"},{"key":"B","value":"Systematic risk (beta)"},{"key":"C","value":"Diversification"},{"key":"D","value":"Interest rates only"}]', 'B', 'CAPM says investors are rewarded only for market-related risk, not diversifiable risk.', '["investing-basics","advanced-concepts"]', 'investing-basics');

-- ✅ Generated 30 INSERT statements
-- Run this with: wrangler d1 execute investiq --remote --file=backend/questions-import.sql
