import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Configurações</h1>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          Dados da Empresa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Razão Social</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="Nome da empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">CNPJ</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="empresa@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border-2 border-input bg-muted/50 focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <button className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
