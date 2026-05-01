package br.com.markFilmes.model;

public enum Categoria {
    ACAO("Action", "acao"),
    ROMANCE("Romance", "romance"),
    COMEDIA("Comedy", "comedia"),
    DRAMA("Drama", "drama"),
    CRIME("Crime", "crime"),
    AVENTURA("Adventure", "aventura");

    private final String categoriaOmdb;
    private final String categoriaPortugues;

    Categoria(String categoriaOmdb, String categoriaPortugues) {
        this.categoriaOmdb = categoriaOmdb;
        this.categoriaPortugues = categoriaPortugues;
    }

    /** Converte nome em ingles vindo da OMDB */
    public static Categoria fromString(String text) {
        for (Categoria c : Categoria.values()) {
            if (c.categoriaOmdb.equalsIgnoreCase(text)) return c;
        }
        throw new IllegalArgumentException("Categoria nao encontrada: " + text);
    }

    public static Categoria fromPortugues(String text) {
        for (Categoria c : Categoria.values()) {
            if (c.categoriaPortugues.equalsIgnoreCase(text.trim())) return c;
        }
        throw new IllegalArgumentException("Categoria nao encontrada: " + text);
    }
}
