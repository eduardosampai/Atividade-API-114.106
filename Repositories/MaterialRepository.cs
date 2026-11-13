
using BibliotecaApi.Models;

namespace BibliotecaApi.Repositories;

public class MaterialRepository : IMaterialRepository
{
    private readonly Dictionary<int, MaterialBiblioteca> _materiais = new();

    private int _proximoId = 1;

    public MaterialRepository()
    {
        Adicionar(new Livro
        {
            Titulo = "A Vingança dos Sith",
            AnoPublicacao = 2005,
            Autor = "Matthew Stover",
            Paginas = 432
        });

        Adicionar(new Revista
        {
            Titulo = "Placar",
            AnoPublicacao = 2025,
            Edicao = 1,
            MesPublicacao = 5
        });
    }

    private int GerarNovoId()
    {
        return _proximoId++;
    }

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

    public MaterialBiblioteca? ObterPorId(int id)
    {
        return _materiais.TryGetValue(id, out var material)
            ? material
            : null;
    }

    public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
    {
        material.Id = GerarNovoId();

        _materiais[material.Id] = material;

        return material;
    }

    public bool Atualizar(int id, MaterialBiblioteca material)
    {
        if (!_materiais.ContainsKey(id))
            return false;

        material.Id = id;

        _materiais[id] = material;

        return true;
    }

    public bool Remover(int id)
    {
        return _materiais.Remove(id);
    }
}
