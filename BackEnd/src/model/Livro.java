package BackEnd.src.model;

public class Livro {
    private long id;
    private String titulo;
    private String autor;
    private String editora;
    private int quantidade;
    private int anoPublicacao;
    private String genero;

    public Livro(long id, String titulo, String autor, String editora, int quantidade, int anoPublicacao, String genero) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.quantidade = quantidade;
        this.anoPublicacao = anoPublicacao;
        this.genero = genero;
    }

    public long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getAutor() {
        return autor;
    }

    public String getEditora() {
        return editora;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public int getAnoPublicacao() {
        return anoPublicacao;
    }

    public String getGenero() {
        return genero;
    }
}