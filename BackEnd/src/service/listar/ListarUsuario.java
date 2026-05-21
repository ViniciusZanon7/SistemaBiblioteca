package BackEnd.src.service.listar;

import java.util.ArrayList;
import java.util.List;

public class ListarUsuario implements Listar {

    @Override
    public List<String> listar() {

        List<String> usuarios = new ArrayList<>();
        usuarios.add("getNomeUsuario");

        return usuarios;
    }
    
}
