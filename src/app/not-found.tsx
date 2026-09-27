import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4" style={{ color: "var(--accent)" }}>
        404
      </h1>
      <p className="text-xl mb-6" style={{ color: "var(--muted)" }}>
        Página no encontrada
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg text-white font-medium transition-colors"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
