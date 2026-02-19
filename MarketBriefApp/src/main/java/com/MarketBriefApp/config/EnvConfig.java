package com.MarketBriefApp.config;

import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;

/**
 * Configuration class that loads environment variables from .env file
 * This runs automatically when the Spring context is initialized
 */
@Configuration
public class EnvConfig {
    
    static {
        // Load .env file and set all variables as system properties
        // This allows Spring to access them via ${VAR_NAME} placeholders
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing() // Don't fail if .env doesn't exist
                    .load();
            
            // Set all environment variables as system properties
            dotenv.entries().forEach(entry -> 
                System.setProperty(entry.getKey(), entry.getValue())
            );
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file. Using system environment variables instead.");
            // If .env file not found, Spring will use system environment variables
        }
    }
}
