import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">ColdReach</h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          Automated cold email outreach for tech internships
        </p>

        <p className="text-lg text-gray-400 mb-12">
          Upload your CV, find verified emails, and send personalized cold emails to hiring managers in minutes.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg font-semibold text-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Find Leads</h3>
            <p className="text-gray-400">
              Discover 50+ verified hiring managers and tech leads at Series B-D companies in SF, NYC, and Seattle.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Personalize</h3>
            <p className="text-gray-400">
              AI-powered personalization that matches your tech stack to theirs. No fluff, just value.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Send</h3>
            <p className="text-gray-400">
              One click to send all emails or export as CSV. Built-in email verification.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
