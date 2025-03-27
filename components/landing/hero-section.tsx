import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Intelligent Conversations with Your Knowledge Base
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                LLMChat combines knowledge base management with powerful language models for smarter, context-aware
                conversations.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px] xl:h-[550px] xl:w-[550px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-6 h-full w-full overflow-hidden">
                <div className="space-y-4">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-blue-100 dark:bg-blue-900/20 rounded flex items-center px-3">
                    <div className="h-4 w-3/4 bg-blue-200 dark:bg-blue-800 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

