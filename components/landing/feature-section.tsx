import { Database, MessageSquare, Users, Shield, Zap, FileText } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need in One Platform</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              LLMChat combines powerful knowledge management with state-of-the-art language models to provide an
              all-in-one solution.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Knowledge Base Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Create, edit, and manage knowledge bases with support for Markdown, PDF, and HTML documents.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Chat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Interact with LLMs enhanced by your knowledge base for context-aware conversations.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Custom Model Integration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Connect your own LLM models with custom API URLs and keys for maximum flexibility.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Team Collaboration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Work together with team members through shared knowledge bases and conversations.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Advanced Security</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Secure authentication with JWT and fine-grained permission controls for all resources.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Vector Search</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Leverage pgvector for semantic search capabilities across your knowledge base.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

