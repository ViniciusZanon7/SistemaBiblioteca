package BackEnd.src.service.cadastrar;

public class CadastrarLivro implements Cadastrar {

    @Override
    public void cadastro(String cadastroRealizado) {
        System.out.println("Livro cadastrado: " + cadastroRealizado);
    }
}
