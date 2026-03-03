# Use a a lightweight Java runtime base image
FROM openjdk:17-jdk-slim AS build

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper files and pom.xml to leverage Docker caching for dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download all dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the application code
COPY src ./src

# Build the application into a JAR file
RUN ./mvnw clean install -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
