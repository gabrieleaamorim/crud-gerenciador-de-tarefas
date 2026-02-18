# 📝 API de Gerenciamento de Tarefas

API REST desenvolvida em **Node.js puro** (sem frameworks) para gerenciar tarefas (tasks) com operações CRUD completas.

> ℹ️ **Escopo do projeto:** o foco principal deste desafio é o **backend** (API, regras e persistência). A interface em React foi criada com apoio do **GitHub Copilot** apenas para facilitar visualização e testes manuais dos endpoints.

## 🌍 English Note

This challenge is primarily **backend-focused** (API design, business rules, and persistence in Node.js). The React frontend was created with **GitHub Copilot** support only to provide a simple UI for visualization and manual API testing.

## 🚀 Funcionalidades

- ✅ Criar tarefas
- ✅ Listar todas as tarefas
- ✅ Buscar tarefa por ID
- ✅ Buscar tarefas por título ou descrição
- ✅ Atualizar tarefas
- ✅ Remover tarefas
- ✅ Marcar/desmarcar tarefas como concluídas
- ✅ Importação de tarefas via arquivo CSV

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v20+)
- **HTTP nativo** do Node.js (sem Express)
- **File System (fs)** para persistência em JSON
- **csv-parse** para importação de CSV

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd desafio-crud-api

# Instale as dependências
npm install
```

## 🎯 Como Usar

### Iniciar o servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em: `http://localhost:3333`

### Iniciar o Frontend (React)

O projeto possui uma interface em React na pasta `frontend/`, criada com apoio do **GitHub Copilot** como camada de visualização da API.

Em um segundo terminal, execute:

```bash
# instalar dependências do frontend (apenas na primeira vez)
cd frontend
npm install

# iniciar frontend
npm run dev
```

Ou, a partir da raiz do projeto:

```bash
npm run frontend:dev
```

Frontend disponível em: `http://localhost:5173`

> O frontend usa proxy do Vite para a API (`/tasks -> http://localhost:3333`), então você deve manter o backend rodando em paralelo.

### Rodar backend + frontend com um comando

Na raiz do projeto, execute:

```bash
npm run dev:all
```

Esse comando inicia:
- Backend em `http://localhost:3333`
- Frontend em `http://localhost:5173`

### Importar tarefas via CSV

1. Edite o arquivo `tasks.csv` na raiz do projeto seguindo o formato:

```csv
title,description
Minha tarefa,Descrição da tarefa
Outra tarefa,Outra descrição
```

2. Com o servidor rodando, execute em outro terminal:

```bash
npm run import
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3333
```

### Endpoints

#### 1️⃣ Criar uma tarefa

```http
POST /tasks
Content-Type: application/json

{
  "title": "Estudar Node.js",
  "description": "Aprender sobre streams e módulos nativos"
}
```

**Resposta:** `201 Created`

---

#### 2️⃣ Listar todas as tarefas

```http
GET /tasks
```

**Resposta:** `200 OK`
```json
[
  {
    "id": "uuid-aqui",
    "title": "Estudar Node.js",
    "description": "Aprender sobre streams e módulos nativos",
    "completed_at": null,
    "created_at": "2026-02-10T10:00:00.000Z",
    "updated_at": "2026-02-10T10:00:00.000Z"
  }
]
```

---

#### 3️⃣ Buscar tarefas (por título ou descrição)

```http
GET /tasks?search=node
```

**Resposta:** `200 OK` (retorna tarefas que contêm "node" no título ou descrição)

---

#### 4️⃣ Buscar tarefa por ID

```http
GET /tasks/:id
```

**Resposta:** 
- `200 OK` - Tarefa encontrada
- `404 Not Found` - Tarefa não existe

---

