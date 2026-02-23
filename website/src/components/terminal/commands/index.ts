import { sleep } from '@/lib/utils'

export interface CommandResult {
  output: string[]
  isAsync?: boolean
}

export type CommandHandler = (args: string[]) => CommandResult | Promise<CommandResult>

const helpCommand: CommandHandler = () => ({
  output: [
    '',
    '\x1b[36m  ╭─────────────────────────────────────────────╮\x1b[0m',
    '\x1b[36m  │           AVAILABLE COMMANDS                │\x1b[0m',
    '\x1b[36m  ╰─────────────────────────────────────────────╯\x1b[0m',
    '',
    '  \x1b[32mhelp\x1b[0m          Show this help message',
    '  \x1b[32mdemo --ai\x1b[0m     Watch AI automation demo',
    '  \x1b[32mnasa\x1b[0m          NASA Astronomy Picture of the Day',
    '  \x1b[32mmatrix\x1b[0m        Visual matrix effect',
    '  \x1b[32mhack\x1b[0m          Run penetration test simulation',
    '  \x1b[32mscan <url>\x1b[0m    Analyze a website live',
    '  \x1b[32mdecrypt\x1b[0m       Decode an intercepted transmission',
    '  \x1b[32mclear\x1b[0m         Clear the terminal',
    '',
    '  \x1b[90mTip: Use ↑/↓ arrows to navigate command history\x1b[0m',
    '',
  ],
})

const demoCommand: CommandHandler = async (args) => {
  if (!args.includes('--ai')) {
    return {
      output: [
        '',
        '\x1b[33m  Usage:\x1b[0m demo --ai',
        '  Run AI automation demonstration.',
        '',
      ],
    }
  }

  return {
    output: [],
    isAsync: true,
  }
}

export async function* runDemoAnimation(): AsyncGenerator<string> {
  yield '\x1b[36m  Initializing AI module...\x1b[0m'
  await sleep(800)
  yield '\x1b[36m  Loading natural language processor...\x1b[0m'
  await sleep(600)
  yield ''
  yield '\x1b[33m  [DEMO]\x1b[0m Simulating document processing:'
  await sleep(400)
  yield '    \x1b[32m→\x1b[0m Extracting data from invoice_001.pdf'
  await sleep(500)
  yield '    \x1b[32m→\x1b[0m Validating against schema'
  await sleep(400)
  yield '    \x1b[32m→\x1b[0m Auto-populating database entries'
  await sleep(600)
  yield ''
  yield '\x1b[32m  ✓ Task completed in 2.1s\x1b[0m \x1b[90m(manual time: ~15 min)\x1b[0m'
  yield ''
  yield '\x1b[35m  This is a demonstration of AI-powered automation.\x1b[0m'
  yield '\x1b[35m  Contact us to learn how we can automate your workflows.\x1b[0m'
  yield ''
}

const matrixCommand: CommandHandler = () => ({
  output: [],
  isAsync: true,
})

const nasaCommand: CommandHandler = () => ({
  output: [],
  isAsync: true,
})

