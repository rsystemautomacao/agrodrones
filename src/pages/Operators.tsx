import { useState } from "react";
import { Plus, Pencil, Power, Plane } from "lucide-react";

const funcaoLabels: Record<string, string> = {
  piloto_remoto: "Piloto Remoto",
  aplicador: "Aplicador",
  aux_aplicacao: "Aux de Aplicação",
  rt: "Responsável Técnico",
  admin: "Admin",
};

interface Operator {
  id: string;
  nome: string;
  funcao: string;
  documentoRegistro: string;
  telefone: string;
  active: boolean;
}

export default function Operators() {
  const [operators] = useState<Operator[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Operadores</h1>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" />
          Novo Operador
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        {operators.length === 0 ? (
          <div className="p-10 text-center">
            <Plane className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum operador cadastrado ainda.</p>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              <Plus className="h-4 w-4" />
              Cadastrar Primeiro Operador
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-agro-dark text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Nome</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Função</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Documento</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Telefone</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op) => (
                  <tr key={op.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{op.nome}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {funcaoLabels[op.funcao] || op.funcao}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{op.documentoRegistro || "-"}</td>
                    <td className="px-4 py-3 text-sm">{op.telefone || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {op.active && (
                          <button className="p-1.5 rounded-md bg-destructive text-destructive-foreground hover:opacity-80">
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
