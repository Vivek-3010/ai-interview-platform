'use client'

import dynamic from 'next/dynamic'

// Dynamically load your client-only component (RecordSection uses `window`)
const StartInterview = dynamic(() => import('./StartInterview'), {
  ssr: false,
})

export default function ClientStartInterviewWrapper({ interview }) {
  return <StartInterview interview={interview} />
}
