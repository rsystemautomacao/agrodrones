// Helper para formatar nome da função do operador
function formatarFuncao(funcao) {
  const funcoes = {
    'piloto_remoto': 'Piloto Remoto',
    'aplicador': 'Aplicador',
    'aux_aplicacao': 'Aux de Aplicação',
    'rt': 'Responsável Técnico',
    'admin': 'Admin'
  };
  
  return funcoes[funcao] || funcao;
}

module.exports = { formatarFuncao };

