---
title: "[Spring] Spring Boot 2.3.x Dependency 업그레이드"  
date: 2021-03-21  
category: 'Spring'
---

## Spring Boot 2.3.x 버젼 업그레이드 주의사항

해당 포스터는 회사에서 Spring Boot 버젼 업데이트를 진행한 경험을 바탕으로 작성하였습니다  
하나하나 모든 내용을 세세하게 작성하지 않고 문제가 발생한거 위주로 작성하였습니다 :sweat:

<br/>

---

<br/>

### Spring Boot 2.3.x의 Gradle 버젼

```text
Gradle 6.3+ (if you are building with Gradle). 5.6.x is also supported but in a deprecated form.  
```

기본적으로 6.3버젼 이상으로 Gradle을 올려주어야 합니다

---

<br/>

### Validation Starter 제외

Spring Boot에서 Compile Dependencies의 optional로 지정되던 것들이 많이 정리 되었습니다

![spring 2.2.x](./images/spring-boot-2.2.13.PNG)
<span class='img_caption'>Spring Boot 2.2.13.RELEASE</span>

<br/>

![spring 2.3.x](./images/spring-boot-2.3.8.PNG)
<span class='img_caption'>Spring Boot 2.3.8.RELEASE</span>

<br/>


Web과 WebFlux Starter의 Validation관련 디펜던시가 제외되었습니다  
그래서 다음과 같이 의존성을 추가해 주어야 합니다  
```groovy
implementation ("org.springframework.boot:spring-boot-starter-validation")
```

---

<br/>

### lombok 버젼에 대한 사이드 이펙트
버젼이 올라가면서 [lombok v1.18.16](https://projectlombok.org/changelog)에 `mapstruct`대한 의존성이 분리되었습니다  
```text
BREAKING CHANGE: mapstruct users should now add a dependency to lombok-mapstruct-binding.  
This solves compiling modules with lombok (and mapstruct).  
```

프로젝트 내에서 mapstruct를 사용하시면 추가적으로 다음 의존성을 기입해야 합니다  
```groovy
annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")  
```

---

<br/>

### QueryDsl AnnotationProcessor로 변경  
http://honeymon.io/tech/2020/07/09/gradle-annotation-processor-with-querydsl.html  

---

