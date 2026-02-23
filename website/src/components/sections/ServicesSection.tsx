'use client'

import { motion, Variants } from 'framer-motion'
import { Globe, Smartphone, TabletSmartphone, Building2, Code2, Palette, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { GradientText } from '@/components/ui/GradientText'
import { cn } from '@/lib/utils'

type NeonColor = 'cyan' | 'purple' | 'green' | 'pink'

const colorMap: Record<NeonColor, { bg: string; text: string; dot: string; border: string; gradient: string; hoverBorder: string; hoverGlow: string }> = {
  cyan: { bg: 'bg-neon-cyan/10', text: 'text-neon-cyan', dot: 'bg-neon-cyan', border: 'border-neon-cyan/30', gradient: 'from-neon-cyan/[0.03]', hoverBorder: 'hover:border-neon-cyan/50', hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,255,242,0.15)]' },
  purple: { bg: 'bg-neon-purple/10', text: 'text-neon-purple', dot: 'bg-neon-purple', border: 'border-neon-purple/30', gradient: 'from-neon-purple/[0.03]', hoverBorder: 'hover:border-neon-purple/50', hoverGlow: 'hover:shadow-[0_0_20px_rgba(128,0,255,0.15)]' },
  green: { bg: 'bg-neon-green/10', text: 'text-neon-green', dot: 'bg-neon-green', border: 'border-neon-green/30', gradient: 'from-neon-green/[0.03]', hoverBorder: 'hover:border-neon-green/50', hoverGlow: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]' },
  pink: { bg: 'bg-neon-pink/10', text: 'text-neon-pink', dot: 'bg-neon-pink', border: 'border-neon-pink/30', gradient: 'from-neon-pink/[0.03]', hoverBorder: 'hover:border-neon-pink/50', hoverGlow: 'hover:shadow-[0_0_20px_rgba(255,0,128,0.15)]' },
}

interface ServiceCard {
  title: string
  icon: LucideIcon
  color: NeonColor
  description: string
  capabilities: string[]
}

const services: ServiceCard[] = [
  {
    title: 'Web Development',
    icon: Globe,
    color: 'cyan',
    description: 'AI-accelerated web applications with automated testing pipelines, intelligent optimization, and self-tuning performance. Let AI handle the repetitive work, from data entry and report generation to scheduled tasks and content management, so your team can focus on what actually moves the needle.',
    capabilities: ['Cutting Edge Design', 'Automated Testing Suites', 'Intelligent Performance Tuning', 'Smart API Architecture'],
  },
  {
    title: 'iOS Development',
    icon: Smartphone,
    color: 'green',
    description: 'Polished, high-performance iOS apps that feel native from the first tap. Fast iteration, intuitive interfaces, and experiences your users will love.',
    capabilities: ['Pixel-Perfect Native UI', 'Seamless User Experiences', 'Predictive UX Patterns', 'Intelligent App Analytics'],
  },
  {
    title: 'Android Development',
    icon: TabletSmartphone,
    color: 'green',
    description: 'Beautiful, responsive Android apps that run flawlessly across every device. Built for scale, designed for engagement, and ready for the Play Store.',
    capabilities: ['Material Design Excellence', 'Cross-Device Compatibility', 'Buttery Smooth Performance', 'Play Store Optimization'],
  },
  {
    title: 'Enterprise Software',
    icon: Building2,
    color: 'pink',
    description: 'AI-automated business processes with intelligent workflow orchestration, predictive analytics, and self-healing system architecture.',
    capabilities: ['AI Workflow Orchestration', 'Predictive Business Analytics', 'Automated Process Mining', 'Self-Healing Architecture'],
  },
  {
    title: 'Custom Software',
    icon: Code2,
    color: 'pink',
    description: 'Purpose-built software shaped around your business. From complex workflows to niche requirements, we deliver solutions that fit like a glove.',
    capabilities: ['Tailored to Your Workflow', 'Scalable Architecture', 'Seamless Integrations', 'Future-Proof Design'],
  },
  {
    title: 'Web Design',
    icon: Palette,
    color: 'cyan',
    description: 'Striking, conversion-driven designs that turn visitors into customers. Accessible, responsive, and crafted to make your brand unforgettable. Every pixel is intentional, from typography and color to layout and motion, so your product stands out in a crowded market.',
    capabilities: ['Brand-Driven Design Systems', 'Full Accessibility Compliance', 'Conversion Rate Optimization', 'Rapid Prototyping & Iteration'],
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function ServiceCardComponent({ service }: { service: ServiceCard }) {
  const colors = colorMap[service.color]
  const Icon = service.icon

  return (
    <Card variant="glow" hover={false} className={cn('group relative h-full transition-all duration-300', colors.border, colors.hoverBorder, colors.hoverGlow)}>

      <CardContent className="relative p-6">
        {/* Icon + AI Badge row */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110', colors.bg)}>
            <Icon className={cn('w-7 h-7', colors.text)} />
          </div>

        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary font-display mb-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Capabilities */}
        <ul className="space-y-2">
          {service.capabilities.map((cap) => (
            <li key={cap} className="flex items-center gap-2 text-sm text-text-muted">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />
              {cap}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function ServicesSection() {
  return (
    <section id="services" className="py-32 px-6 sm:px-8 lg:px-12 bg-bg-secondary relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            State of the Art{' '}
            <GradientText>AI-Driven</GradientText> Software
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-secondary max-w-3xl mx-auto text-lg"
          >
            Every solution we build leverages artificial intelligence to automate manual processes,
            accelerate delivery, and create software that thinks for you.
          </motion.p>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, i) => {
            // Span-2 for first card (top-left) and last card (bottom-right)
            const isWide = i === 0 || i === 5
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className={cn(isWide && 'lg:col-span-2')}
              >
                <ServiceCardComponent service={service} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
