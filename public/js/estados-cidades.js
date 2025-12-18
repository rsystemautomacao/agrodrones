// Lista de estados brasileiros em ordem alfabética
const estados = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' }
];

// Função para popular select de UF
function popularSelectUF(selectId, valorAtual = '') {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  // Limpar opções existentes exceto a primeira
  while (select.options.length > 1) {
    select.remove(1);
  }
  
  // Adicionar estados em ordem alfabética
  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado.uf;
    option.textContent = `${estado.uf} - ${estado.nome}`;
    if (valorAtual && valorAtual.toUpperCase() === estado.uf) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

// Função para buscar cidades de um estado (usando API IBGE)
async function buscarCidades(uf, inputId) {
  if (!uf || uf.length !== 2) {
    return;
  }
  
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    const cidades = await response.json();
    
    // Criar ou atualizar datalist
    let datalist = document.getElementById(`cidades-${uf}`);
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = `cidades-${uf}`;
      document.body.appendChild(datalist);
    } else {
      datalist.innerHTML = '';
    }
    
    // Popular datalist com cidades
    cidades.forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade.nome;
      datalist.appendChild(option);
    });
    
    // Associar datalist ao input
    const input = document.getElementById(inputId);
    if (input) {
      input.setAttribute('list', `cidades-${uf}`);
      input.setAttribute('autocomplete', 'off');
    }
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Popular todos os selects de UF na página
  document.querySelectorAll('select[id*="uf"], select[id*="UF"], select[name*="uf"], select[name*="UF"]').forEach(select => {
    if (select.id && (select.id.toLowerCase().includes('uf') || select.id.toLowerCase().includes('estado'))) {
      popularSelectUF(select.id, select.value);
    }
  });
  
  // Adicionar listener para mudanças de UF
  document.querySelectorAll('select[id*="uf"], select[id*="UF"], select[name*="uf"], select[name*="UF"]').forEach(select => {
    select.addEventListener('change', function() {
      const uf = this.value;
      // Procurar input de cidade próximo
      const formGroup = this.closest('.form-group');
      if (formGroup) {
        const formRow = formGroup.parentElement;
        const cidadeInput = formRow.querySelector('input[id*="cidade"], input[id*="Cidade"], input[name*="cidade"], input[name*="Cidade"]');
        if (cidadeInput && cidadeInput.id) {
          buscarCidades(uf, cidadeInput.id);
        }
      }
    });
  });
});

