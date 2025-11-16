import { NextRequest, NextResponse } from 'next/server'

// Mock question bank with difficulty levels
const questionBank = [
  // Easy questions (difficulty 1)
  {
    id: 'q1',
    question: 'What is a stock?',
    options: ['A loan to a company', 'Ownership share in a company', 'A savings account', 'A government bond'],
    correctAnswer: 'Ownership share in a company',
    explanation: 'A stock represents partial ownership in a company. When you buy stock, you become a shareholder.',
    difficulty: 1
  },
  {
    id: 'q2',
    question: 'What does "bull market" mean?',
    options: ['Prices are falling', 'Prices are rising', 'Market is closed', 'High volatility'],
    correctAnswer: 'Prices are rising',
    explanation: 'A bull market is characterized by rising stock prices and investor optimism.',
    difficulty: 1
  },
  {
    id: 'q3',
    question: 'What is a dividend?',
    options: ['Stock price increase', 'Trading fee', 'Profit paid to shareholders', 'Type of loan'],
    correctAnswer: 'Profit paid to shareholders',
    explanation: 'Dividends are distributions of company profits to shareholders, typically paid quarterly.',
    difficulty: 1
  },
  // Medium questions (difficulty 2)
  {
    id: 'q4',
    question: 'What does P/E ratio measure?',
    options: ['Company debt levels', 'Stock price relative to earnings', 'Dividend yield', 'Trading volume'],
    correctAnswer: 'Stock price relative to earnings',
    explanation: 'P/E (Price-to-Earnings) ratio compares a company\'s stock price to its earnings per share.',
    difficulty: 2
  },
  {
    id: 'q5',
    question: 'What is dollar-cost averaging?',
    options: ['Selling at highest price', 'Investing fixed amounts regularly', 'Day trading', 'Buying cheap stocks'],
    correctAnswer: 'Investing fixed amounts regularly',
    explanation: 'Dollar-cost averaging involves investing a fixed amount at regular intervals, reducing timing risk.',
    difficulty: 2
  },
  {
    id: 'q6',
    question: 'What is a limit order?',
    options: ['Buy at any price', 'Buy at specific price or better', 'Sell after hours', 'Cancel all orders'],
    correctAnswer: 'Buy at specific price or better',
    explanation: 'A limit order specifies the maximum price you\'ll pay to buy or minimum you\'ll accept to sell.',
    difficulty: 2
  },
  // Hard questions (difficulty 3)
  {
    id: 'q7',
    question: 'What is the Sharpe ratio used for?',
    options: ['Measuring dividend yield', 'Risk-adjusted return', 'Market volatility', 'Trading volume'],
    correctAnswer: 'Risk-adjusted return',
    explanation: 'The Sharpe ratio measures risk-adjusted returns by comparing excess return to standard deviation.',
    difficulty: 3
  },
  {
    id: 'q8',
    question: 'What is a covered call strategy?',
    options: ['Buying calls without stock', 'Selling calls on owned stock', 'Buying puts', 'Short selling'],
    correctAnswer: 'Selling calls on owned stock',
    explanation: 'A covered call involves selling call options on stock you own to generate income.',
    difficulty: 3
  },
  {
    id: 'q9',
    question: 'What is beta in portfolio analysis?',
    options: ['Company profit margin', 'Volatility relative to market', 'Dividend rate', 'Trading frequency'],
    correctAnswer: 'Volatility relative to market',
    explanation: 'Beta measures how much a stock moves relative to the overall market. Beta > 1 means more volatile.',
    difficulty: 3
  },
  {
    id: 'q10',
    question: 'What is the purpose of rebalancing?',
    options: ['Maximize trades', 'Maintain target allocation', 'Avoid taxes', 'Increase risk'],
    correctAnswer: 'Maintain target allocation',
    explanation: 'Rebalancing adjusts portfolio weights back to target allocations, managing risk and maintaining strategy.',
    difficulty: 3
  }
]

// In-memory session storage (in production, use a database)
const sessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    // Generate session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Initialize session
    const session = {
      userId,
      currentLevel: 1.5,
      questionsAsked: 0,
      answers: [],
      progression: []
    }
    
    sessions.set(sessionId, session)
    
    // Select first question based on initial level (medium difficulty)
    const question = selectQuestion(session.currentLevel, [])
    
    return NextResponse.json({
      sessionId,
      question: {
        id: question.id,
        question: question.question,
        options: question.options,
        difficulty: question.difficulty
      },
      questionNumber: 1,
      currentLevel: session.currentLevel
    })
  } catch (error) {
    console.error('[v0] Error starting adaptive assessment:', error)
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }
}

function selectQuestion(currentLevel: number, askedQuestions: string[]) {
  // Select difficulty based on current level
  let targetDifficulty = 2
  if (currentLevel < 1.7) targetDifficulty = 1
  else if (currentLevel > 2.3) targetDifficulty = 3
  
  // Filter available questions
  const availableQuestions = questionBank.filter(q => 
    !askedQuestions.includes(q.id) && q.difficulty === targetDifficulty
  )
  
  // If no questions at target difficulty, try adjacent difficulties
  if (availableQuestions.length === 0) {
    const adjacentQuestions = questionBank.filter(q => 
      !askedQuestions.includes(q.id) && Math.abs(q.difficulty - targetDifficulty) === 1
    )
    if (adjacentQuestions.length > 0) {
      return adjacentQuestions[Math.floor(Math.random() * adjacentQuestions.length)]
    }
    // Last resort: any unasked question
    const anyQuestion = questionBank.filter(q => !askedQuestions.includes(q.id))
    return anyQuestion[Math.floor(Math.random() * anyQuestion.length)]
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
}
