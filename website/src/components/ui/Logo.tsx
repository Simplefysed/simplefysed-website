import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  size?: number
  className?: string
}

function CircuitS() {
  return (
    <>
      <path
        d="M8 8h12l-8 8h12"
        stroke="#00fff2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="8" cy="8" r="2" fill="#00fff2" />
      <circle cx="24" cy="24" r="2" fill="#00fff2" />
    </>
  )
}

function VelocityArrows() {
  return (
    <>
      <path d="M22 4L10 16h12" fill="#00fff2" />
      <path d="M10 28L22 16H10" fill="#8000ff" />
    </>
  )
}

function BracketS() {
  return (
    <>
      <path
        d="M20 4c-6 0-8 2-8 6s4 4 4 6-2 6-8 6"
        stroke="#00fff2"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 28c6 0 8-2 8-6s-4-4-4-6 2-6 8-6"
        stroke="#8000ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

function ConvergenceBars() {
  return (
    <>
      <rect x="4" y="6" width="18" height="3" rx="1.5" fill="#00fff2" />
      <rect x="9" y="14.5" width="14" height="3" rx="1.5" fill="#00fff2" opacity="0.7" />
      <rect x="14" y="23" width="14" height="3" rx="1.5" fill="#00fff2" opacity="0.4" />
    </>
  )
}

function NeuralS() {
  return (
    <>
      <path
        d="M8 6Q22 6 22 16Q22 26 8 26"
        stroke="#00fff2"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="8" cy="6" r="2.5" fill="#00fff2" />
      <circle cx="22" cy="16" r="2.5" fill="#8000ff" />
      <circle cx="8" cy="26" r="2.5" fill="#00fff2" />
    </>
  )
}

function SlashCut() {
  return (
    <>
      <rect width="32" height="32" rx="6" fill="#00fff2" />
      <path d="M0 20L20 0h12v12L12 32H0z" fill="#0a0a0f" />
    </>
  )
}

function InfinityFlow() {
  return (
    <path
      d="M16 3C8 3 5 8 5 12c0 4 4 5 11 5s11 1 11 5c0 4-3 7-11 7"
      stroke="#00fff2"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  )
}

function PixelGrid() {
  return (
    <>
      <rect x="6" y="3" width="20" height="4" rx="1" fill="#00fff2" />
      <rect x="6" y="3" width="6" height="13" rx="1" fill="#00fff2" />
      <rect x="6" y="14" width="20" height="4" rx="1" fill="#00fff2" />
      <rect x="20" y="16" width="6" height="13" rx="1" fill="#00fff2" />
      <rect x="6" y="25" width="20" height="4" rx="1" fill="#00fff2" />
    </>
  )
}

function SignalWave() {
  return (
    <>
      <path
        d="M24 4C24 4 8 8 8 16s16 12 16 12"
        stroke="#00fff2"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8 4C8 4 24 8 24 16S8 28 8 28"
        stroke="#8000ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </>
  )
}

function ModularStack() {
  return (
    <>
      <rect x="6" y="4" width="20" height="10" rx="2" fill="#00fff2" />
      <rect x="6" y="18" width="20" height="10" rx="2" fill="#8000ff" />
      <rect x="16" y="4" width="10" height="10" rx="2" fill="#0a0a0f" />
      <rect x="6" y="18" width="10" height="10" rx="2" fill="#0a0a0f" />
    </>
  )
}

const variants: Record<number, () => React.JSX.Element> = {
  1: CircuitS,
  2: VelocityArrows,
  3: BracketS,
  4: ConvergenceBars,
  5: NeuralS,
  6: SlashCut,
  7: InfinityFlow,
  8: PixelGrid,
  9: SignalWave,
  10: ModularStack,
}

export function Logo({ variant = 1, size = 32, className }: LogoProps) {
  const Variant = variants[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-label="Simplefysed logo"
    >
      <Variant />
    </svg>
  )
}
