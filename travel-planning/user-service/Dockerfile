FROM eclipse-temurin:17-jre

# Create a temporary directory
VOLUME /tmp

# Copy the JAR file from the build context
COPY target/user-service.jar user-service.jar

# Specify the command to run the JAR file
ENTRYPOINT ["java", "-jar", "/user-service.jar"]
