FROM eclipse-temurin:17-jre

# Create a temporary directory
VOLUME /tmp

# Copy the JAR file from the build context
COPY target/booking-service.jar booking-service.jar

# Specify the command to run the JAR file
ENTRYPOINT ["java", "-jar", "/booking-service.jar"]
