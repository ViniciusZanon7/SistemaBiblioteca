package BackEnd.service.cadastrar;

public class CadastrarUsuario implements Cadastrar {

    @Override
    public void cadastro(String cadastroRealizado) {
        System.out.println("Usuário cadastrado: " + cadastroRealizado);
    }
    
}
