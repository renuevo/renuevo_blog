---
title: "[Elastic] ElasticSearch Timezone 문제"
date: 2017-12-28
category: 'Elastic'
---
>*elastic을 쓰면서 경험한 timezone Issues에 관한 글입니다*  

###Logstash
1. Logstash의 timezone은 색인할때의 정보가 아닌 filter 자체의 timezone으로 데이터로써 @timestamp의 ***Asia/Seoul***로 설정할시에 기존 시간에서 ***-9시간***을 한 시간을 가져 오게 된다  
2. Logstash의 시간을 설정할 포맷을 정의 할때 timezone 키워드로 Asia/Seoul과 같이 지정해서 시간을 -9시간 할 수 있다
```ruby
   filter{ 
                ... 
                date{ 
                  match => ["insert_ts","YYYYMMddHHmmss"] 
                  timezone => "Asia/Seoul" <- 이부분
                } 
                ... 
          }
```          

<br/>

3. Logstash의 timezone포맷에 +-로 시간을 변경 할 수 있다
```ruby
filter{      
      date{ 
          match => ["insert_ts","YYYYMMddHHmmss -0900"] <- 이부분
          timezone => "Asia/Seoul" 
          } 
}
```

<br/>

4. ruby코드를 활용해서 시간 조정도 가능하다
```ruby
ruby{ 
    code => "event.set('@timestamp', LogStash::Timestamp.new(event.get('@timestamp')+(9*60*60)))" 
}
```

이 코드의 핵심은 **LogStash::Timestamp**인데..  
`ruby의 time객체`와 `LogStash의 time객체`가 다르다는 것이다<span class="sub_header">(이것 때문에 겁나 해맸다)</span>  

---

###Kibana

 1. 기본적으로 kibana의 Time 기분은 Browser를 따라 간다 <- 이거때문에 KST 기준일때 그래프가 정상적으로 보여서 혼동이 있었다
 2. kibana의 time 기준은 Management > Advanced Settings > dateFormat:tz로 변경할 수 있다
 
 ---
 
 ###ElasticSearch
 
  1. ElasticSearch의 기존 timezone은 UTC 기준이다 색인도 UTC 기준으로 하길 권고 하고 바꾸지 않기를 권고하고 있다  
>-> 바꾸면 무한 timezone 관리로 계속해서 더 힘들어 질것
  