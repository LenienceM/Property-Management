package com.Thuba.propertymanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

    @Configuration
    public class RedisConfig {

        @Bean
        public RedisCacheConfiguration cacheConfiguration() {
            return RedisCacheConfiguration.defaultCacheConfig()
                    // Set how long data should live in the cache before expiring (e.g., 60 minutes)
                    .entryTtl(Duration.ofMinutes(60))
                    // Tell Spring to use Jackson (JSON) instead of Java Serialization
                    .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
        }

}
