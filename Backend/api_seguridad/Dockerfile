FROM amazoncorretto:17 AS build

WORKDIR /project

VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8000

ENV JAVA_OPTS=" -XX:+UseContainerSupport -XX:MaxRAMPercentage=70 -Djava.security.egd=file:/dev/./urandom"

ENV BASE_FOLDER=project/

ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS  -jar app.jar" ]
