package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "VIVE_EN")
public class LivesIn {

    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long vive_en_ID;

    @OneToOne
    @JoinColumn(name = "USUARIO_ID")
    private User usuario;

    @OneToOne
    @JoinColumn(name = "CASA_ID")
    private House casa;

    public LivesIn() { }

    public static LivesInBuilder create(User usuario, House casa) {
        return new LivesInBuilder(usuario, casa);
    }

    private LivesIn(LivesInBuilder builder) {
        this.usuario = builder.usuario;
        this.casa = builder.casa;
    }

    public void setID(Long id) {
        this.vive_en_ID = id;
    }

    public Long getID() {
        return vive_en_ID;
    }


    public Long getUsuario_ID() {
        return usuario.getUsuario_ID();
    }

    public Long getCasa_ID() {
        return casa.getCasa_ID();
    }

    public LivesIn getLivesIn() {
        return this;
    }

    public static class LivesInBuilder {
        private final User usuario;
        private final House casa;

        public LivesInBuilder(User usuario, House casa) {
            this.usuario = usuario;
            this.casa = casa;
        }

        public LivesIn build() {
            return new LivesIn(this);
        }
    }

}
