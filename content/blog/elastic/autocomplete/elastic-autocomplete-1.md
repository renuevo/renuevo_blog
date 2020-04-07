---
title: "[Elastic] 1. Elastic 자동완성 가이드 (Autocomplete Guide) - Prefix Queries"
date: 2020-04-06
category: 'Elastic'
---

*Elastic을 활용하여 다음 3가지 방법의 자동완성 서비스를 구현하는 기술을 다룹니다*   
*Elastic 7.x 버젼을 기준으로 진행합니다*   

1. Prefix Queries를 활용한 자동완성  
2. Index 색인을 통한 Search  
3. Completion Suggester를 활용한 자동완성  

해당 포스팅에서는 `Prefix Queries`를 활용한 가장 단순한 자동완성을 만드는 방법 소개합니다  

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
    "_doc": {
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
}

```
word에 2가지 속성으로 색인을 하였습니다  

1. `text` type은 형태소 분석를 통해서 색인 키를 가지게 됩니다  
    따로 설정이 없으면 Standard Analyzer로 색인되는데 기본적으로 `불용어, lowercase, whitespace`로 색인 됩니다  
    호출로 색인 키를 확인 할 수 있습니다  
    ```json
       GET autocomplete_test_1/_analyze
       {
         "text" : "스팀게임 추천"
       }
    ```
   ![analyzer-test](./images/analyzer-test.png)  
    
2. `keyword` type은 텍스트 자체를 키로 색인을 합니다  
    **스팀게임 추천 :** `스팀게임 추천`
    
<br/>

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

<br/>

만약 7.X보다 밑의 버젼을 쓰신다면 type을 추가해주셔야합니다  
```json

POST _bulk
{"index":{"_index":"autocomplete_test_1","_type" : "_doc", "_id":"1"}}
{"word":"스팀게임"}

```

<br/>

---

## Prefix Query  
먼저 Prefix Query를 살펴보겠습니다  
`Prefix Query`는 Elastic에서 제공하는 앞글자 일치 검색기능 입니다  
간단한 쿼리를 통해서 `text`와`keyword` type들에 대해 어떻게 검색이 다르게 되는지 살펴 보겠습니다  

<br/>

***여기서 부터 차례로 text와 keyword을 번갈아 가면서 어떻게 다르게 검색되는지 살펴보겠습니다***  

형태소 분석이된 `Text Type`에 대한 검색입니다  
띄어쓰기 기준으로 키워드가 색인된 것을 앞서 확인했습니다  
예를 들어 `스팀게임 추천`이라는 문장은 `스팀게임`과 `추천` 이라는 2개의 키워드를 통해 검색됩니다  

<br/>

Prefix쿼리로 먼저 앞글자 단어 일치를 확인해보겠습니다  
```json 

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word": {
        "value": "스팀게"
      }
    }
  }
}

```

![search-prefix-text](./images/search-prefix-text.png)  
정상적으로 모든 `스팀게임`의 키워드를 기준 앞글자가 일치하는 모든 결과가 검색된걸 확인할 수 있습니다  

<br/>

다음은 `Keyword Type`에대해 Prefix쿼리로 검색합니다  
```json 

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word.keyword": {
        "value": "스팀게"
      }
    }
  }
}

```


![search-prefix-keyword](./images/search-prefix-keyword.png)  
Text Type과 같이 모든 단어가 검색된걸 확인할 수 있습니다  

둘의 검색을 비교해 보면 다음과 같습니다  

![elastic-search-index](./images/elastic-search-index.png)

그래서 둘 모두 같은 결과를 내놓았습니다  
만약 Text Type에 형태소에서 `스팀게임`이라는 단어를 `Index Key`로 잡지 않았다면 전혀 다른 결과가 나오게 됩니다  

<br/>

다음으로 `Text Type`에 `추천`으로 검색해 보겠습니다  

```json

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word": {
        "value": "추천"
      }
    }
  }
}

```

![search-prefix-text2](./images/search-prefix-text2.png)  
예상한것과 같이 추천이 뒤에 포함된 결과들이 검색된걸 확인할 수 있습니다  

![naver-recommend](./images/naver-recommend.png)  
다음과 같이 뒤에 단어까지 확장된 검색이 필요하다면 Text Type의 색인된 검색결과를 입력하는게 효율적입니다  


<br/>

다음으로 `Keyword Type`에 `추천` 키워드로 검색해 보겠습니다  
```json

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word.keyword": {
        "value": "추천"
      }
    }
  }
}

```

![search-prefix-keyword2](./images/search-prefix-keyword2.png)  
추천과 관련된 word가 3개가 있는데 검색 결과는 <span class='red_font'>0건</span>이 나왔습니다  

<br/>

![elastic-search-index2](./images/elastic-search-index2.png)
Type Type과 달리 들어오는 키워드 자체로 색인되기 때문에 추천이라는 글자가 포함되더라도 검색되지 않습니다  


<br/>

**그럼 무조건 Text Type의 검색일 사용하면 되는 걸까요?**
Text Type으로 설정시 <span class='red_font'>치명적인 단점</span>을 가지고 있습니다  
다음과 같이 각각의 키워드는 있으나 결합된 키워드로 검색시 결과가 나오지 않을 수 있습니다   

```json

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word": {
        "value": "스팀게임 추"
      }
    }
  }
}

```
![search-prefix-text3](./images/search-prefix-text3.png)  

자동완성처럼 한글자씩 치면서 아래 계속해서 list를 펼쳐줘야 하는데  
이는 치명적인 단점으로 다가오게 됩니다  

<br/>

반면 Keyword Type의 경우 색인된 결과와 앞글자를 일치 시켜주면 검색이 됩니다  
```json

GET autocomplete_test_1/_search
{
  "query": {
    "prefix": {
      "word.keyword": {
        "value": "스팀게임 추"
      }
    }
  }
}

```
![search-prefix-keyword3](./images/search-prefix-keyword3.png)  

이 때문에 높은 `recall(재현율)`을 위해서 두가지 타입을 `OR`로 사용해서 서비스 할 수도 있습니다  

<br/>

하지만 아직 위의 구현으로는 쓸만한 자동완성을 만들 수 있지만 잘 만든 자동완성은 아닙니다  
다음으로 `오타교정 자동완성`과 `형태소 분석`을 통한 자동완성을 살펴 보겠습니다   