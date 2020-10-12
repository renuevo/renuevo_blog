---
title: "[Elastic] 2. Elastic 자동완성 가이드 (Autocomplete Guide) - Index Search"
date: 2020-10-12
category: 'Elastic'
---

*Elastic을 활용하여 다음 3가지 방법의 자동완성 서비스를 구현하는 기술을 다룹니다*   
*Elastic 7.x 버젼을 기준으로 진행합니다*   

1. Prefix Queries를 활용한 자동완성  
2. Index 색인을 통한 Search  
3. Completion Suggester를 활용한 자동완성  

해당 포스팅에서는 앞서 소개한 [Prefix Queries](https://renuevo.github.io/elastic/autocomplete/elastic-autocomplete-1/)에서는 다룰수 없었던  
초성검색과 같은 보다 복잡한 자동완성을 해결할 수 있는 `Index Search`를 활용한 자동완성을 만드는 방법 소개합니다  

<br/>

---

## Example Data Setting  
먼저 테스트 데이터를 준비해 줍니다  
간단한 Index Mapping 정보를 작성합니다  

<span class="code_header">**Autocomplete Example Mapping**</span>  
```json

PUT autocomplete_test_1
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  },
   "mappings": {
      "properties": {
        "word": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          }
        }
    }
  }
}

```
word에 2가지 속성으로 색인을 하였습니다  

1. `text` type은 형태소 분석를 통해서 색인 키를 가지게 됩니다  
    따로 설정이 없으면 Standard Analyzer로 색인되는데 기본적으로 `불용어, lowercase, whitespace`로 색인 됩니다  
      **스팀게임 추천 :** `스팀게임` `추천`  두개의 단어로 키가 잡힙니다
    호출로 색인 키를 확인 할 수 있습니다  
    ```json
       GET autocomplete_test_1/_analyze
       {
         "text" : "스팀게임 추천"
       }
    ```
   ![analyzer-test](./images/analyzer-test.png)
   <span class='img_caption'>Standard Analyzer</span>  
     
     <br/>
    
2. `keyword` type은 텍스트 자체를 키로 색인을 합니다  
    **스팀게임 추천 :** `스팀게임 추천`이라는 문장으로 키가 잡힙니다
    
<br/>
---

이제 기본 개념을 알아봤으니 예제의 사용할 데이터를 생성하겠습니다  
<span class="code_header">**Autocomplete Example Data**</span>  
```json

POST _bulk
{"index":{"_index":"autocomplete_test_1","_id":"1"}}
{"word":"스팀게임"}
{"index":{"_index":"autocomplete_test_1","_id":"2"}}
{"word":"스팀게임 추천"}
{"index":{"_index":"autocomplete_test_1","_id":"3"}}
{"word":"스팀게임 추천 2019"}
{"index":{"_index":"autocomplete_test_1","_id":"4"}}
{"word":"스팀게임 환불"}
{"index":{"_index":"autocomplete_test_1","_id":"5"}}
{"word":"스팀게임 싸게"}
{"index":{"_index":"autocomplete_test_1","_id":"6"}}
{"word":"스팀게임 순위"}
{"index":{"_index":"autocomplete_test_1","_id":"7"}}
{"word":"스팀게임 추천 2020"}
{"index":{"_index":"autocomplete_test_1","_id":"8"}}
{"word":"스팀게임 환불하는법"}


```
자동완성 데이터는 Google에 스팀게임을 검색해서 나오는 자동완성을 가져왔습니다  

![google-search](./images/google-search.png)
<span class='img_caption'>Google Search</span>  

<br/>
<br/>

만약 7.X보다 밑의 버젼을 쓰신다면 type을 추가해주셔야합니다  
```json

POST _bulk
{"index":{"_index":"autocomplete_test_1","_type" : "_doc", "_id":"1"}}
{"word":"스팀게임"}

```

<br/>
<br/>