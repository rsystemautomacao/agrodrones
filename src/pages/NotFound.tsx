import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          A página que você procura não existe.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
        >
          <Home className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
