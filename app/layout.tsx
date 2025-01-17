import Header from '../components/Header';  // Relative path se import
import Footer from '../components/Footer';  // Relative path se import
import '../globals.css';  // Relative path se import

export const metadata = {
  title: 'Team Dashboard',
  description: 'A dashboard to manage team members and tasks.',
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />  {/* Header ko render kar rahe hain */}
          <main className="flex-grow container mx-auto p-4">{children}</main>  {/* Children components ko render kar rahe hain */}
          <Footer />  {/* Footer ko render kar rahe hain */}
        </div>
      </body>
    </html>
  );
};

export default Layout;
