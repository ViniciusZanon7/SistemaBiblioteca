package BackEnd.src.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBanco {

    public Connection conectar() throws SQLException {
        carregarDriver();

        String url = obterEnvObrigatoria("JDBC_DATABASE_URL");
        String usuario = obterEnvObrigatoria("DB_USER");
        String senha = obterEnvObrigatoria("DB_PASSWORD");

        return DriverManager.getConnection(url, usuario, senha);
    }

    private String obterEnvObrigatoria(String nome) throws SQLException {
        String valor = System.getenv(nome);

        if (valor == null || valor.isBlank()) {
            throw new SQLException("Variavel de ambiente obrigatoria nao definida: " + nome);
        }

        return valor;
    }

    private void carregarDriver() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver PostgreSQL nao encontrado", e);
        }
    }
}
