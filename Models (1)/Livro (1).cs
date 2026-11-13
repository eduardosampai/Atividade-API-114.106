namespace BibliotecaApi.Models
{
  public class  Livro : MaterialBiblioteca, IEmprestimo 
    {
        public string Autor {get; set; }
        public int Paginas {get; set;   }

        public override int CalcularPrazo()
        {
            return 14;

        }

        public override string Descricao()
        {
            return $"Livro: {Titulo}, Autor: {Autor}, Ano: {AnoPublicacao}, Paginas: {Paginas}";
        }

        public void Emprestar()
        {
            Console.WriteLine($"O livro {Titulo} foi emprestado");
        }
    }
    

}