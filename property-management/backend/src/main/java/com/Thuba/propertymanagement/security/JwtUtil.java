    /*package com.Thuba.propertymanagement.security;


    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.stereotype.Component;

    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;

    @Component
    public class JwtUtil {

        private final String SECRET = "mySecretKey123"; // store securely!

        public String generateToken(UserDetails userDetails) {
            Map<String, Object> claims = new HashMap<>();
            //claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());

            claims.put("role", userDetails.getAuthorities()
                    .stream()
                    .findFirst()
                    .get()
                    .getAuthority());


            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(userDetails.getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
                    .signWith(SignatureAlgorithm.HS256, SECRET)
                    .compact();
        }

        public boolean validateToken(String token, UserDetails userDetails) {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        }

        public String extractUsername(String token) {
            return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
        }

        public boolean isTokenExpired(String token) {
            return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token)
                    .getBody().getExpiration().before(new Date());
        }


    }
    */

    package com.Thuba.propertymanagement.security;

    import io.jsonwebtoken.*;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.stereotype.Component;

    import java.security.Key;
    import java.util.Date;

    @Component
    public class JwtUtil {

            private final Key key;
            private final long EXPIRATION = 1000 * 60 * 60 * 10; // 10 hours

            public JwtUtil(@Value("${JWT_SECRET}") String secret) {
                this.key = Keys.hmacShaKeyFor(secret.getBytes());
            }

            public String generateToken(UserDetails userDetails) {
                return Jwts.builder()
                        .setSubject(userDetails.getUsername())
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();
            }

            public String extractUsername(String token) {
                return extractAllClaims(token).getSubject();
            }

            public boolean validateToken(String token, UserDetails userDetails) {
                return extractUsername(token).equals(userDetails.getUsername())
                        && !isTokenExpired(token);
            }

            private boolean isTokenExpired(String token) {
                return extractAllClaims(token).getExpiration().before(new Date());
            }

            private Claims extractAllClaims(String token) {
                return Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
            }
        }