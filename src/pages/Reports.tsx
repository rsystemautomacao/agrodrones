import { BarChart3, Download, FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Relatórios</h1>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Período Início</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Período Fim</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Cliente</label>
            <select className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm">
              <option value="">Todos</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition">
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition">
            <FileText className="h-4 w-4" />
            PDF Consolidado
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-10 text-center">
        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">
          Aplique os filtros acima para gerar relatórios.
        </p>
      </div>
    </div>
  );
}
