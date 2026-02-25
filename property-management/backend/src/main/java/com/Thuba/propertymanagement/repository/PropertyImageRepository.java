        package com.Thuba.propertymanagement.repository;

        import com.Thuba.propertymanagement.model.Property;
        import com.Thuba.propertymanagement.model.PropertyImage;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

        public interface PropertyImageRepository
                extends JpaRepository<PropertyImage, Long> ,
                JpaSpecificationExecutor<Property> {
        }
