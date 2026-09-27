# RM Studio

## Definição da solução

**Plataforma de acervo musical, reprodução online e downloads**

| Informação | Descrição |
|---|---|
| Versão | 1.2 |
| Data | 27 de setembro de 2026 |
| Público | Proprietário do acervo e desenvolvedor |
| Situação | Proposta para alinhamento e validação de escopo |
| Base do levantamento | Protótipo de interface e levantamento das funcionalidades |

## 1. Visão da solução

O RM Studio será uma plataforma web para organizar e disponibilizar um acervo de gravações digitalizadas de discos de vinil. O público poderá explorar o catálogo e ouvir as faixas pelo navegador. Mediante cadastro gratuito, poderá baixar o arquivo original disponibilizado pelo proprietário.

O proprietário terá uma área exclusiva para enviar músicas e capas, atualizar informações e retirar conteúdos do catálogo. A experiência será adaptada a celulares, tablets e computadores, tomando o protótipo atual como referência visual e funcional.

O projeto também incluirá o aprimoramento visual das telas. O layout poderá ser ajustado para valorizar as capas, melhorar a leitura e tornar os controles mais claros, mantendo a identidade musical do RM Studio. Essas melhorias serão desenvolvidas e avaliadas ao longo dos testes com o proprietário.

**A proposta reúne três capacidades centrais: apresentar o acervo, permitir sua audição e dar ao proprietário autonomia para administrá-lo.**

Este documento descreve a solução pretendida para um projeto experimental, desenvolvido em colaboração com o proprietário do acervo. O protótipo demonstra a experiência desejada; a implementação, os testes e a preparação para operação fazem parte do trabalho a realizar.

## 2. Objetivos e benefícios esperados

| Objetivo | Benefício esperado |
|---|---|
| Centralizar o acervo em um catálogo online | Facilitar a apresentação e a consulta das gravações |
| Permitir busca e filtros | Ajudar o visitante a encontrar músicas de interesse |
| Oferecer reprodução sem cadastro | Reduzir etapas para conhecer e ouvir o acervo |
| Disponibilizar downloads mediante cadastro | Organizar o acesso aos arquivos originais |
| Permitir gestão pelo proprietário | Dar autonomia para manter músicas, capas e informações atualizadas |
| Registrar reproduções e solicitações de download | Oferecer indicadores básicos de interesse pelas faixas |
| Separar dados e arquivos de mídia | Preparar a operação para ampliar o acervo conforme a demanda |

Esses benefícios serão avaliados durante o uso experimental da plataforma.

## 3. Quem utilizará a plataforma

| Perfil | O que poderá fazer |
|---|---|
| **Visitante sem cadastro** | Navegar pelo catálogo, pesquisar, filtrar e ouvir músicas |
| **Usuário cadastrado** | Utilizar os recursos públicos e baixar gratuitamente os arquivos originais disponibilizados |
| **Proprietário** | Utilizar os recursos do acervo, publicar e editar faixas, substituir arquivos e capas e retirar conteúdos |

O cadastro público criará somente contas de usuários do acervo. O acesso administrativo será exclusivo do proprietário, provisionado de forma controlada.

Esta primeira versão considera um único acervo RM Studio e um proprietário inicial.

## 4. Experiência de uso

### 4.1 Encontrar e ouvir uma música

O visitante acessará a página do acervo e visualizará as faixas disponíveis. Poderá buscar por autor, nome da faixa, gênero, ano ou álbum, além de combinar filtros por gênero e formato do arquivo original.

Ao escolher uma faixa, utilizará o player para reproduzir, pausar, avançar para outra faixa, voltar, ajustar o volume e escolher uma posição da música. A reprodução começará por ação do usuário. Na primeira versão, anterior e próxima percorrerão as faixas da página carregada; o encerramento da música pausará o player.

**Percurso:** acessar o acervo → encontrar uma faixa → reproduzir no navegador.

### 4.2 Cadastrar-se e baixar uma música

Ao solicitar um download sem estar conectado, o visitante verá as opções de cadastro ou entrada. O cadastro solicitará nome, e-mail e senha.

Após a autenticação, a plataforma retomará a solicitação da faixa escolhida, desde que ela continue disponível. Um usuário já conectado poderá iniciar o download diretamente.

**Percurso:** escolher uma faixa → solicitar download → cadastrar-se ou entrar → iniciar o download.

### 4.3 Publicar e manter o acervo

