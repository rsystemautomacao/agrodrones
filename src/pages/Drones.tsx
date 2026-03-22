import { useState } from "react";
import { Plus, Pencil, Power, Cpu } from "lucide-react";

interface Drone {
  id: string;
  marcaModelo: string;
  identificacaoRegistro: string;
  capacidadeTanque: number | null;
  active: boolean;
}

export default function Drones() {
  const [drones] = useState<Drone[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Drones</h1>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" />
          Novo Drone
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        {drones.length === 0 ? (
          <div className="p-10 text-center">
            <Cpu className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum drone cadastrado ainda.</p>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
              <Plus className="h-4 w-4" />
              Cadastrar Primeiro Drone
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-agro-dark text-white">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Marca/Modelo</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Registro ANAC</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Tanque (L)</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {drones.map((d) => (
                  <tr key={d.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm">{d.marcaModelo}</td>
                    <td className="px-4 py-3 text-sm">{d.identificacaoRegistro}</td>
                    <td className="px-4 py-3 text-sm">{d.capacidadeTanque ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:opacity-80">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {d.active && (
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
