package BackEnd.model;

public class Livro {

    private String nomeAutor;
    private String tituloLivro;
    private String editora;
    private int anoPublicacao;

    public Livro(String nomeAutor, String tituloLivro, String editora, int anoPublicacao) {
        this.nomeAutor = nomeAutor;
        this.tituloLivro = tituloLivro;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
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
    public int getAnoPublicacao() {
        return anoPublicacao;
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
    public void setAnoPublicacao(int anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

}
