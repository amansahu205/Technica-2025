import { NextRequest, NextResponse } from 'next/server'

// Same question bank as start route
const questionBank = [
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

// In-memory session storage (shared with start route)
const sessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, userAnswer } = await request.json()
    
    const session = sessions.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    // Find the question
    const question = questionBank.find(q => q.id === questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    
    // Check if answer is correct
    const isCorrect = userAnswer === question.correctAnswer
    
    // Calculate level change based on difficulty and correctness
    let levelChange = 0
    if (isCorrect) {
      levelChange = question.difficulty * 0.3 // +0.3 to +0.9
    } else {
      levelChange = question.difficulty * -0.2 // -0.2 to -0.6
    }
    
    // Update session
    session.currentLevel = Math.max(1.0, Math.min(3.0, session.currentLevel + levelChange))
    session.questionsAsked += 1
    session.answers.push({
      questionId,
      userAnswer,
      isCorrect,
      difficulty: question.difficulty
    })
    session.progression.push({
      questionNumber: session.questionsAsked,
      level: session.currentLevel,
      isCorrect,
      difficulty: question.difficulty
    })
    
    // Check if quiz is complete
    const quizComplete = session.questionsAsked >= 10
    
    if (quizComplete) {
      // Calculate final results
      const correctAnswers = session.answers.filter((a: any) => a.isCorrect).length
      const accuracy = Math.round((correctAnswers / session.answers.length) * 100)
      
      // Determine tier
      let finalTier = 'Beginner'
      if (session.currentLevel >= 2.3) finalTier = 'Advanced'
      else if (session.currentLevel >= 1.7) finalTier = 'Intermediate'
      
      // Calculate difficulty breakdown
      const difficultyBreakdown = {
        easy: { attempted: 0, correct: 0 },
        medium: { attempted: 0, correct: 0 },
        hard: { attempted: 0, correct: 0 }
      }
      
      session.answers.forEach((answer: any) => {
        const key = answer.difficulty === 1 ? 'easy' : answer.difficulty === 2 ? 'medium' : 'hard'
        difficultyBreakdown[key].attempted += 1
        if (answer.isCorrect) difficultyBreakdown[key].correct += 1
      })
      
      return NextResponse.json({
        quizComplete: true,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        levelChange,
        results: {
          finalScore: session.currentLevel,
          finalTier,
          totalQuestions: session.questionsAsked,
          correctAnswers,
          accuracy,
          progression: session.progression,
          difficultyBreakdown
        }
      })
    }
    
    // Select next question
    const askedQuestions = session.answers.map((a: any) => a.questionId)
    const nextQuestion = selectQuestion(session.currentLevel, askedQuestions)
    
    return NextResponse.json({
      quizComplete: false,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      levelChange,
      nextQuestion: {
        id: nextQuestion.id,
        question: nextQuestion.question,
        options: nextQuestion.options,
        difficulty: nextQuestion.difficulty
      },
      questionNumber: session.questionsAsked + 1,
      currentLevel: session.currentLevel
    })
  } catch (error) {
    console.error('[v0] Error processing answer:', error)
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 })
  }
}

function selectQuestion(currentLevel: number, askedQuestions: string[]) {
  let targetDifficulty = 2
  if (currentLevel < 1.7) targetDifficulty = 1
  else if (currentLevel > 2.3) targetDifficulty = 3
  
  const availableQuestions = questionBank.filter(q => 
    !askedQuestions.includes(q.id) && q.difficulty === targetDifficulty
  )
  
  if (availableQuestions.length === 0) {
    const adjacentQuestions = questionBank.filter(q => 
      !askedQuestions.includes(q.id) && Math.abs(q.difficulty - targetDifficulty) === 1
    )
    if (adjacentQuestions.length > 0) {
      return adjacentQuestions[Math.floor(Math.random() * adjacentQuestions.length)]
    }
    const anyQuestion = questionBank.filter(q => !askedQuestions.includes(q.id))
    return anyQuestion[Math.floor(Math.random() * anyQuestion.length)]
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
}
