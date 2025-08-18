package com.example.demo.repositories;

import com.example.demo.entities.User;
import com.example.demo.entities.UserPlace;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserPlaceRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserPlaceRepository userPlaceRepository;

    private User testUser;
    private UserPlace testPlace;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .nom("Test User")
                .email("test@example.com")
                .motDePasse("password")
                .role("USER")
                .build();
        testUser = entityManager.persistAndFlush(testUser);

        testPlace = new UserPlace();
        testPlace.setName("Test Place");
        testPlace.setCategory("Restaurant");
        testPlace.setAddressLine("123 Test Street");
        testPlace.setCity("Paris");
        testPlace.setPostalCode("75001");
        testPlace.setCountry("France");
        testPlace.setShortDescription("A nice place");
        testPlace.setCreatedBy(testUser);
        testPlace.setStatus(UserPlace.Status.APPROVED);
    }

    @Test
    void findByIdAndCreatedBy_Id_ShouldReturnPlace_WhenOwner() {
        UserPlace saved = entityManager.persistAndFlush(testPlace);

        Optional<UserPlace> found = userPlaceRepository.findByIdAndCreatedBy_Id(saved.getId(), testUser.getId());

        assertTrue(found.isPresent());
        assertEquals("Test Place", found.get().getName());
    }

    @Test
    void findByIdAndCreatedBy_Id_ShouldReturnEmpty_WhenNotOwner() {
        UserPlace saved = entityManager.persistAndFlush(testPlace);

        Optional<UserPlace> found = userPlaceRepository.findByIdAndCreatedBy_Id(saved.getId(), 999L);
        assertTrue(found.isEmpty());
    }

    @Test
    void findAllByCreatedBy_Id_ShouldReturnUserPlaces() {
        entityManager.persistAndFlush(testPlace);

        List<UserPlace> places = userPlaceRepository.findAllByCreatedBy_Id(testUser.getId());

        assertEquals(1, places.size());
        assertEquals("Test Place", places.get(0).getName());
    }

    @Test
    void findAllByStatus_ShouldReturnApprovedPlaces() {
        entityManager.persistAndFlush(testPlace);

        Page<UserPlace> places = userPlaceRepository.findAllByStatus(
                UserPlace.Status.APPROVED,
                PageRequest.of(0, 10)
        );

        assertEquals(1, places.getContent().size());
        assertEquals("Test Place", places.getContent().get(0).getName());
    }

    @Test
    void findAllByStatusOrderByCreatedAtDesc_ShouldReturnPlacesOrderedByDate() {
        entityManager.persistAndFlush(testPlace);

        Page<UserPlace> places = userPlaceRepository.findAllByStatusOrderByCreatedAtDesc(
                UserPlace.Status.APPROVED,
                PageRequest.of(0, 10)
        );

        assertEquals(1, places.getContent().size());
    }

    @Test
    void findAllByStatusAndCityAndCategory_ShouldFilterCorrectly() {
        entityManager.persistAndFlush(testPlace);

        Page<UserPlace> places = userPlaceRepository.findAllByStatusAndCityIgnoreCaseContainingAndCategoryIgnoreCaseContainingOrderByCreatedAtDesc(
                UserPlace.Status.APPROVED,
                "Paris",
                "Restaurant",
                PageRequest.of(0, 10)
        );

        assertEquals(1, places.getContent().size());
        assertEquals("Test Place", places.getContent().get(0).getName());
    }

    @Test
    void save_ShouldPersistUserPlace() {
        UserPlace saved = userPlaceRepository.save(testPlace);

        assertNotNull(saved.getId());
        assertEquals("Test Place", saved.getName());
        assertEquals(testUser.getId(), saved.getCreatedBy().getId());
    }
}