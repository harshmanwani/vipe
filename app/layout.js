import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

export const metadata = {
  title: 'Vipe - Community Marketplace',
  description: 'A community-driven marketplace for residents of a single building',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 