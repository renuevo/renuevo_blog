---
title: "[Spring] Spring @ModelAttribute가 이전과 다르다?"
date: 2021-04-04
category: 'Spring'
---

얼마전 회사에서 이상한 이야기를 들었습니다  
새로 들어온 직원이 Spring의 RestController에서 모델을 받을 때 `@ModelAttribute`를 사용해 본적이 없다는 이야기 였습니다 :thinking:  

그래서 이번 기회에 Spring에서 바뀐 모델 binding을 확인하려고 포스팅을 쓰게 되었습니다  


---

## 이전까지 내가 알던 Model Binding  
일단 제가 아는 Spring의 모델 바인딩은 다음과 같습니다  
1. model 앞에 `@ModelAttribute`를 어노테이션을 기입해야 한다  
2. request 모델을 기본 생성자를 가지고 있어야 한다  
3. request 모델의 binding은 `setter`를 통해 이루어 진다  



webflux -> ModelInitializer, ModelAttributeMethodArgumentResolver
mvc -> ServletModelAttributeMethodProcessor, ModelAttributeMethodProcessor

```java



```