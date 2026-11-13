using BibliotecaApi.Models;
using BibliotecaApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MateriaisController : ControllerBase
    {
        private readonly IMaterialRepository _repository;

        public MateriaisController(IMaterialRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Materiais
        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_repository.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var material = _repository.ObterPorId(id);

            if (material == null)
            {
                return NotFound(new { mensagem = "Material não encontrado." });
            }

            return Ok(material);
        }

       
        [HttpPost("livro")]
        public IActionResult AdicionarLivro(Livro livro)
        {
            if (string.IsNullOrWhiteSpace(livro.Titulo))
                return BadRequest(new { mensagem = "O título é obrigatório." });

            if (livro.AnoPublicacao < 0)
                return BadRequest(new { mensagem = "O ano de publicação não pode ser negativo." });

            if (string.IsNullOrWhiteSpace(livro.Autor))
                return BadRequest(new { mensagem = "O autor é obrigatório." });

            if (livro.Paginas <= 0)
                return BadRequest(new { mensagem = "O número de páginas deve ser maior que zero." });

            var novoLivro = _repository.Adicionar(livro);

            return Created($"/api/Materiais/{novoLivro.Id}", novoLivro);
        }

       
        [HttpPost("revista")]
        public IActionResult AdicionarRevista(Revista revista)
        {
            if (string.IsNullOrWhiteSpace(revista.Titulo))
                return BadRequest(new { mensagem = "O título é obrigatório." });

            if (revista.AnoPublicacao < 0)
                return BadRequest(new { mensagem = "O ano de publicação não pode ser negativo." });

            if (revista.Edicao <= 0)
                return BadRequest(new { mensagem = "A edição deve ser maior que zero." });

            if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
                return BadRequest(new { mensagem = "O mês deve estar entre 1 e 12." });

            var novaRevista = _repository.Adicionar(revista);

            return Created($"/api/Materiais/{novaRevista.Id}", novaRevista);
        }

       
        [HttpPut("livro/{id}")]
        public IActionResult AtualizarLivro(int id, Livro livro)
        {
            if (string.IsNullOrWhiteSpace(livro.Titulo))
                return BadRequest(new { mensagem = "O título é obrigatório." });

            if (livro.AnoPublicacao < 0)
                return BadRequest(new { mensagem = "O ano de publicação não pode ser negativo." });

            if (string.IsNullOrWhiteSpace(livro.Autor))
                return BadRequest(new { mensagem = "O autor é obrigatório." });

            if (livro.Paginas <= 0)
                return BadRequest(new { mensagem = "O número de páginas deve ser maior que zero." });

            if (!_repository.Atualizar(id, livro))
            {
                return NotFound(new { mensagem = "Livro não encontrado." });
            }

            return NoContent();
        }

    
        [HttpPut("revista/{id}")]
        public IActionResult AtualizarRevista(int id, Revista revista)
        {
            if (string.IsNullOrWhiteSpace(revista.Titulo))
                return BadRequest(new { mensagem = "O título é obrigatório." });

            if (revista.AnoPublicacao < 0)
                return BadRequest(new { mensagem = "O ano de publicação não pode ser negativo." });

            if (revista.Edicao <= 0)
                return BadRequest(new { mensagem = "A edição deve ser maior que zero." });

            if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
                return BadRequest(new { mensagem = "O mês deve estar entre 1 e 12." });

            if (!_repository.Atualizar(id, revista))
            {
                return NotFound(new { mensagem = "Revista não encontrada." });
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public IActionResult Remover(int id)
        {
            if (!_repository.Remover(id))
            {
                return NotFound(new { mensagem = "Material não encontrado." });
            }

            return NoContent();
        }

        
        [HttpGet("{id}/descricao")]
        public IActionResult ObterDescricao(int id)
        {
            var material = _repository.ObterPorId(id);

            if (material == null)
            {
                return NotFound(new { mensagem = "Material não encontrado." });
            }

            return Ok(new
            {
                id = material.Id,
                tipo = material.GetType().Name,
                descricao = material.Descricao(),
                prazoEmprestimoDias = material.CalcularPrazo()
            });
        }

      
        [HttpPost("{id}/emprestar")]
        public IActionResult Emprestar(int id)
        {
            var material = _repository.ObterPorId(id);

            if (material == null)
            {
                return NotFound(new { mensagem = "Material não encontrado." });
            }

            if (material is not IEmprestimo emprestimo)
            {
                return BadRequest(new
                {
                    mensagem = "Este material não pode ser emprestado."
                });
            }

            emprestimo.Emprestar();

            return Ok(new { mensagem = "Empréstimo realizado com sucesso." });
        }
    }
}