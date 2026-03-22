import { Link } from "react-router-dom";
import { FileText, Users, Cpu, Plane, Plus } from "lucide-react";

const stats = [
  { label: "Aplicações no Mês", value: "0", icon: FileText, color: "text-primary" },
  { label: "Aplicações Hoje", value: "0", icon: FileText, color: "text-secondary" },
  { label: "Clientes Cadastrados", value: "0", icon: Users, color: "text-accent" },
  { label: "Drones Cadastrados", value: "0", icon: Cpu, color: "text-agro-dark" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-card rounded-xl shadow-sm border border-border p-5 text-center"
            >
              <Icon className={`h-8 w-8 mx-auto mb-2 ${s.color}`} />
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent applications */}
      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display text-lg font-semibold text-card-foreground">
            Últimas Aplicações
          </h2>
          <Link
            to="/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" />
            Nova Aplicação
          </Link>
        </div>

        <div className="p-10 text-center">
          <Plane className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">
            Nenhuma aplicação cadastrada ainda.
          </p>
          <Link
            to="/applications"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" />
            Criar Primeira Aplicação
          </Link>
        </div>
      </div>
    </div>
  );
}
