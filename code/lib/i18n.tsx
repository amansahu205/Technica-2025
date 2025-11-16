'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'es'

interface Translations {
  [key: string]: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Login Page
    'login.badge': 'AI Investing Coach',
    'login.heading': 'Understand investing, one lesson at a time.',
    'login.description': 'Learn at your own pace with personalized lessons, interactive simulations, and AI-powered insights.',
    'login.benefit1': 'Personalized learning path based on your level',
    'login.benefit2': 'Interactive portfolio simulator with real-time feedback',
    'login.benefit3': 'Plain-English explanations of complex market news',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.continue': 'Continue to dashboard',
    'login.guest': 'Continue as guest',
    'login.signup': 'Create a learning profile',
    
    // Signup
    'signup.title': 'Create Your Learning Profile',
    'signup.step': 'Step',
    'signup.of': 'of',
    'signup.step1.title': 'What should we call you?',
    'signup.step1.placeholder': 'Enter your name or nickname',
    'signup.step2.title': 'Where are you located?',
    'signup.step2.placeholder': 'Select your region',
    'signup.step3.title': 'How familiar are you with investing?',
    'signup.step3.option1': "I'm just starting",
    'signup.step3.option2': 'I know a little',
    'signup.step3.option3': "I've invested before",
    'signup.step4.title': 'How do you prefer to learn?',
    'signup.step4.option1': 'Short explanations',
    'signup.step4.option2': 'Visual breakdowns',
    'signup.step4.option3': 'Step-by-step guidance',
    'signup.step4.option4': 'Audio explanations',
    'signup.step5.title': 'Do you have any accessibility or comfort preferences?',
    'signup.step5.subtitle': 'Optional - helps us personalize your experience',
    'signup.step5.option1': 'Larger text sizes',
    'signup.step5.option2': 'High contrast mode',
    'signup.step5.option3': 'Screen-reader friendly layout',
    'signup.step5.option4': 'Audio-first explanations',
    'signup.step5.option5': 'Reduced animations',
    'signup.step5.option6': 'Minimal visuals',
    'signup.back': 'Back',
    'signup.next': 'Next',
    'signup.skip': 'Skip for now',
    'signup.complete': 'Complete Setup',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.level': 'Your Current Level',
    'dashboard.nextLesson': 'Next Up: Understanding Bonds',
    'dashboard.nextLesson.cta': 'Continue Learning',
    'dashboard.simulator': 'Try a Simulation',
    'dashboard.simulator.desc': 'Build a practice portfolio',
    'dashboard.insight': 'New Market Insight',
    'dashboard.insight.desc': 'Fed announces rate decision',
    
    // Assessment
    'assessment.title': 'Smart Assessment',
    'assessment.subtitle': 'Answer 10 questions to determine your level',
    'assessment.question': 'Question',
    'assessment.of': 'of',
    'assessment.back': 'Back',
    'assessment.skip': 'Skip',
    'assessment.next': 'Next',
    'assessment.finish': 'See Results',
    
    // Navigation
    'nav.home': 'Home',
    'nav.cockpit': 'Cockpit',
    'nav.dashboard': 'Dashboard',
    'nav.learn': 'Learn',
    'nav.simulator': 'Simulator',
    'nav.insights': 'Market Insights',
    'nav.settings': 'Settings',
    
    // Learn
    'learn.title': 'Your Learning Path',
    'learn.eli5': 'ELI5',
    'learn.beginner': 'Beginner',
    'learn.advanced': 'Advanced',
    'learn.day': 'Day',
    'learn.duration': 'min',
    'learn.completed': 'Completed',
    'learn.inProgress': 'In Progress',
    'learn.locked': 'Locked',
    'learn.quiz': 'Quick Quiz',
    'learn.submit': 'Submit & Continue',
    
    // Simulator
    'simulator.title': 'Interactive Portfolio Simulator',
    'simulator.subtitle': 'Experiment with different asset allocations',
    'simulator.stocks': 'Stocks',
    'simulator.bonds': 'Bonds',
    'simulator.cash': 'Cash',
    'simulator.allocation': 'Asset Allocation',
    'simulator.expectedReturn': 'Expected Return',
    'simulator.riskLevel': 'Risk Level',
    'simulator.run': 'Run Simulation',
    'simulator.reset': 'Reset',
    'simulator.high': 'High',
    'simulator.medium': 'Medium',
    'simulator.low': 'Low',
    'simulator.analysis': 'AI Analysis',
    'simulator.projection': 'Year Growth Projection',
    
