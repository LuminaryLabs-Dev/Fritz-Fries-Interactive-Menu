export const metadata = {
  title: 'Fritz — Website Preview',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
