FROM eclipse-temurin:17-jre

# Create a temporary directory
VOLUME /tmp

# Copy the JAR file from the build context
COPY target/itinerary-service.jar itinerary-service.jar

# Specify the command to run the JAR file
ENTRYPOINT ["java", "-jar", "/itinerary-service.jar"]
