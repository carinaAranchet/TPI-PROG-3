plugins {
    id("java")
}

group = "com.tp.jpa"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {

    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.38")
    annotationProcessor("org.projectlombok:lombok:1.18.38")

    testCompileOnly("org.projectlombok:lombok:1.18.38")
    testAnnotationProcessor("org.projectlombok:lombok:1.18.38")

    // Hibernate
    implementation("org.hibernate.orm:hibernate-core:6.6.18.Final")

    // JPA
    implementation("jakarta.persistence:jakarta.persistence-api:3.2.0")

    // H2
    implementation("com.h2database:h2:2.3.232")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(24))
    }
}