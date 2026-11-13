# Sistema de Gerenciamento de Biblioteca Universitária

## Integrantes
1.Eduardo Sampaio Azeredo 114.106

## Descrição
API REST desenvolvida em C# com ASP.NET Core Web API
para gerenciamento de materiais de uma biblioteca universitária.

## Tecnologias
- C#
- .NET 10
- ASP.NET Core Web API
- Swagger

## Funcionalidades
- Cadastro de livros e revistas
- Consulta de materiais
- Atualização de materiais
- Remoção de materiais
- Consulta de descrição e prazo de empréstimo
- Realização de empréstimos para livros
- Validação dos dados recebidos.

## Estrutura do projeto
- Controllers: endpoints da API
- Models: classes e interface do sistema
- Repositories: armazenamento e gerenciamento dos materiais.

## Regras de negócio
- Livros possuem prazo de empréstimo de 14 dias
- Revistas possuem prazo de empréstimo de 7 dias
- Apenas livros podem ser emprestados
- Os dados são armazenados em memória utilizando Dictionary.

## Como executar
1. Instale o .NET 10 SDK
2. Abra o terminal na pasta do projeto
3. Execute `dotnet restore`
4. Execute `dotnet run`
5. Acesse o Swagger pelo endereço HTTPS informado no terminal seguido de `/swagger`.

## Armazenamento
Os dados são armazenados em memória e reiniciados quando a aplicação é encerrada.