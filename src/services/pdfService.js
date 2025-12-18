const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Gera PDF do Relatório Operacional (Anexo XI - MAPA)
 */
async function generateRelatorioOperacional(application, company) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Logo (empresa ou padrão)
      let logoPath = null;
      if (company.logo) {
        const customLogoPath = path.join(__dirname, '../../', company.logo);
        if (fs.existsSync(customLogoPath)) {
          logoPath = customLogoPath;
        }
      }
      
      // Se não tem logo customizado, usar logo padrão
      if (!logoPath) {
        const defaultLogoPath = path.join(__dirname, '../../public/images/logo.png');
        if (fs.existsSync(defaultLogoPath)) {
          logoPath = defaultLogoPath;
        }
      }
      
      if (logoPath) {
        doc.image(logoPath, 50, 50, { width: 100 });
      }
      
      // Cabeçalho
      const logoHeight = logoPath ? 160 : 50;
      doc.fontSize(16).font('Helvetica-Bold')
        .text('RELATÓRIO OPERACIONAL DE APLICAÇÃO AÉREA', 50, logoHeight, { align: 'center' });
      
      doc.fontSize(10).font('Helvetica').moveDown(2);
      
      // Empresa e Contratante
      doc.font('Helvetica-Bold').text('1. EMPRESA/PRESTADOR DE SERVIÇO:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Razão Social: ${company.razaoSocial}`, 60, doc.y + 10)
        .text(`CNPJ: ${company.cnpj}`, 60, doc.y)
        .text(`Registro MAPA: ${application.relatorioOperacional.registroMAPA || company.numeroRegistroMAPA || 'N/A'}`, 60, doc.y)
        .text(`Endereço: ${company.logradouro}, ${company.numero} - ${company.bairro}`, 60, doc.y)
        .text(`${company.cidade}/${company.uf} - CEP: ${company.cep}`, 60, doc.y)
        .text(`Telefone: ${company.telefone}`, 60, doc.y)
        .moveDown();
      
      doc.font('Helvetica-Bold').text('2. CONTRATANTE/PROPRIEDADE:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Nome/Razão Social: ${application.relatorioOperacional.contratante || application.clientId.nomeRazaoSocial || 'N/A'}`, 60, doc.y + 10)
        .text(`CPF/CNPJ: ${application.relatorioOperacional.cpfCnpj || application.clientId.cpfCnpj || 'N/A'}`, 60, doc.y)
        .text(`Propriedade/Fazenda: ${application.relatorioOperacional.propriedade || application.clientId.propriedadeFazenda || 'N/A'}`, 60, doc.y)
        .text(`Localização: ${application.relatorioOperacional.localizacao || application.clientId.enderecoLocalizacao || 'N/A'}`, 60, doc.y)
        .text(`Município: ${application.relatorioOperacional.municipio || application.clientId.municipio || 'N/A'}`, 60, doc.y)
        .text(`UF: ${application.relatorioOperacional.uf || application.clientId.uf || 'N/A'}`, 60, doc.y)
        .moveDown();
      
      // Produto
      doc.font('Helvetica-Bold').text('3. PRODUTO APLICADO:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Marca Comercial: ${application.marcaComercial}`, 60, doc.y + 10)
        .text(`Formulação: ${application.relatorioOperacional.formulacao || 'N/A'}`, 60, doc.y)
        .text(`Dosagem: ${application.dosagemAplicada}`, 60, doc.y)
        .text(`Classe Toxicológica: ${application.relatorioOperacional.classeToxicologica || 'N/A'}`, 60, doc.y)
        .text(`Adjuvante: ${application.relatorioOperacional.adjuvante || 'N/A'}`, 60, doc.y)
        .text(`Volume: ${application.relatorioOperacional.volume || application.volume} ${company.configuracoes?.unidadesPadrao || 'L/ha'}`, 60, doc.y)
        .text(`Outros: ${application.relatorioOperacional.outros || 'N/A'}`, 60, doc.y)
        .moveDown();
      
      // Receituário Agronômico
      if (application.relatorioOperacional.receituarioAgronomico?.numero) {
        doc.font('Helvetica-Bold').text('4. RECEITUÁRIO AGRONÔMICO:', 50, doc.y);
        doc.font('Helvetica')
          .text(`Número: ${application.relatorioOperacional.receituarioAgronomico.numero}`, 60, doc.y + 10)
          .text(`Data de Emissão: ${application.relatorioOperacional.receituarioAgronomico.dataEmissao ? new Date(application.relatorioOperacional.receituarioAgronomico.dataEmissao).toLocaleDateString('pt-BR') : 'N/A'}`, 60, doc.y)
          .moveDown();
      }
      
      // Dados da Aplicação
      doc.font('Helvetica-Bold').text('5. DADOS DA APLICAÇÃO:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Data e Hora de Início: ${new Date(application.dataHoraInicio).toLocaleString('pt-BR')}`, 60, doc.y + 10)
        .text(`Data e Hora de Término: ${new Date(application.dataHoraTermino).toLocaleString('pt-BR')}`, 60, doc.y)
        .text(`Cultura Tratada: ${application.culturaTratada}`, 60, doc.y)
        .text(`Área Tratada: ${application.areaTratada} hectares`, 60, doc.y)
        .text(`Coordenadas Geográficas: ${application.coordenadasGeograficas}`, 60, doc.y)
        .text(`Tipo de Atividade: ${application.tipoAtividade}`, 60, doc.y)
        .moveDown();
      
      // Parâmetros Meteorológicos
      doc.font('Helvetica-Bold').text('6. PARÂMETROS METEOROLÓGICOS:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Temperatura: ${application.meteorologia.temperatura}°C`, 60, doc.y + 10)
        .text(`Umidade Relativa do Ar: ${application.meteorologia.umidadeRelativa}%`, 60, doc.y)
        .text(`Direção do Vento: ${application.meteorologia.direcaoVento}`, 60, doc.y)
        .text(`Velocidade do Vento: ${application.meteorologia.velocidadeVento} km/h`, 60, doc.y);
      
      if (application.relatorioOperacional.parametrosBasicos) {
        const params = application.relatorioOperacional.parametrosBasicos;
        doc.text(`Temperatura Máxima: ${params.temperaturaMax || 'N/A'}°C`, 60, doc.y)
          .text(`Temperatura Mínima: ${params.temperaturaMin || 'N/A'}°C`, 60, doc.y)
          .text(`Umidade Relativa Mínima: ${params.umidadeRelativaMin || 'N/A'}%`, 60, doc.y)
          .text(`Velocidade Máxima do Vento: ${params.velocidadeVentoMax || 'N/A'} km/h`, 60, doc.y);
      }
      doc.moveDown();
      
      // Equipamento
      doc.font('Helvetica-Bold').text('7. EQUIPAMENTO UTILIZADO:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Aeronave (ARP): ${application.droneId.marcaModelo} - ${application.droneId.identificacaoRegistro}`, 60, doc.y + 10)
        .text(`Altura de Voo: ${application.alturaVoo} metros`, 60, doc.y);
      
      if (application.relatorioOperacional.parametrosBasicos) {
        const params = application.relatorioOperacional.parametrosBasicos;
        doc.text(`Equipamento: ${params.equipamento || 'N/A'}`, 60, doc.y)
          .text(`Modelo: ${params.modelo || 'N/A'}`, 60, doc.y)
          .text(`Tipo: ${params.tipo || 'N/A'}`, 60, doc.y)
          .text(`Ângulo: ${params.angulo || 'N/A'}`, 60, doc.y)
          .text(`Largura da Faixa: ${params.larguraFaixa || 'N/A'} metros`, 60, doc.y);
      }
      doc.moveDown();
      
      // Operador
      doc.font('Helvetica-Bold').text('8. OPERADOR/APLICADOR:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Nome: ${application.operatorId.nome}`, 60, doc.y + 10)
        .text(`Função: ${application.operatorId.funcao}`, 60, doc.y)
        .moveDown();
      
      // Observações
      if (application.relatorioOperacional.observacoes) {
        doc.font('Helvetica-Bold').text('9. OBSERVAÇÕES:', 50, doc.y);
        doc.font('Helvetica')
          .text(application.relatorioOperacional.observacoes, 60, doc.y + 10, { width: 500 })
          .moveDown();
      }
      
      // Assinaturas
      doc.font('Helvetica-Bold').text('10. ASSINATURAS:', 50, doc.y);
      doc.font('Helvetica')
        .text(`Responsável Técnico: ${application.relatorioOperacional.assinaturas.responsavelTecnico.nome || company.responsavelTecnico?.nome || 'N/A'}`, 60, doc.y + 20)
        .text(`CREA: ${application.relatorioOperacional.assinaturas.responsavelTecnico.registro || company.responsavelTecnico?.crea || 'N/A'}`, 60, doc.y)
        .moveDown(2)
        .text(`Aplicador: ${application.relatorioOperacional.assinaturas.aplicador.nome || application.operatorId.nome || 'N/A'}`, 60, doc.y)
        .text(`Registro: ${application.relatorioOperacional.assinaturas.aplicador.registro || application.operatorId.documentoRegistro || 'N/A'}`, 60, doc.y);
      
      // Rodapé
      const pageHeight = doc.page.height;
      doc.fontSize(8).font('Helvetica')
        .text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 50, pageHeight - 50, { align: 'center' })
        .text(`${company.razaoSocial} - ${company.cnpj}`, 50, doc.y, { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF consolidado de múltiplas aplicações
 */
async function generateRelatorioConsolidado(applications, company, periodo) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Logo (empresa ou padrão)
      let logoPath = null;
      if (company.logo) {
        const customLogoPath = path.join(__dirname, '../../', company.logo);
        if (fs.existsSync(customLogoPath)) {
          logoPath = customLogoPath;
        }
      }
      
      // Se não tem logo customizado, usar logo padrão
      if (!logoPath) {
        const defaultLogoPath = path.join(__dirname, '../../public/images/logo.png');
        if (fs.existsSync(defaultLogoPath)) {
          logoPath = defaultLogoPath;
        }
      }
      
      if (logoPath) {
        doc.image(logoPath, 50, 50, { width: 100 });
      }
      
      // Capa
      const logoHeight = logoPath ? 160 : 50;
      doc.fontSize(20).font('Helvetica-Bold')
        .text('RELATÓRIO CONSOLIDADO DE APLICAÇÕES', 50, logoHeight, { align: 'center' });
      
      doc.fontSize(14).font('Helvetica').moveDown(2)
        .text(company.razaoSocial, { align: 'center' })
        .moveDown()
        .fontSize(12)
        .text(`Período: ${periodo}`, { align: 'center' })
        .text(`Total de Aplicações: ${applications.length}`, { align: 'center' })
        .moveDown(3)
        .fontSize(10)
        .text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });
      
      // Nova página para sumário
      doc.addPage();
      doc.fontSize(16).font('Helvetica-Bold')
        .text('SUMÁRIO DE APLICAÇÕES', 50, 50, { align: 'center' });
      doc.moveDown();
      
      let y = 100;
      applications.forEach((app, index) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        
        doc.fontSize(10).font('Helvetica-Bold')
          .text(`${index + 1}. Aplicação ${index + 1}`, 50, y);
        doc.font('Helvetica')
          .fontSize(9)
          .text(`Data: ${new Date(app.dataHoraInicio).toLocaleDateString('pt-BR')}`, 60, y + 15)
          .text(`Cliente: ${app.clientId.nomeRazaoSocial}`, 60, doc.y)
          .text(`Propriedade: ${app.clientId.propriedadeFazenda || 'N/A'}`, 60, doc.y)
          .text(`Município: ${app.clientId.municipio}/${app.clientId.uf}`, 60, doc.y)
          .text(`Cultura: ${app.culturaTratada}`, 60, doc.y)
          .text(`Área: ${app.areaTratada} hectares`, 60, doc.y)
          .text(`Produto: ${app.marcaComercial}`, 60, doc.y);
        
        y = doc.y + 20;
      });
      
      // Rodapé
      const pageHeight = doc.page.height;
      doc.fontSize(8).font('Helvetica')
        .text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 50, pageHeight - 50, { align: 'center' })
        .text(`${company.razaoSocial} - ${company.cnpj}`, 50, doc.y, { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateRelatorioOperacional,
  generateRelatorioConsolidado
};