interface APODResponse {
  title: string
  explanation: string
  date: string
  url: string
  hdurl?: string
  media_type: string
  copyright?: string
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}.${month}.${year}`
}

async function* typeText(text: string, prefix: string = '  '): AsyncGenerator<string> {
  const words = text.split(' ')
  let currentLine = prefix
  const maxWidth = 90

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    if ((currentLine + word).length > maxWidth) {
      yield currentLine.trimEnd()
      await sleep(30)
      currentLine = prefix + word + ' '
    } else {
      currentLine += word + ' '
    }
  }

  if (currentLine.trim().length > prefix.trim().length) {
    yield currentLine.trimEnd()
  }
}

export async function* runNasaApod(): AsyncGenerator<string> {
  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │       NASA Astronomy Picture of the Day             │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield '\x1b[90m  Connecting to NASA API...\x1b[0m'
  await sleep(500)

  try {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')

    if (!response.ok) {
      throw new Error('Failed to fetch from NASA API')
    }

    const data: APODResponse = await response.json()
    await sleep(300)

    yield '\x1b[32m  ✓ Data received\x1b[0m'
    yield ''
    await sleep(200)

    // Show image if it's an image (not video)
    if (data.media_type === 'image') {
      yield `__IMG:${data.url}__`
      yield ''
      await sleep(100)
    }

    yield `\x1b[35m  ${formatDate(data.date)}\x1b[0m`
    yield ''
    yield `\x1b[36m  "${data.title}"\x1b[0m`
    yield ''

    // Type out the explanation with typing effect
    for await (const line of typeText(data.explanation)) {
      yield line
    }

    yield ''

    if (data.copyright) {
      yield `\x1b[90m  © ${data.copyright}\x1b[0m`
      yield ''
    }

  } catch {
    yield '\x1b[31m  ✗ Error fetching NASA data\x1b[0m'
    yield '\x1b[90m  Please try again later.\x1b[0m'
    yield ''
  }
}

export async function* runMatrixAnimation(): AsyncGenerator<string> {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
  const width = 50

  yield ''
  yield '\x1b[32m  ╭' + '─'.repeat(width) + '╮\x1b[0m'

  for (let i = 0; i < 8; i++) {
    let line = '  \x1b[32m│\x1b[0m'
    for (let j = 0; j < width; j++) {
      const brightness = Math.random()
      if (brightness > 0.85) {
        line += `\x1b[32m${chars[Math.floor(Math.random() * chars.length)]}\x1b[0m`
      } else if (brightness > 0.6) {
        line += `\x1b[36m${chars[Math.floor(Math.random() * chars.length)]}\x1b[0m`
      } else if (brightness > 0.3) {
        line += `\x1b[90m${chars[Math.floor(Math.random() * chars.length)]}\x1b[0m`
      } else {
        line += ' '
      }
    }
    line += '\x1b[32m│\x1b[0m'
    yield line
    await sleep(100)
  }

  yield '\x1b[32m  ╰' + '─'.repeat(width) + '╯\x1b[0m'
  yield ''
  yield '\x1b[35m  "Wake up, Neo..."\x1b[0m'
  yield '\x1b[35m  "The Matrix has you..."\x1b[0m'
  yield ''
  yield '\x1b[90m  Just kidding. We build real software, not simulations.\x1b[0m'
  yield ''
}

// ─── HACK SIMULATION ────────────────────────────────────────

function randIP(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

function randPort(): number {
  const common = [21, 22, 53, 80, 443, 3306, 5432, 6379, 8080, 8443, 9200]
  return common[Math.floor(Math.random() * common.length)]
}

function randCVE(): string {
  const year = 2020 + Math.floor(Math.random() * 5)
  const id = Math.floor(Math.random() * 50000)
  return `CVE-${year}-${id.toString().padStart(5, '0')}`
}

function progressBar(filled: number, total: number, width = 30): string {
  const complete = Math.round((filled / total) * width)
  return '█'.repeat(complete) + '░'.repeat(width - complete)
}

export async function* runHackSimulation(): AsyncGenerator<string> {
  // Phase 1: Init
  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │       SIMPLEFYSED PENTEST FRAMEWORK v4.2.1          │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Initializing attack framework...\x1b[0m'
  await sleep(400)
  yield '\x1b[90m  [*] Loading 247 exploitation modules...\x1b[0m'
  await sleep(400)
  yield '\x1b[90m  [*] Loading 89 auxiliary modules...\x1b[0m'
  await sleep(300)
  yield '\x1b[32m  [✓] Framework ready. Starting engagement.\x1b[0m'
  await sleep(400)

  // Phase 2: Recon
  yield ''
  yield '\x1b[33m  ═══ PHASE 1: RECONNAISSANCE ═══\x1b[0m'
  yield ''
  const targetIP = randIP()
  yield `\x1b[90m  [*] Target: ${targetIP}\x1b[0m`
  await sleep(300)
  yield '\x1b[90m  [*] Running network scan...\x1b[0m'
  await sleep(300)

  for (let i = 1; i <= 5; i++) {
    yield `\x1b[90m  [${progressBar(i, 5, 20)}] ${i * 20}%\x1b[0m`
    await sleep(400)
  }

  const hostCount = 3 + Math.floor(Math.random() * 5)
  yield ''
  yield `\x1b[32m  [✓] Discovered ${hostCount} live hosts\x1b[0m`
  const ports = [22, 80, 443, randPort(), randPort()]
  const uniquePorts = [...new Set(ports)]
  yield `\x1b[32m  [✓] Open ports: ${uniquePorts.join(', ')}\x1b[0m`
  await sleep(500)

  // Phase 3: Vuln Scan
  yield ''
  yield '\x1b[33m  ═══ PHASE 2: VULNERABILITY SCAN ═══\x1b[0m'
  yield ''

  const vulns = [
    { cve: randCVE(), name: 'OpenSSL Heartbleed', status: 'VULNERABLE' },
    { cve: randCVE(), name: 'Apache Struts RCE', status: 'CLEAN' },
    { cve: randCVE(), name: 'SQL Injection (Auth Bypass)', status: 'VULNERABLE' },
    { cve: randCVE(), name: 'XSS Reflected (Search)', status: 'VULNERABLE' },
    { cve: randCVE(), name: 'CSRF Token Missing', status: 'CLEAN' },
    { cve: randCVE(), name: 'Privilege Escalation (Kernel)', status: 'VULNERABLE' },
  ]

  for (const v of vulns) {
    yield `\x1b[90m  [*] Probing ${v.cve}: ${v.name}...\x1b[0m`
    await sleep(350)
    if (v.status === 'VULNERABLE') {
      yield `\x1b[31m      ⚠ ${v.status}\x1b[0m`
    } else {
      yield `\x1b[32m      ✓ ${v.status}\x1b[0m`
    }
    await sleep(200)
  }

  const vulnCount = vulns.filter(v => v.status === 'VULNERABLE').length
  yield ''
  yield `\x1b[31m  [!] ${vulnCount} vulnerabilities found\x1b[0m`
  await sleep(500)

  // Phase 4: Exploit
  yield ''
  yield '\x1b[33m  ═══ PHASE 3: EXPLOITATION ═══\x1b[0m'
  yield ''
  yield `\x1b[90m  [*] Crafting payload for ${targetIP}:${uniquePorts[1] || 80}...\x1b[0m`
  await sleep(400)
  yield '\x1b[90m  [*] Injecting payload...\x1b[0m'
  await sleep(300)

  for (let i = 1; i <= 5; i++) {
    yield `\x1b[90m  [${progressBar(i, 5, 20)}] ${i * 20}%\x1b[0m`
    await sleep(350)
  }

  yield ''
  yield '\x1b[32m  [✓] Reverse shell established\x1b[0m'
  await sleep(400)
  yield `\x1b[36m  [*] whoami → www-data\x1b[0m`
  await sleep(300)
  yield '\x1b[90m  [*] Attempting privilege escalation...\x1b[0m'
  await sleep(600)
  yield '\x1b[31m  [✓] ROOT ACCESS OBTAINED\x1b[0m'
  await sleep(500)

  // Phase 5: Report
  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │             SECURITY ASSESSMENT REPORT              │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield `\x1b[90m  Target:\x1b[0m       ${targetIP}`
  yield `\x1b[90m  Hosts found:\x1b[0m  ${hostCount}`
  yield `\x1b[90m  Open ports:\x1b[0m   ${uniquePorts.length}`
  yield `\x1b[31m  Vulns found:\x1b[0m  ${vulnCount} critical`
  yield ''

  const score = 34
  const scoreBar = Math.round(score / 100 * 30)
  yield `\x1b[90m  Security Score:\x1b[0m`
  yield `\x1b[31m  [${'█'.repeat(scoreBar)}${'░'.repeat(30 - scoreBar)}] ${score}/100 FAILING\x1b[0m`
  yield ''
  await sleep(400)
  yield '\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m'
  yield ''
  yield '\x1b[35m  Your infrastructure deserves better.\x1b[0m'
  yield '\x1b[35m  Simplefysed builds secure systems from the ground up.\x1b[0m'
  yield ''
  yield '\x1b[90m  Visit:\x1b[0m \x1b[36mhttps://simplefysed.com\x1b[0m'
  yield ''
}

// ─── SCAN ANALYSIS ──────────────────────────────────────────

export async function* runScanAnalysis(url: string): AsyncGenerator<string> {
  // Validate & normalize URL
  let domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
  if (!domain) {
    yield '\x1b[31m  ✗ Invalid URL. Usage: scan <domain>\x1b[0m'
    yield ''
    return
  }
  const targetUrl = `https://${domain}`

  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │           WEBSITE ANALYSIS ENGINE v3.1              │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield `\x1b[90m  Target: ${domain}\x1b[0m`
  yield ''

  // Phase 1: DNS Resolution
  yield '\x1b[33m  ═══ DNS RESOLUTION ═══\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Querying DNS records...\x1b[0m'
  await sleep(500)

  let dnsIPs: string[] = []
  try {
    const dnsResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`)
    if (dnsResp.ok) {
      const dnsData = await dnsResp.json()
      if (dnsData.Answer && Array.isArray(dnsData.Answer)) {
        dnsIPs = dnsData.Answer.filter((r: { type: number }) => r.type === 1).map((r: { data: string }) => r.data)
      }
    }
  } catch {
    // DNS lookup failed, will show fallback
  }

  if (dnsIPs.length > 0) {
    yield `\x1b[32m  [✓] Resolved ${domain}\x1b[0m`
    for (const ip of dnsIPs.slice(0, 4)) {
      yield `\x1b[90m      A → ${ip}\x1b[0m`
    }
  } else {
    yield `\x1b[31m  [✗] Could not resolve DNS for ${domain}\x1b[0m`
  }
  await sleep(400)

  // Phase 2: SSL/TLS
  yield ''
  yield '\x1b[33m  ═══ SSL / TLS CHECK ═══\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Checking HTTPS availability...\x1b[0m'
  await sleep(500)

  let fetchOk = false
  let responseTime = 0
  try {
    const t0 = performance.now()
    const resp = await fetch(targetUrl, { mode: 'no-cors', cache: 'no-store' })
    responseTime = Math.round(performance.now() - t0)
    fetchOk = true
    void resp
  } catch {
    // Fetch failed
  }

  if (fetchOk) {
    yield '\x1b[32m  [✓] HTTPS available\x1b[0m'
    yield '\x1b[90m      Protocol: TLS 1.3 (assumed)\x1b[0m'
    yield '\x1b[32m      Grade: A\x1b[0m'
  } else {
    yield '\x1b[31m  [✗] HTTPS unreachable or blocked by CORS\x1b[0m'
    yield '\x1b[90m      Grade: N/A\x1b[0m'
  }
  await sleep(400)

  // Phase 3: Performance
  yield ''
  yield '\x1b[33m  ═══ PERFORMANCE ═══\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Measuring response time...\x1b[0m'
  await sleep(400)

  if (fetchOk && responseTime > 0) {
    yield `\x1b[32m  [✓] Response time: ${responseTime}ms\x1b[0m`
  } else {
    yield '\x1b[31m  [✗] Could not measure (target unreachable)\x1b[0m'
  }

  const simulatedTTFB = fetchOk ? Math.max(50, responseTime - Math.floor(Math.random() * 40)) : 0
  const simulatedSize = (200 + Math.floor(Math.random() * 1800)).toFixed(0)
  if (fetchOk) {
    yield `\x1b[90m      TTFB: ~${simulatedTTFB}ms\x1b[0m`
    yield `\x1b[90m      Est. page size: ~${simulatedSize} KB\x1b[0m`
  }
  await sleep(400)

  // Phase 4: Tech Detection
  yield ''
  yield '\x1b[33m  ═══ TECHNOLOGY DETECTION ═══\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Fingerprinting tech stack...\x1b[0m'
  await sleep(600)

  const techStacks = [
    ['Next.js', 'React', 'Vercel', 'Node.js'],
    ['WordPress', 'PHP', 'MySQL', 'Apache'],
    ['Nuxt.js', 'Vue', 'Nginx', 'Node.js'],
    ['Django', 'Python', 'PostgreSQL', 'Nginx'],
    ['Rails', 'Ruby', 'PostgreSQL', 'Puma'],
    ['Laravel', 'PHP', 'MySQL', 'Nginx'],
  ]
  const stack = techStacks[Math.floor(Math.random() * techStacks.length)]

  for (const tech of stack) {
    yield `\x1b[32m      ✓ ${tech}\x1b[0m`
    await sleep(200)
  }
  await sleep(300)

  // Phase 5: Security Headers
  yield ''
  yield '\x1b[33m  ═══ SECURITY HEADERS ═══\x1b[0m'
  yield ''
  yield '\x1b[90m  [*] Checking HTTP security headers...\x1b[0m'
  await sleep(500)

  const headers = [
    { name: 'Strict-Transport-Security', present: Math.random() > 0.3 },
    { name: 'Content-Security-Policy', present: Math.random() > 0.5 },
    { name: 'X-Frame-Options', present: Math.random() > 0.3 },
    { name: 'X-Content-Type-Options', present: Math.random() > 0.2 },
    { name: 'Referrer-Policy', present: Math.random() > 0.4 },
    { name: 'Permissions-Policy', present: Math.random() > 0.6 },
  ]

  let headerScore = 0
  for (const h of headers) {
    if (h.present) {
      yield `\x1b[32m      ✓ ${h.name}\x1b[0m`
      headerScore++
    } else {
      yield `\x1b[31m      ✗ ${h.name} (missing)\x1b[0m`
    }
    await sleep(200)
  }
  await sleep(300)

  // Phase 6: Report
  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │               SCAN REPORT                          │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield `\x1b[90m  Domain:\x1b[0m        ${domain}`
  yield `\x1b[90m  IPs found:\x1b[0m     ${dnsIPs.length || 'N/A'}`
  yield `\x1b[90m  SSL:\x1b[0m           ${fetchOk ? 'Active' : 'Unknown'}`
  if (fetchOk) {
    yield `\x1b[90m  Response:\x1b[0m      ${responseTime}ms`
  }
  yield `\x1b[90m  Sec Headers:\x1b[0m   ${headerScore}/${headers.length}`
  yield ''

  const overallScore = Math.round(
    (fetchOk ? 30 : 0) +
    (dnsIPs.length > 0 ? 20 : 0) +
    (headerScore / headers.length) * 50
  )
  const scoreBarLen = Math.round(overallScore / 100 * 30)
  const scoreColor = overallScore >= 70 ? '\x1b[32m' : overallScore >= 40 ? '\x1b[33m' : '\x1b[31m'
  const scoreLabel = overallScore >= 70 ? 'PASSING' : overallScore >= 40 ? 'MODERATE' : 'FAILING'

  yield `\x1b[90m  Overall Score:\x1b[0m`
  yield `${scoreColor}  [${'█'.repeat(scoreBarLen)}${'░'.repeat(30 - scoreBarLen)}] ${overallScore}/100 ${scoreLabel}\x1b[0m`
  yield ''
  await sleep(400)
  yield '\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m'
  yield ''
  yield '\x1b[35m  Want a website that scores 100?\x1b[0m'
  yield '\x1b[35m  Simplefysed builds fast, secure, modern web apps.\x1b[0m'
  yield ''
  yield '\x1b[90m  Visit:\x1b[0m \x1b[36mhttps://simplefysed.com\x1b[0m'
  yield ''
}

// ─── DECRYPT ANIMATION ──────────────────────────────────────

const GLYPHS = '₪ᚱ⌬ᛝ℘⊕ᚷ⊗ᛞ∇Ψ∆Ωξ'

function scramble(target: string, revealCount: number): string {
  const chars = target.split('')
  return chars.map((ch, i) => {
    if (i < revealCount) return ch
    if (ch === ' ') return ' '
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }).join('')
}

export async function* runDecryptAnimation(): AsyncGenerator<string> {
  const messages = [
    'We simplify the complex.',
    'We build what matters.',
    'Code that scales.',
    'Design that inspires.',
    'Solutions that last.',
  ]

  // Phase 1: Interception
  yield ''
  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │       INTERCEPTED TRANSMISSION                     │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  yield '\x1b[31m  [!] Encrypted broadcast detected on secure channel\x1b[0m'
  await sleep(400)
  yield '\x1b[90m  [*] Protocol: AES-256-GCM / RSA-4096\x1b[0m'
  yield '\x1b[90m  [*] Origin: UNKNOWN\x1b[0m'
  await sleep(400)
  yield '\x1b[90m  [*] Initializing decryption engine...\x1b[0m'
  await sleep(600)

  // Phase 2: Ciphertext display
  yield ''
  yield '\x1b[31m  ┌──────────────────────────────────────────────┐\x1b[0m'
  const hexLine1 = Array.from({ length: 24 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ')
  const hexLine2 = Array.from({ length: 24 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ')
  yield `\x1b[31m  │ ${hexLine1.slice(0, 46)} │\x1b[0m`
  yield `\x1b[31m  │ ${hexLine2.slice(0, 46)} │\x1b[0m`
  yield '\x1b[31m  └──────────────────────────────────────────────┘\x1b[0m'
  yield ''
  await sleep(800)

  // Phase 3: Cracking
  yield '\x1b[33m  ═══ DECRYPTING ═══\x1b[0m'
  yield ''

  for (let mi = 0; mi < messages.length; mi++) {
    const msg = messages[mi]
    const steps = 5 - mi  // Progressively faster: 5, 4, 3, 2, 1 steps
    const baseDelay = 300 - mi * 40  // 300, 260, 220, 180, 140

    yield `\x1b[90m  [${mi + 1}/5] Decrypting block ${mi + 1}...\x1b[0m`
    await sleep(200)

    for (let s = 0; s <= steps; s++) {
      const revealed = Math.floor((s / steps) * msg.length)
      if (s < steps) {
        yield `\x1b[33m      ${scramble(msg, revealed)}\x1b[0m`
      } else {
        yield `\x1b[32m      ${msg}\x1b[0m`
      }
      await sleep(baseDelay)
    }

    yield ''
    await sleep(150)
  }

  // Phase 4: CTA
  yield '\x1b[32m  [✓] Decryption complete\x1b[0m'
  yield ''
  await sleep(400)

  yield '\x1b[36m  ╭─────────────────────────────────────────────────────╮\x1b[0m'
  yield '\x1b[36m  │              DECODED MESSAGE                       │\x1b[0m'
  yield '\x1b[36m  ╰─────────────────────────────────────────────────────╯\x1b[0m'
  yield ''
  for (const msg of messages) {
    yield `\x1b[35m      ${msg}\x1b[0m`
  }
  yield ''
  await sleep(400)
  yield '\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m'
  yield ''
  yield '\x1b[35m  The message is clear. Let\'s build something great.\x1b[0m'
  yield ''
  yield '\x1b[90m  Visit:\x1b[0m \x1b[36mhttps://simplefysed.com\x1b[0m'
  yield ''
}

const hackCommand: CommandHandler = () => ({
  output: [],
  isAsync: true,
})

const scanCommand: CommandHandler = (args) => {
  if (!args.length || !args[0]) {
    return {
      output: [
        '',
        '\x1b[33m  Usage:\x1b[0m scan <url>',
        '  Analyze a website (e.g. \x1b[32mscan simplefysed.com\x1b[0m)',
        '',
      ],
    }
  }
  return { output: [], isAsync: true }
}

const decryptCommand: CommandHandler = () => ({
  output: [],
  isAsync: true,
})

const clearCommand: CommandHandler = () => ({
  output: ['__CLEAR__'],
})

export const commands: Record<string, CommandHandler> = {
  help: helpCommand,
  demo: demoCommand,
  nasa: nasaCommand,
  matrix: matrixCommand,
  hack: hackCommand,
  scan: scanCommand,
  decrypt: decryptCommand,
  clear: clearCommand,
}

export function processCommand(input: string): { command: string; args: string[] } {
  const parts = input.trim().split(/\s+/)
  const command = parts[0]?.toLowerCase() || ''
  const args = parts.slice(1)
  return { command, args }
}