O proprietário entrará em sua conta, informará os dados da faixa e enviará um arquivo de áudio. A capa será opcional.

A plataforma verificará e preparará os arquivos antes de disponibilizar a faixa ao público. O proprietário poderá acompanhar se o envio está em processamento, foi concluído ou apresentou falha.

Quando houver substituição de áudio, a versão anterior permanecerá disponível até a nova versão estar pronta. A retirada de uma faixa impedirá novos acessos pelo catálogo, streaming e download.

**Percurso:** entrar como proprietário → enviar dados e arquivos → acompanhar processamento → disponibilizar a faixa.

## 5. Escopo da primeira versão

| Área | Funcionalidades incluídas |
|---|---|
| **Catálogo público** | Listagem paginada, músicas mais recentes primeiro, capa ou imagem substituta, informações da faixa e contadores básicos |
| **Busca e filtros** | Pesquisa por autor, título, gênero, ano e álbum; filtros combinados de gênero e formato |
| **Player** | Reprodução pública, pausa, anterior/próxima, controle de posição, duração, volume e silêncio |
| **Contas de acesso** | Cadastro gratuito, entrada, saída e identificação do perfil de acesso |
| **Downloads** | Download do arquivo original para usuários autenticados e retomada da solicitação após cadastro ou entrada |
| **Gestão de faixas** | Inclusão, edição, substituição de áudio, envio e remoção de capa e retirada do catálogo |
| **Painel do proprietário** | Visualização em grade ou tabela e acompanhamento do processamento dos arquivos |
| **Indicadores básicos** | Contagem de reproduções qualificadas e solicitações de download autorizadas por faixa |
| **Preparação operacional** | Controle de acesso, validação de arquivos, registros administrativos, monitoramento e cópias de segurança conforme ambiente definido |
| **Melhoria visual e usabilidade** | Refinamento de cores, tipografia, espaçamentos e organização das telas; padronização de botões, cards, formulários e mensagens |
| **Adaptação e acessibilidade** | Layout adequado a diferentes telas, navegação por teclado, foco visível, textos legíveis e controles acessíveis por toque |

### Aprimoramento da apresentação

O protótipo servirá como ponto de partida para evoluir o catálogo, o player, os formulários de acesso e a área do proprietário. A direção inicial preserva a inspiração em vinil, o fundo escuro, os destaques em âmbar e a valorização das capas, permitindo ajustes durante a experimentação.

As melhorias buscarão facilitar a identificação das ações, reduzir excesso de informação e apresentar com clareza situações como carregamento, ausência de resultados e falhas no envio. O player deverá permanecer acessível sem encobrir o conteúdo da página.

Será utilizado **Tailwind CSS**, já presente no protótipo, para organizar os estilos e reutilizar padrões visuais. Isso facilitará ajustes consistentes em várias telas. A melhoria estética abrangerá as funcionalidades previstas nesta versão; criação de uma nova marca ou de temas alternativos poderá ser discutida posteriormente.

### Informações de cada faixa

| Informação | Tratamento |
|---|---|
| Autor, nome da faixa, gênero e ano | Obrigatórios |
| Arquivo de áudio | Obrigatório; um original ativo por faixa |
| Álbum, número de catálogo e equipamento utilizado | Opcionais |
| Capa | Opcional; a plataforma apresenta imagem substituta quando não houver capa |
| Formato, tamanho, duração e características do áudio | Identificados a partir do arquivo enviado |

Áudios aceitos: **MP3, FLAC ou WAV**. Cada faixa terá o formato original enviado pelo proprietário; a proposta não prevê fornecer automaticamente o original nos três formatos.

Capas aceitas na entrada: **JPG, JPEG, PNG, BMP, SVG ou GIF**, sujeitas à validação e conversão para exibição segura. Na proposta inicial, GIF será apresentado como imagem estática.

## 6. Regras que orientam a solução

### Acesso ao conteúdo

A consulta e a audição serão públicas. O download do original exigirá cadastro e sessão ativa. Não haverá cobrança pelo uso ou pelo download nesta versão.

A proposta utiliza uma versão MP3 para reprodução online quando necessário e preserva o original para download. Essa escolha busca equilibrar a experiência no navegador e o consumo de banda; a necessidade de reprodução sem perdas de qualidade deverá ser alinhada com o proprietário.

O cadastro controla o acesso ao download do original. Como a reprodução é pública, a solução não promete impedir a captura do áudio ouvido pelo navegador.

### Publicação e retirada

