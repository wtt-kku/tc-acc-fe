import "@/styles/globals.css";
import "@sweetalert2/theme-bootstrap-4/bootstrap-4.css";
import { Inter, Kanit } from "@next/font/google";
import type { AppProps } from "next/app";

const kanit = Kanit({
  weight: "400",
  subsets: ["thai", "latin"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={kanit.className}>
      <Component {...pageProps} />
    </main>
  );
}
