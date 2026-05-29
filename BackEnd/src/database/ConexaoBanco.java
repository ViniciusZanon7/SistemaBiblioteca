package BackEnd.src.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBanco {

    public Connection conectar() throws SQLException {
        String url = "jdbc:postgresql://banco:5432/meu_banco";
        String usuario = "usuario_banco";
        String senha = "senha_banco";

        return DriverManager.getConnection(url, usuario, senha);

        
    }
    
}
