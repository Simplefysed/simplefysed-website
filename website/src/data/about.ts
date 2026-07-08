export interface AboutQuestion {
  question: string
  answer: string
}

// Answers follow the house FAQ shape: verdict first, mechanism second,
// number third. Written to be forwardable inside a buying committee.
export const aboutQuestions: AboutQuestion[] = [
  {
    question: 'Who actually does the work?',
    answer:
      'Vin, with a small team behind him. The founder is your single point of contact and stays in your codebase from kickoff to handover, while two to three specialists carry workstreams behind the scenes. Nothing is resold, and nothing is handed off to a junior team once the contract is signed. The person who scoped your project is the person accountable for shipping it.',
  },
  {
    question: 'What does an engagement cost?',
    answer:
      'A fixed price on a fixed scope. Every project runs through one of three productized solutions, so the first call ends with a recommendation, a plan, and a price. No hourly guesswork and no surprise invoices. If we also host and run the system for you, that part is a flat monthly retainer. And if the audit shows the numbers will not pay for themselves, we say so and stop there.',
  },
  {
    question: 'What happens when the AI gets it wrong?',
    answer:
      'A human sees it. Every agent we deploy runs logged, and every exception escalates to a person instead of failing silently. Across our client base, 3,876 tasks a month run under that rule. The machines carry the recurring work; the judgment stays with your team.',
  },
  {
    question: 'Where does our data live?',
    answer:
      'Wherever the law and your policies require, which for most of our clients means the EU. We are a German company and build to German standards by default: GDPR compliance, double opt-in, access scoped to only the systems we touch, and data processing agreements handled at setup, not as an afterthought.',
  },
  {
    question: 'What happens if Simplefysed disappears tomorrow?',
    answer:
      'You lose a phone number, not a system. The code sits in your repository from day one, the infrastructure runs on your accounts, and every project ships with documentation written for the next engineer. Lock-in is a business model. It is not ours.',
  },
  {
    question: 'Can you work inside the systems we already run?',
    answer:
      'Yes, and it is often the recommendation. AI Augmentation, one of our three solutions, builds on top of your existing stack: add-ons, integrations, and embedded assistants. Zero systems replaced and zero new tools for your team to learn. Rebuilds are reserved for the cases where the audit proves nothing else will hold.',
  },
]
