"use client";



import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function AnimatedTestimonials({
  title = "What Our Customers Say",
  subtitle = "Read stories of how our purification systems changed water safety and lifestyles across cities.",
  badgeText = "Testimonials",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by developers from companies worldwide",
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Navigation handlers
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);

  // Refs for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  // Animation variants;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }



  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`py-12 sm:py-16 lg:py-24 overflow-hidden bg-muted/30 ${className || ""}`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 sm:gap-12 w-full md:grid-cols-2 lg:gap-24"
        >
          {/* Left side: Heading and navigation */}
          <motion.div className="flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-6 text-center md:text-left">
              {badgeText && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-sky-100 text-sky-800">
                  <Star className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5 fill-sky-600" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-sky-600 tracking-tighter md:text-4xl lg:text-5xl">
                {title}
              </h2>

              <p className="max-w-[600px] text-sm sm:text-base text-slate-400 md:text-xl/relaxed mx-auto md:mx-0">
                {subtitle}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 pt-2 sm:pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 sm:w-10 bg-sky-500" : "w-2 sm:w-2.5 bg-sky-300"
                      }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div className="relative h-full mr-0 md:mr-10 min-h-[280px] sm:min-h-[340px] md:min-h-[400px]">

            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >

                <div className="bg-background/50 backdrop-blur-lg border border-sky-200 rounded-xl p-4 sm:p-6 lg:p-8 h-full flex flex-col shadow-xl">
                  <div className="mb-3 sm:mb-6 flex gap-1.5 sm:gap-2 flex-wrap">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div className="relative mb-2 sm:mb-3 flex-1">
                    <Quote className="absolute -top-3 -left-3 sm:-left-5 h-6 w-6 sm:h-8 sm:w-8 text-primary/20 rotate-180 opacity-20" />
                    <p className="relative z-10 text-sm sm:text-base lg:text-lg font-medium leading-relaxed opacity-90 line-clamp-5 sm:line-clamp-none">
                      {testimonial.content}
                    </p>
                  </div>


                  <div className="flex items-center gap-3 sm:gap-4 mt-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-sky-800">{testimonial.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}


            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-primary/5" />
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-primary/5" />
          </motion.div>
         
        </motion.div>
         <div className="flex justify-center md:justify-end gap-3 mt-6 sticky">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-sky-300 hover:bg-sky-50"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-sky-300 hover:bg-sky-50"
            >
              <ChevronRight />
            </button>
          </div>

        {/* Logo cloud */}
        {trustedCompanies.length > 0 && (
          <motion.div initial="hidden" animate={controls} className="mt-24 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-8">
              {trustedCompaniesTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {trustedCompanies.map((company) => (
                <div key={company} className="text-2xl font-semibold text-muted-foreground/50">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
