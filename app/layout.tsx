
import "./globals.css";
export const metadata = { title: "Bandit Arc Mini App", description: "Circle Arc Testnet Wallet Manager" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