#### 5️⃣ Atualizar uma tarefa

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Estudar Node.js avançado",
  "description": "Aprender sobre workers e clusters"
}
```

**Resposta:** 
- `204 No Content` - Tarefa atualizada
- `404 Not Found` - Tarefa não existe

---

#### 6️⃣ Marcar/Desmarcar tarefa como concluída

```http
PATCH /tasks/:id/complete
```

**Comportamento:**
- Se a tarefa estiver **pendente**, marca como **concluída** (define `completed_at` com a data/hora atual)
- Se a tarefa estiver **concluída**, marca como **pendente** (define `completed_at` como `null`)

**Resposta:** 
- `204 No Content` - Status alterado
- `404 Not Found` - Tarefa não existe

---

#### 7️⃣ Remover uma tarefa

```http
DELETE /tasks/:id
```

**Resposta:** 
- `204 No Content` - Tarefa removida
- `404 Not Found` - Tarefa não existe

---

## 📁 Estrutura do Projeto

```
desafio-crud-api/
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Interface React do CRUD
│   │   ├── App.css           # Estilos da interface
│   │   ├── index.css         # Estilos globais
│   │   └── main.jsx          # Entrada da aplicação React
│   ├── vite.config.js        # Configuração Vite + proxy para API
│   └── package.json
├── src/
│   ├── middleware/
│   │   └── json.js           # Middleware para parsing de JSON
│   ├── utils/
│   │   ├── build-route-path.js    # Cria regex para rotas dinâmicas
│   │   └── extract-route-path.js  # Extrai query strings
│   ├── database.js           # Gerenciamento do banco de dados (JSON)
│   ├── routes.js             # Definição de todas as rotas
│   ├── server.js             # Servidor HTTP
│   └── import-tasks.js       # Script de importação CSV
├── db.json                   # Banco de dados (gerado automaticamente)
├── tasks.csv                 # Arquivo CSV para importação
├── package.json
└── README.md
```

## 🖥️ Funcionalidades do Frontend

- ✅ Criar tarefa
- ✅ Listar tarefas
- ✅ Buscar tarefas por texto
- ✅ Editar tarefa
- ✅ Marcar/desmarcar como concluída
- ✅ Excluir tarefa

## 🗂️ Banco de Dados

O projeto utiliza um arquivo `db.json` para persistência de dados. Ele é criado automaticamente na primeira execução.

**Estrutura do db.json:**
```json
{
  "tasks": [
    {
      "id": "uuid-gerado-automaticamente",
      "title": "Título da tarefa",
      "description": "Descrição da tarefa",
      "completed_at": null,
      "created_at": "2026-02-10T10:00:00.000Z",
      "updated_at": "2026-02-10T10:00:00.000Z"
    }
  ]
}
```

## 🧪 Testando a API

Você pode testar a API usando:
- **Postman**
- **Insomnia**
- **Thunder Client** (extensão VS Code)
- **cURL**

### Exemplo com cURL:

```bash
# Criar tarefa
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha tarefa","description":"Descrição"}'

# Listar tarefas
curl http://localhost:3333/tasks

# Marcar como concluída
curl -X PATCH http://localhost:3333/tasks/{id}/complete
```

## 📝 Validações Implementadas

- ✅ **POST /tasks**: Verifica se `title` e `description` existem no body
- ✅ **GET /tasks/:id**: Verifica se a tarefa existe
- ✅ **PUT /tasks/:id**: Verifica se a tarefa existe antes de atualizar
- ✅ **PATCH /tasks/:id/complete**: Verifica se a tarefa existe
- ✅ **DELETE /tasks/:id**: Verifica se a tarefa existe antes de remover

## 🔥 Funcionalidades Avançadas

### Busca com Query String
```http
GET /tasks?search=estudar
```
Retorna todas as tarefas que contêm "estudar" no título ou descrição (busca case-insensitive).

### Importação em Massa
O script de importação:
1. Lê o arquivo `tasks.csv`
2. Faz requisições HTTP POST para cada linha
3. Exibe progresso em tempo real
4. Mostra resumo ao final

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ usando Node.js puro**
