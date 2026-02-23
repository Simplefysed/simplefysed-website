'use client'

import { motion } from 'framer-motion'
import { Globe, Smartphone, Brain, Code2 } from 'lucide-react'
import { Card, CardContent, GradientText } from '@/components/ui'

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Modern, responsive web applications built with cutting-edge technologies like React, Next.js, and TypeScript.',
    color: 'cyan',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile experiences for iOS and Android that users love.',
    color: 'purple',
  },
  {
    icon: Brain,
    title: 'AI Solutions',
    description: 'Intelligent automation, machine learning models, and AI-powered applications that transform businesses.',
    color: 'green',
  },
  {
    icon: Code2,
    title: 'Custom Software',
    description: 'Tailored enterprise solutions designed to meet your unique business requirements.',
    color: 'pink',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function ServicesShowcase() {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What We <GradientText>Build</GradientText>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            From web applications to AI solutions, we deliver exceptional digital experiences.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="flex flex-col items-start">
                  <div
                    className={`p-3 rounded-lg mb-4 bg-neon-${service.color}/10`}
                  >
                    <service.icon
                      className={`w-6 h-6 text-neon-${service.color}`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
