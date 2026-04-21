package br.com.markFilmes.service;

public interface IConverteDados {
    <T> T obterDados(String json, Class<T> classe);

}
