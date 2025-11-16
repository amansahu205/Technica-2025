/**
 * Cloudflare Pages Function: Questions API
 *
 * GET /api/questions                    - Get random assessment questions
 * GET /api/questions?difficulty=1       - Filter by difficulty (1, 2, or 3)
 * GET /api/questions?count=10           - Limit number of questions
 */

interface Env {
  DB: D1Database
}

interface Question {
  id: string
  difficultyScore: number
  text: string
  options: Array<{ key: string; value: string }>
  correctAnswer?: string // Omitted in response for security
  explanation?: string // Omitted until answer submitted
}

// Import questions data (you'll need to make this available to the function)
// For now, we'll return a hardcoded subset
const SAMPLE_QUESTIONS = [
  {
    id: 'B1',
    difficultyScore: 1,
    text: 'What is a stock?',
    options: [
      { key: 'A', value: 'A loan to a company' },
      { key: 'B', value: 'Ownership in a company' },
      { key: 'C', value: 'A type of government bond' },
      { key: 'D', value: 'A guaranteed return investment' },
    ],
    correctAnswer: 'B',
    explanation:
      'A stock represents partial ownership in a company. If the company grows, your investment may grow.',
  },
  {
    id: 'B2',
    difficultyScore: 1,
    text: 'What does "risk" mean in investing?',
    options: [
      { key: 'A', value: 'Guaranteed loss' },
      { key: 'B', value: 'Chance of making a profit' },
      { key: 'C', value: 'Possibility that returns may differ from expected' },
      { key: 'D', value: 'A type of tax' },
    ],
    correctAnswer: 'C',
    explanation:
      'Risk is uncertainty. Returns might be higher or lower than expected — both outcomes are possible.',
  },
  {
    id: 'I1',
    difficultyScore: 2,
    text: 'Why do stock prices move up or down?',
    options: [
      { key: 'A', value: 'Random government changes' },
      { key: 'B', value: 'Changes in supply and demand' },
      { key: 'C', value: 'Because companies adjust prices' },
      { key: 'D', value: 'Banks control it' },
    ],
    correctAnswer: 'B',
    explanation:
      'Stock prices fluctuate when investor demand rises or falls due to news, earnings, and expectations.',
  },
  {
    id: 'A1',
    difficultyScore: 3,
    text: 'According to Modern Portfolio Theory, an "efficient portfolio" is one that:',
    options: [
      { key: 'A', value: 'Eliminates all risk' },
      { key: 'B', value: 'Maximizes returns for a given level of risk' },
      { key: 'C', value: 'Avoids international markets' },
      { key: 'D', value: 'Invests only in bonds' },
    ],
    correctAnswer: 'B',
    explanation:
      'Efficient portfolios lie on the efficient frontier, balancing optimal risk and return.',
  },
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { searchParams } = new URL(context.request.url)
  const difficulty = searchParams.get('difficulty')
  const count = parseInt(searchParams.get('count') || '10', 10)

  try {
    // TODO: Load from questions.json or D1 database
    // For now, using sample questions
    let questions = SAMPLE_QUESTIONS

    // Filter by difficulty if specified
    if (difficulty) {
      const difficultyNum = parseInt(difficulty, 10)
      questions = questions.filter((q) => q.difficultyScore === difficultyNum)
    }

    // Shuffle and limit
    questions = shuffleArray(questions).slice(0, count)

    // Remove correct answers and explanations from response
    const safeQuestions = questions.map(({ correctAnswer, explanation, ...q }) => q)

    return new Response(JSON.stringify(safeQuestions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Questions error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch questions' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
