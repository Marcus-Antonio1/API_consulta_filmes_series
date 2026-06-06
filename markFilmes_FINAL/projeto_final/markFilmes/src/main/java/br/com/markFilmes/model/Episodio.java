package br.com.markFilmes.model;

import jakarta.persistence.*;

@Entity
@Table(name = "episodios")
public class Episodio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer temporada;
    private String titulo;
    private Integer numeroEpisodio;

    @ManyToOne
    @JoinColumn(name = "serie_id")
    private Serie serie;

    public Episodio() {}

    public Episodio(Integer temporada, DadosEpisodio d) {
        this.temporada = temporada;
        this.titulo = d.titulo();
        this.numeroEpisodio = d.numeroEpisodio();
    }

    public Long getId() { return id; }
    public Integer getTemporada() { return temporada; }
    public void setTemporada(Integer t) { this.temporada = t; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String t) { this.titulo = t; }
    public Integer getNumeroEpisodio() { return numeroEpisodio; }
    public void setNumeroEpisodio(Integer n) { this.numeroEpisodio = n; }
    public Serie getSerie() { return serie; }
    public void setSerie(Serie s) { this.serie = s; }
}
