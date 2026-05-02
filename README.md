# 🎬 MarkFilmes

Aplicação fullstack de catálogo de filmes e séries, desenvolvida com **Java + Spring Boot** no backend e **HTML/CSS/JavaScript** puro no frontend.

---

## 📋 Sobre o projeto

O MarkFilmes permite buscar filmes e séries diretamente pela API do **OMDB**, salvar os dados em banco de dados local e exibi-los em uma interface web moderna. As sinopses são traduzidas automaticamente para o português via **MyMemory API**.

---

## ✨ Funcionalidades

- 🔍 **Busca por título** — pesquisa filmes e séries na OMDB e salva automaticamente no banco
- 🎭 **Listagem separada** de filmes e séries com seções de Lançamentos, Mais Populares e todos os títulos
- 📂 **Filtro por categoria** — Ação, Comédia, Drama, Crime, Aventura e Romance
- 📺 **Detalhes da série** — sinopse, elenco, avaliação e listagem de episódios por temporada
- 🎥 **Detalhes do filme** — sinopse traduzida, elenco, ano de lançamento e duração
- 🌐 **Tradução automática** de sinopses do inglês para o português (MyMemory API)
- 🚫 **Sem duplicatas** — verifica se o título já existe no banco antes de salvar

---

## 🛠️ Tecnologias utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| Java 17+ | Linguagem principal |
| Spring Boot | Framework web |
| Spring Data JPA | Persistência de dados |
| Hibernate | ORM |
| PostgreSQL | Banco de dados |
| Maven | Gerenciador de dependências |

### Frontend
| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização |
| JavaScript (ES Modules) | Lógica e consumo da API |
| Google Fonts (Inter) | Tipografia |
| Material Symbols | Ícones |

### APIs externas
| API | Uso |
|---|---|
| [OMDB API](https://www.omdbapi.com/) | Busca de filmes e séries |
| [MyMemory API](https://mymemory.translated.net/) | Tradução de sinopses |

---

## Como executar

### Pré-requisitos

- Java 17 ou superior
- Maven
- PostgreSQL rodando localmente
- Chave de API do OMDB (gratuita com requisições limitadas em [omdbapi.com](https://www.omdbapi.com/apikey.aspx))

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/markfilmes.git
cd markfilmes
```

### 2. Configure o banco de dados

No arquivo `src/main/resources/application.properties`, ajuste as credenciais:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/markfilmes
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

### 3. Configure a chave da OMDB

No arquivo `application.properties`, adicione:

```properties
omdb.api.key=sua_chave_aqui
```

Ou defina diretamente na classe `BuscaService.java`:

```java
private final String API_KEY = "&apikey=sua_chave_aqui"; (A chave utilizada no projeto é a chave gratuita do OMDB)
```

### 4. Execute o backend

```bash
cd markFilmes
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### 5. Execute o frontend

Abra a pasta `front_markFilmes` com um servidor local. Recomendado usar a extensão **Live Server** do VS Code ou:

```bash
npx serve front_markFilmes
```

Acesse `http://localhost:5501/index.html`

---

## 📡 Endpoints da API

### Séries
| Método | Rota | Descrição |
|---|---|---|
| GET | `/series` | Lista todas as séries |
| GET | `/series/{id}` | Detalhes de uma série |
| GET | `/series/top5` | Top 5 séries por avaliação |
| GET | `/series/lancamentos` | Últimas 2 séries adicionadas |
| GET | `/series/categoria/{genero}` | Séries por categoria |
| GET | `/series/{id}/temporadas/todas` | Todos os episódios de uma série |
| GET | `/series/{id}/temporadas/{numero}` | Episódios de uma temporada específica |

### Filmes
| Método | Rota | Descrição |
|---|---|---|
| GET | `/filmes` | Lista todos os filmes |
| GET | `/filmes/{id}` | Detalhes de um filme |
| GET | `/filmes/top5` | Top 5 filmes por avaliação |
| GET | `/filmes/lancamentos` | Últimos 2 filmes adicionados |
| GET | `/filmes/categoria/{genero}` | Filmes por categoria |

### Busca
| Método | Rota | Descrição |
|---|---|---|
| POST | `/buscar?titulo={titulo}` | Busca na OMDB, salva no banco e retorna o id |

---
