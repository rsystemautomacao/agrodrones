import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

interface Client {
  id: string;
  nomeRazaoSocial: string;
  cpfCnpj: string;
  propriedadeFazenda: string;
  municipio: string;
  uf: string;
}

export default function Clients() {
  const [clients] = useState<Client[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Clientes</h1>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        {clients.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum cliente cadastrado ainda.</p>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              <Plus className="h-4 w-4" />
              Cadastrar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-agro-dark text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Nome/Razão Social</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">CPF/CNPJ</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Propriedade</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Município/UF</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{c.nomeRazaoSocial}</td>
                    <td className="px-4 py-3 text-sm">{c.cpfCnpj || "-"}</td>
                    <td className="px-4 py-3 text-sm">{c.propriedadeFazenda || "-"}</td>
                    <td className="px-4 py-3 text-sm">{c.municipio}/{c.uf}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded-md bg-destructive text-destructive-foreground hover:opacity-80">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
