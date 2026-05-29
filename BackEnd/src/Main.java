package BackEnd.src;

import BackEnd.src.database.ConexaoBanco;
import BackEnd.src.http.BibliotecaHandler;
import BackEnd.src.repository.BibliotecaRepository;
import BackEnd.src.repository.BibliotecaRepositoryJdbc;
import BackEnd.src.service.BibliotecaService;

import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        ConexaoBanco conexaoBanco = new ConexaoBanco();

        BibliotecaRepository repository = new BibliotecaRepositoryJdbc(conexaoBanco);
        BibliotecaService service = new BibliotecaService(repository);
        BibliotecaHandler handler = new BibliotecaHandler(service);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api", handler);

        server.start();

        System.out.println("Servidor rodando em http://localhost:8080/api");
    }
}