# 1. 活動の概要

```sml
fun power x 0 = 1
  | power x y = x * power x (y - 1)
```