Somente arquivos reais, enviados pelo proprietário e validados pela plataforma, serão publicados. Uma faixa com falha no processamento inicial ficará visível apenas na administração, para correção.

Retirar uma faixa interromperá novos acessos. Uma transferência já iniciada poderá terminar. A remoção definitiva dos arquivos seguirá a política operacional de limpeza e de cópias de segurança a ser acordada.

### Indicadores de utilização

As reproduções serão contadas após um período mínimo de escuta — inicialmente proposto em 10 segundos, ou ao término de faixas menores. Pausas, retomadas e novas requisições do player não deverão multiplicar a mesma reprodução.

O contador de downloads representará solicitações autorizadas emitidas pela plataforma. Ele não comprovará que a transferência foi concluída no dispositivo do usuário. Os indicadores são operacionais e não constituem medição de audiência auditada.

## 7. Organização tecnológica da solução

A base prevista é **PHP com Laravel e banco de dados PostgreSQL**, com organização modular. O sistema será organizado em módulos para contas de acesso, catálogo, arquivos de mídia, distribuição e registros administrativos.

| Parte da solução | Papel |
|---|---|
| **Site e painel administrativo** | Apresentar o acervo e permitir as ações de visitantes e proprietário |
| **Tailwind CSS e componentes reutilizáveis** | Padronizar a aparência, adaptar o layout a diferentes telas e simplificar a evolução visual |
| **Aplicação PHP** | Aplicar regras, validar acessos e coordenar publicação, reprodução e downloads |
| **PostgreSQL** | Armazenar usuários, informações das faixas, permissões e registros de utilização |
| **Armazenamento privado de mídia** | Guardar músicas e capas com acesso intermediado pela plataforma |
| **Processamento de arquivos** | Verificar os arquivos e preparar as versões utilizadas na reprodução e exibição |

As músicas e capas ficarão em armazenamento próprio para arquivos, enquanto o PostgreSQL manterá seus dados e referências. Essa é a abordagem proposta; eventual exigência de armazenar também os arquivos dentro do banco deverá ser discutida antes da implementação.

Essa organização permitirá ampliar recursos de processamento, armazenamento e entrega de mídia conforme o crescimento observado. A capacidade efetiva dependerá da infraestrutura disponível e dos testes realizados.

## 8. Segurança e continuidade

A implementação deverá contemplar proteção das senhas, conexões seguras, verificação de permissões no servidor, validação dos arquivos enviados e registro das ações administrativas relevantes.

O ambiente de produção deverá incluir monitoramento e cópias de segurança, com teste de restauração. A frequência dos backups, a retenção dos dados e os objetivos de recuperação serão definidos junto com a infraestrutura e o modelo de operação.

A disponibilidade, o desempenho e a recuperação dos dados serão avaliados durante os testes, considerando a infraestrutura disponível e o caráter experimental do projeto.

## 9. Itens fora desta primeira versão

Os recursos abaixo poderão ser avaliados em etapas futuras:

- Favoritos, playlists salvas, comentários e recomendações personalizadas.
- Aplicativos nativos para Android ou iOS.
- Hospedagem de acervos independentes de vários proprietários.
- Importação de músicas em lote e painéis analíticos avançados.
- Cadastros independentes de artistas e álbuns.
- Verificação de e-mail e recuperação automática de senha pelo usuário.

A recuperação do acesso do proprietário deverá contar com procedimento operacional seguro desde a primeira entrega. O atendimento a usuários que perderem o acesso precisa ser definido antes da abertura do cadastro público.

## 10. Etapas de entrega propostas

| Etapa | Resultado apresentado |
|---|---|
| **1. Alinhamento da solução** | Escopo, regras, formatos, qualidade de reprodução e necessidades de operação definidos |
| **2. Contas e catálogo** | Cadastro e acesso funcionando, com consulta, busca e filtros do acervo |
| **3. Gestão e processamento de mídia** | Proprietário consegue enviar arquivos, acompanhar publicação e manter as faixas |
| **4. Reprodução e downloads** | Audição pública, download autenticado e indicadores integrados |
| **5. Refinamento visual e validação com o proprietário** | Telas aprimoradas com Tailwind CSS, comparação antes/depois e fluxos completos demonstrados com arquivos representativos |
| **6. Preparação e entrada em operação** | Ambiente configurado, dados iniciais conferidos, backups e monitoramento verificados |

