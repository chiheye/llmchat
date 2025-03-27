"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ParticleBackground } from "@/components/ui/particles"
import { ArrowRight, Database, MessageSquare, Zap, Shield, Users, FileText } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsClient(true)
  }, [])

  // Return a simplified version for server-side rendering
  if (!isClient) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>
        <div className="relative z-10">
          {/* Static content that doesn't depend on client-side features */}
          <header className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-white">LLMChat</h1>
          </header>
        </div>
      </main>
    )
  }

  // Full interactive version for client-side
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
      {/* Particle background */}
      {mounted && <ParticleBackground />}

      {/* Tech-inspired background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

        {/* Animated tech circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] border border-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/10 rounded-full animate-pulse [animation-delay:750ms]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-300/10 rounded-full animate-pulse [animation-delay:500ms]"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-3">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-blue-500 rounded-full opacity-40"></div>
            <div className="absolute inset-3 bg-blue-600 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">LLMChat</h1>
        </div>
        <nav>
          <ul className="flex space-x-8">
            <li>
              <a href="#features" className="text-blue-200 hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="text-blue-200 hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="text-blue-200 hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex space-x-4">
          <Link href="/login">
            <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm backdrop-blur-sm">
                Intelligent AI Conversations
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Enhance Your Knowledge with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  AI-Powered
                </span>{" "}
                Conversations
              </h2>
              <p className="text-xl text-blue-200">
                LLMChat combines knowledge base management with powerful language models for smarter, context-aware
                conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-blue-300">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-900 flex items-center justify-center text-xs text-white font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Join 2,000+ users already using LLMChat</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-blue-300">LLMChat Interface</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      AI
                    </div>
                    <div className="flex-1 p-3 bg-blue-900/40 rounded-lg border border-blue-500/30 text-blue-100">
                      How can I help you today?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="flex-1 p-3 bg-blue-600/40 rounded-lg border border-blue-500/30 text-white">
                      Can you explain how vector databases work with LLMs?
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                      U
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      AI
                    </div>
                    <div className="flex-1 p-3 bg-blue-900/40 rounded-lg border border-blue-500/30 text-blue-100">
                      <p className="mb-2">
                        Vector databases store and retrieve data based on semantic similarity rather than exact
                        matching.
                      </p>
                      <p className="mb-2">When working with LLMs:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Text is converted to vector embeddings</li>
                        <li>Similar concepts have similar vector representations</li>
                        <li>This enables semantic search capabilities</li>
                      </ol>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full p-3 pr-12 bg-blue-950/50 border border-blue-500/30 rounded-lg text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm backdrop-blur-sm mb-4">
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need in One Platform</h2>
            <p className="max-w-2xl mx-auto text-xl text-blue-200">
              LLMChat combines powerful knowledge management with state-of-the-art language models.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative backdrop-blur-sm bg-blue-950/30 border border-blue-500/20 rounded-xl p-6 h-full transition-all duration-300 group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative backdrop-blur-sm bg-blue-950/30 border border-blue-500/30 rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="max-w-2xl mx-auto text-xl text-blue-200 mb-8">
                Join thousands of users who are already leveraging the power of LLMChat for smarter conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                  >
                    Sign Up for Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-blue-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative w-8 h-8 mr-2">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20"></div>
                  <div className="absolute inset-1 bg-blue-500 rounded-full opacity-40"></div>
                  <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">LLMChat</h3>
              </div>
              <p className="text-blue-300 mb-4">Intelligent conversations with your knowledge base.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-blue-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-blue-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900/50 mt-12 pt-8 text-center text-blue-400">
            <p>© 2025 LLMChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    title: "Knowledge Base Management",
    description: "Create, edit, and manage knowledge bases with support for Markdown, PDF, and HTML documents.",
    icon: Database,
  },
  {
    title: "AI-Powered Chat",
    description: "Interact with LLMs enhanced by your knowledge base for context-aware conversations.",
    icon: MessageSquare,
  },
  {
    title: "Custom Model Integration",
    description: "Connect your own LLM models with custom API URLs and keys for maximum flexibility.",
    icon: Zap,
  },
  {
    title: "Team Collaboration",
    description: "Work together with team members through shared knowledge bases and conversations.",
    icon: Users,
  },
  {
    title: "Advanced Security",
    description: "Secure authentication with JWT and fine-grained permission controls for all resources.",
    icon: Shield,
  },
  {
    title: "Vector Search",
    description: "Leverage pgvector for semantic search capabilities across your knowledge base.",
    icon: FileText,
  },
]

