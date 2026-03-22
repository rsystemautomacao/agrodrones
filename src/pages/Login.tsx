import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder - will connect to Lovable Cloud auth
    setTimeout(() => {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary via-primary/80 to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.5s_ease-out]">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-secondary px-8 py-10 text-center text-white">
            <Plane className="h-16 w-16 mx-auto mb-4 animate-float" />
            <h1 className="font-display text-3xl font-bold mb-1">
              Agro<span className="opacity-90">Drones</span>
            </h1>
            <p className="text-white/90 text-sm">
              Cada aplicação registrada. Cada voo comprovado.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Senha <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center px-8 py-5 bg-muted/50 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Não tem conta?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Registre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
