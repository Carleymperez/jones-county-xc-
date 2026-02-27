import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import jcLogo from '../assets/jc-logo.png'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Invalid username or password')
      }

      const { token } = await res.json()
      login(token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-green-600 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={jcLogo} alt="Jones County Greyhounds" className="w-20 h-20 object-contain mb-4 drop-shadow-xl" />
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Admin Login</h1>
          <p className="text-green-200 text-sm mt-1">Jones County Cross Country</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-8">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="admin"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg
                         hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
