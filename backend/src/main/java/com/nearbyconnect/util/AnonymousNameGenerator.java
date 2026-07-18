package com.nearbyconnect.util;

import com.nearbyconnect.config.AppProperties;
import com.nearbyconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class AnonymousNameGenerator {

    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public String generate() {
        java.util.List<String> prefixes = appProperties.getAnonymous().getAnimalPrefixes();
        String name;
        do {
            String prefix = prefixes.get(random.nextInt(prefixes.size()));
            int number = 1000 + random.nextInt(9000);
            name = prefix + "-" + number;
        } while (userRepository.existsByAnonymousName(name));
        return name;
    }

    public String generateAvatarSeed() {
        return String.valueOf(random.nextLong());
    }
}
