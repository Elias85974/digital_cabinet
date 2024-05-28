package org.austral.ing.lab1.model.livesIn;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.User;

import javax.persistence.*;

@Entity
@Table(name = "LIVES_IN")
public class LivesIn {
    @EmbeddedId
    private LivesInId vive_en_ID;

    @MapsId("usuarioId")
    @ManyToOne
    @JoinColumn(name = "USUARIO_ID")
    private User usuario;

    @MapsId("casaId")
    @ManyToOne
    @JoinColumn(name = "CASA_ID")
    private House casa;

    @Column(name = "Role")
    private boolean role;

    public LivesIn() { }

    private LivesIn(LivesInBuilder builder) {
        this.usuario = builder.usuario;
        this.casa = builder.casa;
        this.role = builder.role;
        this.vive_en_ID = builder.vive_en_ID;
    }

    public static LivesInBuilder create(User usuario, House casa, boolean role) {
        return new LivesInBuilder(usuario, casa, role);
    }

    public void setID(LivesInId id) {
        this.vive_en_ID = id;
    }

    public LivesInId getID() {
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

    public void setCasa(House house) {
        this.casa = house;
    }

    public static class LivesInBuilder {
        private final User usuario;
        private final House casa;
        private final boolean role;
        private final LivesInId vive_en_ID;

        public LivesInBuilder(User usuario, House casa, boolean role) {
            this.role = role;
            this.usuario = usuario;
            this.casa = casa;
            this.vive_en_ID = new LivesInId(usuario.getUsuario_ID(), casa.getCasa_ID());
        }

        public LivesIn build() {
            return new LivesIn(this);
        }
    }

}
