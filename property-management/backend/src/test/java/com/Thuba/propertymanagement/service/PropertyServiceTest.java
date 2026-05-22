package com.Thuba.propertymanagement.service;

import com.Thuba.propertymanagement.dto.PropertyDto;
import com.Thuba.propertymanagement.model.Property;
import com.Thuba.propertymanagement.model.PropertyImage;
import com.Thuba.propertymanagement.model.PropertyStatus;
import com.Thuba.propertymanagement.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    //Mock the dependencies (fake objects that don't do real work)
    @Mock
    private PropertyRepository repo;

    @Mock
    private S3Client s3Client;

    // Inject the Mocks into the real service
    @InjectMocks
    private PropertyService propertyService;

    // Reusable test objects
    private Property testProperty;
    private PropertyDto testDto;

    //@BeforeEach runs BEFORE every single test to give us a fresh slate
    @BeforeEach
    void setUp() {
        // Because we aren't booting Spring, we manually inject the @Value properties
        ReflectionTestUtils.setField(propertyService, "bucketName", "test-bucket");
        ReflectionTestUtils.setField(propertyService, "region", "af-south-1");

        // Set up a standard property we can use in multiple tests
        testProperty = Property.builder()
                .id(1L)
                .title("Ocean View Villa")
                .price(2500000.0)
                .suburb("camps bay")
                .bedrooms(4)
                .bathrooms(3)
                .status(PropertyStatus.ACTIVE)
                .images(new ArrayList<>()) // Initialize empty list to avoid NullPointer
                .build();

        testDto = PropertyDto.builder()
                .title("Ocean View Villa")
                .suburb(" CAMPS BAY ") // Note the spaces and uppercase to test our trim/lowercase logic!
                .price(null) // Leave null to test default price logic
                .build();
    }

    // --- TESTS ---

    @Test
    void findEntity_WhenIdExists_ReturnsProperty() {
        // Arrange
        when(repo.findById(1L)).thenReturn(Optional.of(testProperty));

        // Act
        Property result = propertyService.findEntity(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Ocean View Villa", result.getTitle());
        verify(repo, times(1)).findById(1L); // Verify the database was queried exactly once
    }

    @Test
    void findEntity_WhenIdDoesNotExist_ThrowsException() {
        // Arrange
        when(repo.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            propertyService.findEntity(99L);
        });

        assertEquals("Property not found", exception.getMessage());
    }

    @Test
    void create_ShouldApplyDefaultsAndFormatSuburb_WhenSaved() {
        // Arrange: When the repo saves ANY property, return our testProperty
        when(repo.save(any(Property.class))).thenReturn(testProperty);

        // Act
        PropertyDto result = propertyService.create(testDto);

        // Assert: testing the SERVICE logic
        assertNotNull(result);

        //ensure the service modified the data before saving
        verify(repo).save(argThat(property -> property.getPrice() == 0.0 && // Null price became 0.0
                property.getBedrooms() == 0 && // Null bedrooms became 0
                property.getSuburb().equals("camps bay") && // " CAMPS BAY " was trimmed and lowercased
                property.getStatus() == PropertyStatus.ACTIVE // Status was automatically set
        ));
    }

    @Test
    void archive_ShouldChangeStatusToArchived_AndSave() {
        // Arrange
        when(repo.findById(1L)).thenReturn(Optional.of(testProperty));

        // Act
        propertyService.archive(1L);

        // Assert
        assertEquals(PropertyStatus.ARCHIVED, testProperty.getStatus());
        verify(repo, times(1)).save(testProperty);
    }

    @Test
    void toDto_ShouldMapFieldsAndGenerateS3Urls_Correctly() {
        // Arrange: Add a fake image to our test property
        PropertyImage image = new PropertyImage();
        image.setFilename("properties/1/fake-uuid-image.jpg");
        testProperty.getImages().add(image);

        // Act
        PropertyDto result = propertyService.toDto(testProperty);

        // Assert
        assertEquals(1L, result.getId());
        assertEquals("Ocean View Villa", result.getTitle());

        // Ensure the AWS URL was constructed perfectly
        assertFalse(result.getImageUrls().isEmpty());
        assertEquals("https://test-bucket.s3.af-south-1.amazonaws.com/properties/1/fake-uuid-image.jpg", result.getImageUrls().getFirst());
    }
}
