import './globals.css'
import MainLayout from '../components/layout/MainLayout'

export const metadata = {
  title: 'Setas Portugal',
  description: 'Base de dados nacional de setas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
