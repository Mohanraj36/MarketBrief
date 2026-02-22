package com.MarketBriefApp.config;

import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;

//loads environment variables from .env file
@Configuration
public class EnvConfig {
    
    static {
        // Load .env file and set all variables as system properties
        // use ${VAR_NAME} placeholders
        try {
            Dotenv dotenv = Dotenv.configure()
                    .load();
            
            // set evironemnt variable as properties
            dotenv.entries().forEach(entry -> 
                System.setProperty(entry.getKey(), entry.getValue())
            );
        } catch (Exception e) {
            System.err.println("Warning: Could not load .env file.");
        }
    }
}
