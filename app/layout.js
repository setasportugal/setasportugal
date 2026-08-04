import './globals.css'
import AuthGuard from '../components/AuthGuard'

export const metadata = {
  title: 'Setas DB - Pessoal',
  description: 'Base de dados pessoal de setas (darts)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <header>
          <div className="container">
            <h1>🎯 Setas DB</h1>
            <nav>
              <a href="/">Início</a>
              <a href="/jogadores">Jogadores</a>
              <a href="/equipas">Equipas</a>
              <a href="/associacoes">Associações</a>
            </nav>
          </div>
        </header>

        <main className="container">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>

      </body>
    </html>
  )
}
