package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "LIVES_IN")
public class LivesIn {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long vive_en_ID;

    @ManyToOne
    @JoinColumn(name = "USUARIO_ID")
    private User usuario;

    @OneToOne
    @JoinColumn(name = "CASA_ID")
    private House casa;

    @Column(name = "Role")
    private boolean role;

    public LivesIn() { }

    private LivesIn(LivesInBuilder builder) {
        this.usuario = builder.usuario;
        this.casa = builder.casa;
        this.role = builder.role;
    }

    public static LivesInBuilder create(User usuario, House casa, boolean role) {
        return new LivesInBuilder(usuario, casa, role);
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

    public House getCasa() {
        return casa;
    }

    public LivesIn getLivesIn() {
        return this;
    }

    public boolean isAdmin() {return role;}

    public static class LivesInBuilder {
        private final User usuario;
        private final House casa;
        private final boolean role;

        public LivesInBuilder(User usuario, House casa, boolean role) {
            this.role = role;
            this.usuario = usuario;
            this.casa = casa;
        }

        public LivesIn build() {
            return new LivesIn(this);
        }
    }

}
