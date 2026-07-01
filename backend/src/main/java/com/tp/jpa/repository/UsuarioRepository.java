package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }

    public Optional<Usuario> buscarPorMail(String mail) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // JPQL: busca un usuario activo por mail.
            String jpql = "SELECT u FROM Usuario u " +
                    "WHERE u.mail = :mail AND u.eliminado = false";

            TypedQuery<Usuario> query = em.createQuery(jpql, Usuario.class);
            query.setParameter("mail", mail);

            List<Usuario> resultado = query.getResultList();

            return resultado.isEmpty()
                    ? Optional.empty()
                    : Optional.of(resultado.get(0));

        } finally {
            em.close();
        }
    }

    public List<Pedido> buscarPedidosPorUsuario(Long idUsuario) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // JPQL: lista los pedidos activos asociados a un usuario navegando Usuario.pedidos.
            String jpql = "SELECT p FROM Usuario u JOIN u.pedidos p " +
                    "WHERE u.id = :uid AND p.eliminado = false";

            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("uid", idUsuario);

            return query.getResultList();

        } finally {
            em.close();
        }
    }
}