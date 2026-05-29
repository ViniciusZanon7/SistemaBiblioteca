package BackEnd.src.http;

import BackEnd.src.model.Livro;
import BackEnd.src.model.Usuario;
import BackEnd.src.service.BibliotecaService;
import BackEnd.src.util.JsonUtil;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class BibliotecaHandler implements HttpHandler {

    private final BibliotecaService service;

    public BibliotecaHandler(BibliotecaService service) {
        this.service = service;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            if (exchange.getRequestMethod().equals("OPTIONS")) {
                responder(exchange, 204, "");
                return;
            }

            String metodo = exchange.getRequestMethod();
            String caminho = exchange.getRequestURI().getPath().replace("/api", "");

            if (metodo.equals("GET") && caminho.equals("/livros")) {
                responder(exchange, 200, JsonUtil.livrosParaJson(service.listarLivros()));
                return;
            }

            if (metodo.equals("POST") && caminho.equals("/livros")) {
                Livro livro = JsonUtil.jsonParaLivro(lerBody(exchange));
                service.cadastrarLivro(livro);
                responder(exchange, 201, "{\"mensagem\":\"Livro cadastrado com sucesso\"}");
                return;
            }

            if (metodo.equals("PUT") && caminho.matches("/livros/\\d+")) {
                long id = pegarId(caminho);
                Livro livro = JsonUtil.jsonParaLivro(lerBody(exchange));
                service.atualizarLivro(id, livro);
                responder(exchange, 200, "{\"mensagem\":\"Livro atualizado com sucesso\"}");
                return;
            }

            if (metodo.equals("DELETE") && caminho.matches("/livros/\\d+")) {
                long id = pegarId(caminho);
                service.excluirLivro(id);
                responder(exchange, 200, "{\"mensagem\":\"Livro excluido com sucesso\"}");
                return;
            }

            if (metodo.equals("GET") && caminho.matches("/livros/\\d+/disponivel")) {
                long id = pegarId(caminho);
                boolean disponivel = service.livroDisponivel(id);
                responder(exchange, 200, "{\"disponivel\":" + disponivel + "}");
                return;
            }

            if (metodo.equals("GET") && caminho.equals("/usuarios")) {
                responder(exchange, 200, JsonUtil.usuariosParaJson(service.listarUsuarios()));
                return;
            }

            if (metodo.equals("POST") && caminho.equals("/usuarios")) {
                Usuario usuario = JsonUtil.jsonParaUsuario(lerBody(exchange));
                service.cadastrarUsuario(usuario);
                responder(exchange, 201, "{\"mensagem\":\"Usuario cadastrado com sucesso\"}");
                return;
            }

            if (metodo.equals("GET") && caminho.equals("/emprestimos")) {
                responder(exchange, 200, JsonUtil.emprestimosParaJson(service.listarHistorico()));
                return;
            }

            if (metodo.equals("GET") && caminho.equals("/emprestimos/atrasados")) {
                responder(exchange, 200, JsonUtil.emprestimosParaJson(service.listarAtrasados()));
                return;
            }

            if (metodo.equals("POST") && caminho.equals("/emprestimos")) {
                String body = lerBody(exchange);
                long usuarioId = JsonUtil.lerLong(body, "usuarioId");
                long livroId = JsonUtil.lerLong(body, "livroId");

                service.registrarEmprestimo(usuarioId, livroId);
                responder(exchange, 201, "{\"mensagem\":\"Emprestimo registrado com sucesso\"}");
                return;
            }

            if (metodo.equals("PUT") && caminho.matches("/emprestimos/\\d+/devolver")) {
                long id = pegarId(caminho);
                service.registrarDevolucao(id);
                responder(exchange, 200, "{\"mensagem\":\"Devolucao registrada com sucesso\"}");
                return;
            }

            responder(exchange, 404, "{\"erro\":\"Endpoint nao encontrado\"}");
        } catch (IllegalArgumentException erro) {
            responder(exchange, 400, "{\"erro\":\"" + erro.getMessage() + "\"}");
        } catch (Exception erro) {
            responder(exchange, 500, "{\"erro\":\"Erro interno: " + erro.getMessage() + "\"}");
        }
    }

    private String lerBody(HttpExchange exchange) throws IOException {
        return new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
    }

    private long pegarId(String caminho) {
        String[] partes = caminho.split("/");
        return Long.parseLong(partes[2]);
    }

    private void responder(HttpExchange exchange, int status, String resposta) throws IOException {
        byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        exchange.sendResponseHeaders(status, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }
}