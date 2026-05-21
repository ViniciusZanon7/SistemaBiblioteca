package BackEnd.src.service.listar;

import java.util.ArrayList;
import java.util.List;

public class ListarLivro implements Listar {

    @Override
    public List<String> listar() {

    List<String> livros = new ArrayList<>();
    livros.add("getTituloLivro");
    
    return livros;
    
    }
}
