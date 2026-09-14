package fixflow_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;


    /*
     * Extract email/username stored in JWT subject.
     */
    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }


    /*
     * Generic claim extractor.
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(
                claims
        );
    }


    /*
     * Generate token without extra claims.
     */
    public String generateToken(
            UserDetails userDetails
    ) {

        return generateToken(
                new HashMap<>(),
                userDetails
        );
    }


    /*
     * Generate JWT.
     */
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {

        long currentTime =
                System.currentTimeMillis();

        return Jwts
                .builder()

                .claims(extraClaims)

                .subject(
                        userDetails.getUsername()
                )

                .issuedAt(
                        new Date(
                                currentTime
                        )
                )

                /*
                 * Token valid for 24 hours.
                 */
                .expiration(
                        new Date(
                                currentTime
                                        + 1000L
                                        * 60
                                        * 60
                                        * 24
                        )
                )

                .signWith(
                        getSignInKey()
                )

                .compact();
    }


    /*
     * Check:
     *
     * 1. JWT subject matches authenticated user
     * 2. JWT is not expired
     */
    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        String username =
                extractUsername(token);

        return (
                username != null
                        &&
                        username.equals(
                                userDetails.getUsername()
                        )
                        &&
                        !isTokenExpired(token)
        );
    }


    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)
                .before(
                        new Date()
                );
    }


    private Date extractExpiration(
            String token
    ) {

        return extractClaim(
                token,
                Claims::getExpiration
        );
    }


    /*
     * Parse JWT and verify signature.
     */
    private Claims extractAllClaims(
            String token
    ) {

        return Jwts
                .parser()

                .verifyWith(
                        getSignInKey()
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }


    /*
     * Convert Base64 secret into signing key.
     */
    private SecretKey getSignInKey() {

        byte[] keyBytes =
                Decoders
                        .BASE64
                        .decode(
                                secretKey
                        );

        return Keys
                .hmacShaKeyFor(
                        keyBytes
                );
    }
}