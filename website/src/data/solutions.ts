export interface SolutionMetric {
  value: string
  label: string
}

export interface SolutionExample {
  title: string
  situation: string
  built: string
  outcome: string
  visitUrl?: string // external product link, rendered as an ink "Visit" button
  moreHref?: string // internal link, rendered as a rust "More" button
}

export interface SolutionResult {
  statement: string // first half incl. trailing comma, ink: 'One custom solution,'
  accent: string // second half, rendered fully in rust: 'built to last.'
  metrics: SolutionMetric[]
}

export interface Solution {
  index: string
  slug: string
  title: string
  deck: string
  description: string
  ships: string[]
  bestFor: string
  why: string
  bestForList: string[]
  result: SolutionResult
  examples: SolutionExample[]
}

export const solutions: Solution[] = [
  {
    index: '01',
    slug: 'operations-engineering',
    title: 'Operations Engineering',
    deck: 'Business operations, optimized and then automated.',
    description:
      'We map how work actually moves through your company, cut what wastes time, and automate what remains. Standardized playbooks where they fit, individually engineered workflows where your business demands its own path.',
    ships: [
      'Operations audit & target design',
      'Standardized workflow automation',
      'Individually engineered processes',
      'AI agents for recurring work',
    ],
    bestFor: 'Teams scaling faster than their processes.',
    why: 'Most automation projects fail because they automate the mess instead of fixing it. We work in strict order. First the audit: we map every workflow, every handoff, every place work waits. Then the redesign: fewer steps, fewer tools, clear owners. Only then the automation, so the machine runs a process worth running.',
    bestForList: [
      'Teams scaling faster than their processes.',
      'Founders still running operations from their inbox.',
      'Work that lives in one person’s head.',
      'Hiring plans driven by manual workload.',
    ],
    result: {
      statement: 'Fewer bottlenecks,',
      accent: 'more throughput.',
      metrics: [
        { value: '19', label: 'Agents deployed' },
        { value: '3,876', label: 'Tasks / month' },
        { value: '~30', label: 'Hours saved / wk' },
      ],
    },
    examples: [
      {
        title: 'The inbox that answers itself',
        situation:
          'A French hotel evaluation firm handled every inquiry by hand. Reading emails, extracting details, filling Word templates. Hours per week, every week.',
        built:
          'An AI workflow that classifies each incoming inquiry, extracts the structured data, and generates the evaluation document from the firm’s own templates.',
        outcome:
          'Inquiries process themselves end to end. The team reviews finished documents instead of writing them.',
      },
      {
        title: 'Recurring work, reassigned',
        situation:
          'Reports compiled by hand every Monday. Data moved between tools by copy and paste. Follow-ups that depended on someone remembering.',
        built:
          'A fleet of AI agents, each owning one recurring job: compiling, syncing, chasing, filing. Every run logged, every exception escalated to a human.',
        outcome:
          'The work still happens every week. Nobody has to do it. Across our deployments, that is thousands of tasks a month running without a hand on the keyboard.',
      },
    ],
  },
  {
    index: '02',
    slug: 'product-engineering',
    title: 'Product Engineering',
    deck: 'Company-specific software no market solution offers.',
    description:
      'Vast, specific requirements break off-the-shelf tools. We architect and build systems shaped around your exact operation, one team carrying brand, UI/UX, landing page, and cross-platform delivery from first sketch to production.',
    ships: [
      'End-to-end custom systems',
      'Brand identity, UI/UX & landing pages',
      'Web, mobile & desktop from one codebase',
      'Architecture built to survive scale',
    ],
    bestFor: 'Requirements no vendor covers.',
    why: 'Off-the-shelf software is built for the average company. Yours is not average: the requirements that make it different are exactly where the value sits. So we design and build around them, not around a vendor’s roadmap. And because one team carries architecture, brand, and interface, every decision serves the same system.',
    bestForList: [
      'Requirements no vendor covers.',
      'Operations too specific for configurable tools.',
      'Products that need web, mobile, and desktop from day one.',
      'Systems expected to survive years of growth.',
    ],
    result: {
      statement: 'One custom solution,',
      accent: 'built to last.',
      metrics: [
        { value: '1', label: 'Codebase' },
        { value: '3', label: 'Platforms' },
        { value: '0', label: 'Rebuilds required' },
      ],
    },
    examples: [
      {
        title: 'From phone calls to a booking platform',
        situation:
          'A regional equipment rental business ran on phone and WhatsApp. Availability lived in memory. Every booking was a conversation.',
        built:
          'A full-stack rental platform with real-time availability, online booking, and automated confirmations. Brand, interface, and system from one team.',
        outcome:
          'Customers book around the clock, self-serve. The phone rings for exceptions, not for everything.',
        visitUrl: 'https://www.mietservice24.com/',
        moreHref: '/case-studies/mietservice24',
      },
      {
        title: 'The learning platform no vendor sells',
        situation:
          'A guided self-help program, paced week by week. No course platform on the market covered its requirements.',
        built:
          'A bespoke platform: member cockpit, admin studio, timed weekly unlocks, live cohort community, and integrated payments. Brand and interface designed with it.',
        outcome:
          'The entire program runs on one owned system, from first video to final payment.',
        visitUrl: 'https://bonduracura.de',
        moreHref: '/case-studies/bondura-cura',
      },
    ],
  },
  {
    index: '03',
    slug: 'ai-augmentation',
    title: 'AI Augmentation',
    deck: 'Your existing systems, extended and made intelligent.',
    description:
      'Not everything needs a rebuild. We develop add-ons, integrations, and embedded AI on top of the software you already run, so the tools your team trusts stay in place and their gaps disappear.',
    ships: [
      'Add-on & plugin development',
      'Embedded AI copilots & assistants',
      'API & system integrations',
      'Legacy modernization',
    ],
    bestFor: 'Stacks that work but could work smarter.',
    why: 'Replacing working software is expensive, risky, and usually unnecessary. Your team knows its tools. Your data lives where it lives. So we build on top: add-ons that close feature gaps, integrations that end the copy-paste, embedded AI that answers inside the software already open on your screens. The stack stays. The gaps go.',
    bestForList: [
      'Stacks that work but could work smarter.',
      'Teams moving data between tools by hand.',
      'Legacy systems too critical to replace.',
      'Feature requests your vendor will never ship.',
    ],
    result: {
      statement: 'Same stack,',
      accent: 'more intelligence.',
      metrics: [
        { value: '0', label: 'Systems replaced' },
        { value: '4', label: 'Augmentation paths' },
        { value: '0', label: 'New tools to learn' },
      ],
    },
    examples: [
      {
        title: 'A copilot inside the tools they trust',
        situation:
          'A sales team’s answers lived in three systems and one colleague’s memory. Every question meant searching, or interrupting.',
        built:
          'An embedded AI assistant inside the CRM the team already used. It reads the account, the history, and the internal docs, and answers where the work happens.',
        outcome:
          'Answers arrive in seconds, in context, in the tool already open. No new software. No migration.',
      },
      {
        title: 'Twenty years of data, finally connected',
        situation:
          'An aging core system held the company’s most valuable data, and none of the modern tools could reach it.',
        built:
          'A clean API layer over the legacy core, plus targeted add-ons for the workflows the original vendor never shipped.',
        outcome:
          'The old system keeps doing what it does well. Everything around it finally speaks to it. No rewrite, no migration, no downtime.',
      },
    ],
  },
]
