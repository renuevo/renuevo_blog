---
title: "[Elastic] RestTemplate Elastic 통신"
date: 2018-10-04
category: 'Elastic'
---
***ElasticSearch에서 spring에 있는 RestTemplate를 사용하기 위해서는 RestTemplate의 Post전달***

```java
class exRest{
 
    RestTemplate restTemplate;
    HttpHeaders headers;
 
    public init(){
          restTemplate = new RestTemplate();
          restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
          Charset utf8 = Charset.forName("UTF-8");
          MediaType mediaType = new MediaType("application", "json", utf8); //mediaType을 UTF8로 해줘야만 Post로 전달되는 한글이 인식됨
          headers = new HttpHeaders();
 
          HttpEntity<String> httpEntity;
          ResponseEntity<String> responseEntity;
 
          httpEntity = new HttpEntity<String>(esQuery, headers);           //esQuery는 Post로 전달할 json 쿼리
          responseEntity = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);     //String형식으로 리턴
    }
}

```

<br/>


처음엔 `mediaType`을

```java
headers.setContentType(MediaType.APPLICATION_JSON);
``` 
로 선언했었는데 이상 없이 보였지만 한글이 들어간 쿼리는 그냥 아무 값이나 전부 가져오는 현상을 보였다  


---

### Configuration로 정의
```java

@EnableRetry
@Configuration
public class RestfulConfig {

    @Bean
    RestTemplate restTemplate(){
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory());
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
        return restTemplate;

    }

    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory(){
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(15*60*1000);  //15분
        factory.setReadTimeout(15*60*1000);     //15분
        return factory;
    }

    @Bean
    HttpHeaders httpHeaders(){

        Charset utf8 = Charset.forName("UTF-8");
        MediaType mediaType = new MediaType("application", "json", utf8);   //mediaType을 UTF8로 해줘야만 한글이 인식됨
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);

        return headers;

    }

}

```
***지금은 RestTemplate말고 elastic-rest-client를 사용하고 있다 (2019-09-04 작성)***
***RestTemplate 말고 WebClient에 대해 공부하세요! (2019-09-05 작성)***


