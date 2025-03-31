import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import Auth from './Auth'
import Account from './Account'
import { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes in auth state
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Clean up the subscription on unmount
    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}

export default App