
const API_URL = "https://localhost:7000/api/Materiais";

const lista = document.querySelector("#listaMateriais");
const mensagem = document.querySelector("#mensagem");
const formulario = document.querySelector("#formCadastro");
const tipo = document.querySelector("#tipoMaterial");

let materiais = [];

// Mostra mensagens na tela
function mostrarMensagem(texto, tipoMensagem) {
    mensagem.textContent = texto;
    mensagem.className = `alert alert-${tipoMensagem}`;
}

async function carregarMateriais() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar materiais.");
        }

        materiais = await resposta.json();

        mostrarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

function mostrarMateriais() {
    lista.innerHTML = "";

    materiais.forEach(material => {
        const ehLivro = material.autor !== undefined;

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${material.id}</td>
            <td>${material.titulo}</td>
            <td>${material.anoPublicacao}</td>
            <td>${ehLivro ? "Livro" : "Revista"}</td>
            <td>${ehLivro ? material.autor : material.edicao}</td>
            <td>
                <button class="btn btn-info btn-sm"
                    onclick="consultarDetalhes(${material.id})">
                    Consultar
                </button>

                <button class="btn btn-warning btn-sm"
                    onclick="editarMaterial(${material.id})">
                    Editar
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="excluirMaterial(${material.id})">
                    Excluir
                </button>

                ${ehLivro ? `
                    <button class="btn btn-success btn-sm"
                        onclick="emprestarLivro(${material.id})">
                        Emprestar
                    </button>
                ` : ""}
            </td>
        `;

        lista.appendChild(linha);
    });

    atualizarDashboard();
}

function atualizarDashboard() {
    const livros = materiais.filter(m => m.autor !== undefined).length;
    const revistas = materiais.length - livros;

    document.querySelector("#totalMateriais").textContent = materiais.length;
    document.querySelector("#totalLivros").textContent = livros;
    document.querySelector("#totalRevistas").textContent = revistas;
}

tipo.addEventListener("change", function () {
    const livro = tipo.value === "livro";

    document.querySelector("#camposLivro").classList.toggle("d-none", !livro);
    document.querySelector("#camposRevista").classList.toggle("d-none", livro);

    document.querySelector("#autor").required = livro;
    document.querySelector("#paginas").required = livro;
    document.querySelector("#edicao").required = !livro;
    document.querySelector("#mesPublicacao").required = !livro;
});

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const livro = tipo.value === "livro";

    const material = {
        titulo: document.querySelector("#titulo").value.trim(),
        anoPublicacao: Number(document.querySelector("#anoPublicacao").value)
    };

    if (livro) {
        material.autor = document.querySelector("#autor").value.trim();
        material.paginas = Number(document.querySelector("#paginas").value);
    } else {
        material.edicao = Number(document.querySelector("#edicao").value);
        material.mesPublicacao = Number(document.querySelector("#mesPublicacao").value);
    }

    if (!material.titulo || material.anoPublicacao < 0) {
        mostrarMensagem("Preencha os campos corretamente.", "warning");
        return;
    }

    if (livro && (!material.autor || material.paginas <= 0)) {
        mostrarMensagem("Informe autor e páginas válidos.", "warning");
        return;
    }

    if (!livro && (material.edicao <= 0 || material.mesPublicacao < 1 || material.mesPublicacao > 12)) {
        mostrarMensagem("Informe edição e mês válidos.", "warning");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${tipo.value}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(material)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar material.");
        }

        mostrarMensagem("Material cadastrado com sucesso!", "success");
        formulario.reset();
        tipo.dispatchEvent(new Event("change"));
        carregarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
});

async function editarMaterial(id) {
    const material = materiais.find(m => m.id === id);

    if (!material) return;

    const livro = material.autor !== undefined;
    const novoTitulo = prompt("Novo título:", material.titulo);

    if (novoTitulo === null) return;

    const novoAno = Number(prompt("Novo ano:", material.anoPublicacao));

    if (!novoTitulo.trim() || !Number.isInteger(novoAno) || novoAno < 0) {
        mostrarMensagem("Dados inválidos.", "warning");
        return;
    }

    const dados = {
        titulo: novoTitulo.trim(),
        anoPublicacao: novoAno
    };

    if (livro) {
        dados.autor = prompt("Novo autor:", material.autor);
        dados.paginas = Number(prompt("Número de páginas:", material.paginas));

        if (!dados.autor || dados.paginas <= 0) {
            mostrarMensagem("Dados do livro inválidos.", "warning");
            return;
        }
    } else {
        dados.edicao = Number(prompt("Nova edição:", material.edicao));
        dados.mesPublicacao = Number(prompt("Novo mês:", material.mesPublicacao));

        if (dados.edicao <= 0 || dados.mesPublicacao < 1 || dados.mesPublicacao > 12) {
            mostrarMensagem("Dados da revista inválidos.", "warning");
            return;
        }
    }

    try {
        const resposta = await fetch(`${API_URL}/${livro ? "livro" : "revista"}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) throw new Error("Erro ao editar material.");

        mostrarMensagem("Material atualizado!", "success");
        carregarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function excluirMaterial(id) {
    if (!confirm("Deseja excluir este material?")) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Erro ao excluir material.");

        mostrarMensagem("Material excluído!", "success");
        carregarMateriais();

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function consultarDetalhes(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}/descricao`);

        if (!resposta.ok) throw new Error("Material não encontrado.");

        const dados = await resposta.json();

        document.querySelector("#detalhesMaterial").textContent =
            `Tipo: ${dados.tipo} | ${dados.descricao} | Prazo: ${dados.prazoEmprestimoDias} dias`;

        document.querySelector("#secaoDetalhes").classList.remove("d-none");

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

async function emprestarLivro(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}/emprestar`, {
            method: "POST"
        });

        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.mensagem || "Erro no empréstimo.");

        mostrarMensagem(dados.mensagem, "success");

    } catch (erro) {
        mostrarMensagem(erro.message, "danger");
    }
}

document.querySelector("#btnAtualizar").addEventListener("click", carregarMateriais);

document.querySelector("#fecharDetalhes").addEventListener("click", function () {
    document.querySelector("#secaoDetalhes").classList.add("d-none");
});

carregarMateriais();
