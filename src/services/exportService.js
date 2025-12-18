const { Parser } = require('json2csv');
const Application = require('../models/Application');

/**
 * Exporta aplicações filtradas para CSV
 */
async function exportApplicationsToCSV(filters, companyId) {
  try {
    const query = buildQuery(filters, companyId);
    
    const applications = await Application.find(query)
      .populate('clientId', 'nomeRazaoSocial propriedadeFazenda municipio uf cpfCnpj')
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome funcao')
      .sort({ dataHoraInicio: -1 })
      .lean();
    
    const fields = [
      { label: 'Data Início', value: (row) => new Date(row.dataHoraInicio).toLocaleString('pt-BR') },
      { label: 'Data Término', value: (row) => new Date(row.dataHoraTermino).toLocaleString('pt-BR') },
      { label: 'Cliente', value: (row) => row.clientId.nomeRazaoSocial },
      { label: 'Propriedade', value: (row) => row.clientId.propriedadeFazenda || '' },
      { label: 'Município', value: (row) => row.clientId.municipio },
      { label: 'UF', value: (row) => row.clientId.uf },
      { label: 'CPF/CNPJ', value: (row) => row.clientId.cpfCnpj || '' },
      { label: 'Cultura', value: 'culturaTratada' },
      { label: 'Área (ha)', value: 'areaTratada' },
      { label: 'Tipo Atividade', value: 'tipoAtividade' },
      { label: 'Produto', value: 'marcaComercial' },
      { label: 'Volume', value: 'volume' },
      { label: 'Dosagem', value: 'dosagemAplicada' },
      { label: 'Altura Voo (m)', value: 'alturaVoo' },
      { label: 'Drone', value: (row) => row.droneId.marcaModelo },
      { label: 'Registro ANAC', value: (row) => row.droneId.identificacaoRegistro },
      { label: 'Operador', value: (row) => row.operatorId.nome },
      { label: 'Função', value: (row) => row.operatorId.funcao },
      { label: 'Temperatura (°C)', value: 'meteorologia.temperatura' },
      { label: 'Umidade (%)', value: 'meteorologia.umidadeRelativa' },
      { label: 'Direção Vento', value: 'meteorologia.direcaoVento' },
      { label: 'Velocidade Vento (km/h)', value: 'meteorologia.velocidadeVento' },
      { label: 'Coordenadas', value: 'coordenadasGeograficas' }
    ];
    
    const parser = new Parser({ fields, withBOM: true });
    const csv = parser.parse(applications);
    
    return csv;
  } catch (error) {
    throw error;
  }
}

/**
 * Constrói query MongoDB baseada nos filtros
 */
function buildQuery(filters, companyId) {
  const query = { companyId };
  
  if (filters.dataInicio || filters.dataFim) {
    query.dataHoraInicio = {};
    if (filters.dataInicio) {
      query.dataHoraInicio.$gte = new Date(filters.dataInicio);
    }
    if (filters.dataFim) {
      query.dataHoraInicio.$lte = new Date(filters.dataFim + 'T23:59:59');
    }
  }
  
  if (filters.clientId) {
    query.clientId = filters.clientId;
  }
  
  if (filters.tipoAtividade) {
    query.tipoAtividade = filters.tipoAtividade;
  }
  
  if (filters.droneId) {
    query.droneId = filters.droneId;
  }
  
  if (filters.operatorId) {
    query.operatorId = filters.operatorId;
  }
  
  if (filters.cultura) {
    query.culturaTratada = new RegExp(filters.cultura, 'i');
  }
  
  return query;
}

module.exports = {
  exportApplicationsToCSV,
  buildQuery
};

