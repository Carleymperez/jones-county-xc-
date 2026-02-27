import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jcxc_admin_token'))

  function login(newToken) {
    localStorage.setItem('jcxc_admin_token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('jcxc_admin_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
