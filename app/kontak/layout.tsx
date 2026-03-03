import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak — ThinkSpace",
  description:
    "Hubungi tim ThinkSpace. Kirim pesan, pertanyaan, atau ajukan kemitraan cafe workspace.",
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
