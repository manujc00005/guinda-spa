import LoginForm from '../components/auth/LoginForm'

export const metadata = {
  title: 'Login — Guinda Admin',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#1a1a2e] mb-2">Guinda</h1>
          <p className="text-sm text-[#1a1a2e]/60 tracking-widest uppercase">Wellness & Spa — Admin</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
