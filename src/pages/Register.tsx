import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary via-primary/80 to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-secondary px-8 py-8 text-center text-white">
            <Plane className="h-12 w-12 mx-auto mb-3 animate-float" />
            <h1 className="font-display text-2xl font-bold">Criar Conta</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Nome <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary focus:bg-card transition-all"
              />
            </div>
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
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary focus:bg-card transition-all"
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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary focus:bg-card transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "Registrar"}
            </button>
          </form>

          <div className="text-center px-8 py-5 bg-muted/50 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Já tem conta?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
