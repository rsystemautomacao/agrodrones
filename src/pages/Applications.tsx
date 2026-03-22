import { useState } from "react";
import { Plus, Eye, Pencil, FileText, Copy, Plane } from "lucide-react";

export default function Applications() {
  const [applications] = useState<never[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Aplicações</h1>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" />
          Nova Aplicação
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        {applications.length === 0 ? (
          <div className="p-10 text-center">
            <Plane className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma aplicação cadastrada ainda.</p>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              <Plus className="h-4 w-4" />
              Criar Primeira Aplicação
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-agro-dark text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Data/Hora Início</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Propriedade</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Cultura</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Área (ha)</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Produto</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Operador</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Rows will render here when connected to backend */}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
