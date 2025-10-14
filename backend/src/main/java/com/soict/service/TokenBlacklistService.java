package com.soict.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    // Optional: Implement token cleanup for expired tokens
    public void removeExpiredTokens(Set<String> expiredTokens) {
        blacklistedTokens.removeAll(expiredTokens);
    }
}