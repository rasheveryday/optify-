'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  company_name: string
  job_title: string
}

interface Email {
  id: string
  subject: string
  body: string
  leads: Lead
}

export default function Dashboard() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'leads' | 'emails'>('form')
  const [cv, setCV] = useState('')
  const [location, setLocation] = useState('SF')
  const [role, setRole] = useState('SWE')
  const [leads, setLeads] = useState<Lead[]>([])
  const [emails, setEmails] = useState<Email[]>([])
  const [campaignId, setCampaignId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/campaigns', {
        cv_content: cv,
        target_location: location,
        target_role: role,
      })

      setCampaignId(response.data.id)

      // Find leads
      const leadsResponse = await api.post(`/campaigns/${response.data.id}/find-leads`)
      setLeads(leadsResponse.data.leads)
      setStep('leads')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateEmails = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await api.post(`/campaigns/${campaignId}/generate-emails`)
      setEmails(response.data.emails)
      setStep('emails')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate emails')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmails = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await api.post(`/campaigns/${campaignId}/send-emails`)
      alert(`✅ ${response.data.sent} emails sent!`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send emails')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ColdReach</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Step 1: Form */}
        {step === 'form' && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-8">Create Campaign</h2>

            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste Your CV
                </label>
                <textarea
                  value={cv}
                  onChange={(e) => setCV(e.target.value)}
                  placeholder="Paste your CV or resume here..."
                  required
                  rows={6}
                  className="w-full p-4 rounded-lg border border-gray-700 bg-gray-900 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900"
                  >
                    <option>SF</option>
                    <option>NYC</option>
                    <option>Seattle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900"
                  >
                    <option>SWE</option>
                    <option>Backend</option>
                    <option>Frontend</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || !cv}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold"
              >
                {loading ? 'Creating...' : 'Find Leads & Generate'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Leads */}
        {step === 'leads' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Found {leads.length} Leads
            </h2>

            <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-900"
                >
                  <h3 className="font-semibold">
                    {lead.first_name} {lead.last_name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {lead.job_title} at {lead.company_name}
                  </p>
                  <p className="text-sm text-gray-400">{lead.email}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerateEmails}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Generating...' : 'Generate Emails'}
            </button>
          </div>
        )}

        {/* Step 3: Emails */}
        {step === 'emails' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Generated {emails.length} Emails
            </h2>

            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {emails.map((email, idx) => (
                <div
                  key={email.id}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-900"
                >
                  <p className="text-sm text-gray-400 mb-2">
                    To: {email.leads.email}
                  </p>
                  <h4 className="font-semibold mb-2">{email.subject}</h4>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {email.body}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSendEmails}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Sending...' : 'Send All Emails'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
