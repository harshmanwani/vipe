import './globals.css';

export const metadata = {
  title: 'NS List - Community Marketplace',
  description: 'A community-driven marketplace for residents of a single building',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
} 