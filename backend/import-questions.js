#!/usr/bin/env node
/**
 * Import questions.json into D1 database
 *
 * Usage:
 *   node backend/import-questions.js
 *
 * This generates SQL INSERT statements to import all 30 questions
 * from questions.json into the D1 questions table.
 */

const fs = require('fs')
const path = require('path')

// Read questions.json
const questionsPath = path.join(__dirname, '..', 'questions.json')
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))

console.log('-- Import questions.json into D1 database')
console.log('-- Generated on:', new Date().toISOString())
console.log('-- Total questions:', questions.length)
console.log('')

// Map questions to SQL INSERTs
questions.forEach((q) => {
  const id = q.id
  const difficultyScore = q.difficultyScore
  const text = q.text.replace(/'/g, "''") // Escape single quotes
  const options = JSON.stringify(q.options).replace(/'/g, "''")
  const correctAnswer = q.correctAnswer
  const explanation = q.explanation ? q.explanation.replace(/'/g, "''") : ''

  // Extract concept from question text (simplified)
  let concept = ''
  if (text.includes('stock')) concept = 'stocks'
  else if (text.includes('diversif')) concept = 'diversification'
  else if (text.includes('risk')) concept = 'risk-management'
  else if (text.includes('bond')) concept = 'bonds'
  else if (text.includes('P/E')) concept = 'valuation'
  else if (text.includes('dividend')) concept = 'dividends'
  else if (text.includes('ETF') || text.includes('fund')) concept = 'funds'
  else if (text.includes('interest')) concept = 'interest'
  else if (text.includes('inflation')) concept = 'inflation'
  else if (text.includes('portfolio')) concept = 'portfolio-theory'
  else if (text.includes('market cap')) concept = 'market-metrics'
  else if (text.includes('dollar-cost')) concept = 'investment-strategies'
  else if (text.includes('beta') || text.includes('alpha')) concept = 'risk-metrics'
  else concept = 'investing-basics'

  // Topics (can be multiple)
  const topics = [concept]
  if (difficultyScore === 1) topics.push('basics')
  else if (difficultyScore === 3) topics.push('advanced-concepts')

  const topicsJson = JSON.stringify(topics).replace(/'/g, "''")

  console.log(`INSERT INTO questions (id, difficulty_score, text, options, correct_answer, explanation, topics, concept) VALUES`)
  console.log(`  ('${id}', ${difficultyScore}, '${text}', '${options}', '${correctAnswer}', '${explanation}', '${topicsJson}', '${concept}');`)
  console.log('')
})

console.log('-- ✅ Generated', questions.length, 'INSERT statements')
console.log('-- Run this with: wrangler d1 execute investiq --remote --file=backend/questions-import.sql')