O desenvolvimento acontecerá de forma experimental e incremental. A ordem das entregas e os ajustes serão combinados entre o proprietário e o desenvolvedor, conforme os resultados dos testes e a disponibilidade para o projeto.

## 11. Como a entrega será validada

O proprietário poderá verificar a solução por meio dos seguintes cenários:

| Cenário | Resultado esperado |
|---|---|
| Acessar sem cadastro | Visualizar o catálogo e ouvir uma faixa |
| Pesquisar e combinar filtros | Encontrar resultados coerentes com autor, título, gênero, ano, álbum e formato |
| Solicitar download sem conta | Cadastrar-se ou entrar e retomar a solicitação da faixa |
| Utilizar uma conta comum | Baixar arquivos sem conseguir executar funções do proprietário |
| Enviar uma nova faixa | Acompanhar processamento e vê-la no catálogo após conclusão válida |
| Substituir áudio ou capa | Confirmar que a atualização aparece corretamente e que uma falha preserva a versão anterior |
| Retirar uma faixa | Confirmar que ela deixa de aceitar novos acessos públicos |
| Utilizar celular e computador | Realizar os principais fluxos em telas de tamanhos diferentes |
| Comparar a apresentação das telas | Identificar uma aparência consistente em cores, textos, botões, cards e formulários |
| Navegar por teclado e toque | Acessar controles e formulários com foco visível, rótulos claros e sem conteúdo encoberto pelo player |
| Receber um erro | Entender o ocorrido sem receber uma mensagem indevida de sucesso |

O desenvolvedor verificará adicionalmente controles de acesso, integridade dos arquivos, concorrência de alterações, desempenho e recuperação de dados.

## 12. Participação e responsabilidades propostas

| Participante | Contribuição esperada |
|---|---|
| **Proprietário** | Validar escopo e regras, fornecer identidade visual e arquivos representativos, definir o conteúdo a disponibilizar e participar da validação da entrega |
| **Desenvolvedor** | Implementar a solução, integrar as interfaces, executar testes, documentar a operação e preparar a implantação conforme o escopo combinado |
| **Responsável pela infraestrutura** | Configurar e manter hospedagem, domínio, certificados, armazenamento, backups e monitoramento; a atribuição desse papel será acordada |

Se houver acervo real no protótipo, sua transferência exigirá conferência dos arquivos e metadados. Dados demonstrativos não serão tratados automaticamente como conteúdo definitivo. O volume e as condições da migração deverão ser levantados para compor o planejamento.

## 13. Pontos para alinhamento com o proprietário

| Tema | Proposta de partida | Definição necessária |
|---|---|---|
| Modelo de acesso | Audição pública e download gratuito mediante cadastro | Confirmar a regra de disponibilização |
| Apresentação visual | Evoluir a identidade atual de vinil, com fundo escuro e destaques em âmbar | Compartilhar preferências e avaliar os ajustes de layout durante os testes |
| Qualidade da reprodução | MP3 para ouvir online; original para download | Confirmar se há exigência de streaming sem perdas |
| Dimensão do acervo | Um acervo e um proprietário inicial | Informar número de faixas, tamanho total e previsão de crescimento |
| Público esperado | Dimensionamento a partir da demanda | Estimar visitantes, ouvintes simultâneos e volume de downloads |
| Tamanho dos arquivos | Limites iniciais propostos: 500 MiB por áudio e 10 MiB por capa | Validar com amostras reais do acervo |
| Cadastro e recuperação de acesso | Cadastro sem confirmação de e-mail; recuperação do proprietário por procedimento | Definir necessidade de verificação e atendimento aos usuários |
| Retirada e retenção | Retirada pública imediata; limpeza posterior dos arquivos | Definir retenção, backups e tratamento de dados pessoais |
| Hospedagem e operação | Banco e mídia em serviços adequados a suas funções | Definir ambiente de hospedagem e responsáveis |
| Conteúdo inicial | Publicação de arquivos fornecidos pelo proprietário | Definir seleção, informações e condições de disponibilização |

As definições de hospedagem, armazenamento e processamento orientarão a preparação do ambiente para os testes e o uso da plataforma.

## 14. Evolução do projeto

Este documento reúne as funcionalidades e regras propostas para orientar o entendimento entre o proprietário do acervo e o desenvolvedor.

As observações do proprietário durante os testes ajudarão a definir os próximos ajustes. Mudanças nas funcionalidades, nas regras de acesso, na qualidade do áudio ou na operação serão combinadas e registradas para manter uma visão comum do projeto.
