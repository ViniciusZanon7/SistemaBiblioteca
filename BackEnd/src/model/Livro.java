package BackEnd.src.model;

public class Livro {

    private String nomeAutor;
    private String tituloLivro;
    private String editora;
    private int quantidade;
    private int anoPublicacao;
    private GeneroLivro generoLivro;

    public Livro(String nomeAutor, String tituloLivro, String editora, int quantidade, int anoPublicacao, GeneroLivro generoLivro) {
        this.nomeAutor = nomeAutor;
        this.tituloLivro = tituloLivro;
        this.editora = editora;
        this.quantidade = quantidade;
        this.anoPublicacao = anoPublicacao;
        this.generoLivro = generoLivro;
    }
    public String getNomeAutor() {
        return nomeAutor;
    }
    public String getTituloLivro() {
        return tituloLivro;
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
    public GeneroLivro getGeneroLivro() {
        return generoLivro;
    }
    public void setNomeAutor(String nomeAutor) {
        this.nomeAutor = nomeAutor;
    }
    public void setTituloLivro(String tituloLivro) {
        this.tituloLivro = tituloLivro;
    }
    public void setEditora(String editora) {
        this.editora = editora;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
    public void setAnoPublicacao(int anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }
    public void setGeneroLivro(GeneroLivro generoLivro) {
        this.generoLivro = generoLivro;
    }

}
