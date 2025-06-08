import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

export const metadata = {
  title: "Battery Indicator",
  description: "Minimal Battery Indicator – Black and White Only",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
