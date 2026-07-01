package com.tp.jpa.repository;

import com.tp.jpa.model.Producto;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            // JPQL: obtiene los productos activos de una categoria navegando la relacion unidireccional Categoria -> productos.
            String jpql = "SELECT p FROM Categoria c JOIN c.productos p " +
                    "WHERE c.id = :categoriaId AND p.eliminado = false";

            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("categoriaId", categoriaId);

            return query.getResultList();

        } finally {
            em.close();
        }
    }
}