    // Insights
    'insights.title': 'Market News Interpreter',
    'insights.subtitle': 'Get plain-English explanations of market news',
    'insights.enterNews': 'Enter News',
    'insights.placeholder': 'Paste a market headline or news snippet here...',
    'insights.explain': 'Explain This',
    'insights.analyzing': 'Analyzing...',
    'insights.tryExamples': 'Try These Examples',
    'insights.whatHappened': 'What Happened',
    'insights.whyMatters': 'Why It Matters',
    'insights.impact': 'Impact on Your Investments',
    'insights.consider': 'What You Should Consider',
    'insights.relatedConcepts': 'Related Concepts to Learn',
    'insights.didUnderstand': 'Did You Understand?',
  },
  es: {
    // Login Page
    'login.badge': 'Entrenador de Inversión IA',
    'login.heading': 'Entiende la inversión, una lección a la vez.',
    'login.description': 'Aprende a tu propio ritmo con lecciones personalizadas, simulaciones interactivas e insights impulsados por IA.',
    'login.benefit1': 'Ruta de aprendizaje personalizada según tu nivel',
    'login.benefit2': 'Simulador de cartera interactivo con retroalimentación en tiempo real',
    'login.benefit3': 'Explicaciones en lenguaje sencillo de noticias de mercado complejas',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.remember': 'Recuérdame',
    'login.continue': 'Continuar al panel',
    'login.guest': 'Continuar como invitado',
    'login.signup': 'Crear un perfil de aprendizaje',
    
    // Signup
    'signup.title': 'Crea Tu Perfil de Aprendizaje',
    'signup.step': 'Paso',
    'signup.of': 'de',
    'signup.step1.title': '¿Cómo deberíamos llamarte?',
    'signup.step1.placeholder': 'Ingresa tu nombre o apodo',
    'signup.step2.title': '¿Dónde estás ubicado?',
    'signup.step2.placeholder': 'Selecciona tu región',
    'signup.step3.title': '¿Qué tan familiarizado estás con las inversiones?',
    'signup.step3.option1': 'Estoy comenzando',
    'signup.step3.option2': 'Sé un poco',
    'signup.step3.option3': 'He invertido antes',
    'signup.step4.title': '¿Cómo prefieres aprender?',
    'signup.step4.option1': 'Explicaciones cortas',
    'signup.step4.option2': 'Desgloses visuales',
    'signup.step4.option3': 'Guía paso a paso',
    'signup.step4.option4': 'Explicaciones de audio',
    'signup.step5.title': '¿Tienes alguna preferencia de accesibilidad o comodidad?',
    'signup.step5.subtitle': 'Opcional - nos ayuda a personalizar tu experiencia',
    'signup.step5.option1': 'Tamaños de texto más grandes',
    'signup.step5.option2': 'Modo de alto contraste',
    'signup.step5.option3': 'Diseño amigable para lectores de pantalla',
    'signup.step5.option4': 'Explicaciones con audio primero',
    'signup.step5.option5': 'Animaciones reducidas',
    'signup.step5.option6': 'Visuales mínimos',
    'signup.back': 'Atrás',
    'signup.next': 'Siguiente',
    'signup.skip': 'Saltar por ahora',
    'signup.complete': 'Completar Configuración',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.level': 'Tu Nivel Actual',
    'dashboard.nextLesson': 'Próximo: Entendiendo los Bonos',
    'dashboard.nextLesson.cta': 'Continuar Aprendiendo',
    'dashboard.simulator': 'Probar una Simulación',
    'dashboard.simulator.desc': 'Construye una cartera de práctica',
    'dashboard.insight': 'Nueva Información del Mercado',
    'dashboard.insight.desc': 'La Fed anuncia decisión de tasas',
    
    // Assessment
    'assessment.title': 'Evaluación Inteligente',
    'assessment.subtitle': 'Responde 10 preguntas para determinar tu nivel',
    'assessment.question': 'Pregunta',
    'assessment.of': 'de',
    'assessment.back': 'Atrás',
    'assessment.skip': 'Saltar',
    'assessment.next': 'Siguiente',
    'assessment.finish': 'Ver Resultados',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.cockpit': 'Cabina',
    'nav.dashboard': 'Panel',
    'nav.learn': 'Aprender',
    'nav.simulator': 'Simulador',
    'nav.insights': 'Información del Mercado',
    'nav.settings': 'Configuración',
    
    // Learn
    'learn.title': 'Tu Ruta de Aprendizaje',
    'learn.eli5': 'Muy Simple',
    'learn.beginner': 'Principiante',
    'learn.advanced': 'Avanzado',
    'learn.day': 'Día',
    'learn.duration': 'min',
    'learn.completed': 'Completado',
    'learn.inProgress': 'En Progreso',
    'learn.locked': 'Bloqueado',
    'learn.quiz': 'Quiz Rápido',
    'learn.submit': 'Enviar y Continuar',
    
    // Simulator
    'simulator.title': 'Simulador de Cartera Interactivo',
    'simulator.subtitle': 'Experimenta con diferentes asignaciones de activos',
    'simulator.stocks': 'Acciones',
    'simulator.bonds': 'Bonos',
    'simulator.cash': 'Efectivo',
    'simulator.allocation': 'Asignación de Activos',
    'simulator.expectedReturn': 'Retorno Esperado',
    'simulator.riskLevel': 'Nivel de Riesgo',
    'simulator.run': 'Ejecutar Simulación',
    'simulator.reset': 'Reiniciar',
    'simulator.high': 'Alto',
    'simulator.medium': 'Medio',
    'simulator.low': 'Bajo',
    'simulator.analysis': 'Análisis IA',
    'simulator.projection': 'Proyección de Crecimiento de Años',
    
    // Insights
    'insights.title': 'Intérprete de Noticias del Mercado',
    'insights.subtitle': 'Obtén explicaciones en lenguaje sencillo de noticias del mercado',
    'insights.enterNews': 'Ingresa Noticias',
    'insights.placeholder': 'Pega un titular de mercado o fragmento de noticia aquí...',
    'insights.explain': 'Explicar Esto',
    'insights.analyzing': 'Analizando...',
    'insights.tryExamples': 'Prueba Estos Ejemplos',
    'insights.whatHappened': 'Qué Sucedió',
    'insights.whyMatters': 'Por Qué Importa',
    'insights.impact': 'Impacto en Tus Inversiones',
    'insights.consider': 'Qué Deberías Considerar',
    'insights.relatedConcepts': 'Conceptos Relacionados para Aprender',
    'insights.didUnderstand': '¿Entendiste?',
  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('language')
    if (stored === 'en' || stored === 'es') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
