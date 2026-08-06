import './globals.css'
import MainLayout from '../components/layout/MainLayout'
import AuthGuard from '../components/AuthGuard'

export const metadata = {
  title: 'Setas Portugal',
  description: 'Base de dados nacional de setas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <AuthGuard>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthGuard>
      </body>
    </html>
  )
}
