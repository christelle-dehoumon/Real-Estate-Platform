import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Fasohabitat | Trouvez la maison de vos rêves',
  description: 'Trouvez le bien immobilier idéal à acheter ou louer au Burkina Faso. Plateforme immobilière premium.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} font-sans antialiased selection:bg-primary selection:text-white bg-background text-foreground`}>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
