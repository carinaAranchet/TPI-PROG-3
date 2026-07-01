package com.tp.jpa.repository;

import com.tp.jpa.model.Base;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

public abstract class BaseRepository<T extends Base> {

    private final Class<T> entityClass;
    private final EntityManagerFactory emf;

    public BaseRepository(Class<T> entityClass) {
        this.entityClass = entityClass;
        this.emf = JPAUtil.getEntityManagerFactory();
    }

    public T guardar(T entity) {
        EntityManager em = emf.createEntityManager();

        try {
            em.getTransaction().begin();

            T entidadGuardada;

            if (entity.getId() == null) {
                em.persist(entity);
                entidadGuardada = entity;
            } else {
                entidadGuardada = em.merge(entity);
            }

            em.getTransaction().commit();
            return entidadGuardada;

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;

        } finally {
            em.close();
        }
    }

    public Optional<T> buscarPorId(Long id) {
        EntityManager em = emf.createEntityManager();

        try {
            T entidad = em.find(entityClass, id);
            return Optional.ofNullable(entidad);

        } finally {
            em.close();
        }
    }

    public List<T> listarActivos() {
        EntityManager em = emf.createEntityManager();

        try {
            // JPQL generico: lista solamente entidades activas, filtrando por baja logica.
            String jpql = "SELECT e FROM " + entityClass.getSimpleName() +
                    " e WHERE e.eliminado = false";

            TypedQuery<T> query = em.createQuery(jpql, entityClass);
            return query.getResultList();

        } finally {
            em.close();
        }
    }

    public boolean eliminarLogico(Long id) {
        EntityManager em = emf.createEntityManager();

        try {
            em.getTransaction().begin();

            T entidad = em.find(entityClass, id);

            if (entidad == null || entidad.isEliminado()) {
                em.getTransaction().rollback();
                return false;
            }

            entidad.setEliminado(true);

            em.getTransaction().commit();
            return true;

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;

        } finally {
            em.close();
        }
    }
}
