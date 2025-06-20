# API 接口文档

## 活动相关

### 1. 获取活动列表

- **接口**：`GET /api/activity/all?type=newest`
- **返回示例**：

```json
[
  {
    "id": 1,
    "name": "活动名称",
    "slogan": "活动标语",
    "coverImage": "图片URL",
    "startDate": "2025-05-01",
    "endDate": "2025-10-01",
    "progress": 60,
    "location": "上海",
    "numberOfParticipants": 100,
    "enrollStatus": "Approved",
    "status": "Active",
    "progressIcon": "图标URL"
  }
]
```

- **字段说明**：

| 字段                  | 类型     | 说明           |
|----------------------|---------|----------------|
| id                   | number  | 活动ID         |
| name                 | string  | 活动名称       |
| slogan               | string  | 活动标语       |
| coverImage           | string  | 封面图片URL    |
| startDate            | string  | 开始日期       |
| endDate              | string  | 结束日期       |
| progress             | number  | 进度百分比     |
| location             | string  | 地点           |
| numberOfParticipants | number  | 参与人数       |
| enrollStatus         | string  | 报名状态       |
| status               | string  | 活动状态       |
| progressIcon         | string  | 进度图标（可选）|

---

### 2. 获取活动详情

- **接口**：`GET /api/activity/detail/{activityId}`
- **参数**：`activityId`（活动ID）
- **返回示例**：

```json
{
  "id": 1,
  "name": "活动名称",
  "slogan": "活动标语",
  "coverImage": "图片URL",
  "startDate": "2025-05-01",
  "endDate": "2025-10-01",
  "progress": 60,
  "introduction": "活动介绍",
  "eventList": [
    {
      "id": 1,
      "name": "事件名称",
      "startDate": "",
      "endDate": "",
      "status": "finished"
    }
  ],
  "location": "上海",
  "numberOfParticipants": 100,
  "enrollStatus": "Approved",
  "status": "Active"
}
```

---

### 3. 获取活动事件列表

- **接口**：`GET /api/activity/{activityId}/events`
- **参数**：`activityId`（活动ID）
- **返回示例**：

```json
[
  {
    "id": 1,
    "name": "事件名称",
    "startDate": "",
    "endDate": "",
    "status": "finished",
    "inactiveIcon": "URL",
    "activeIcon": "URL"
  }
]
```

---

### 4. 活动报名

- **接口**：`POST /api/activity/enroll/{activity_id}`
- **参数**：`activity_id`（活动ID）
- **返回**：`true/false`（报名是否成功）

---

### 5. 检查并自动报名活动

- **接口**：`POST /api/activity/join/check/{activity_id}`
- **参数**：`activity_id`（活动ID）
- **返回示例**：

```json
{
  "id": 1,
  "title": "活动标题",
  "joined": true,
  "joinedDate": "2025-05-01"
}
```

---

## 用户认证相关

### 6. 登录

- **接口**：`POST /api/auth/login`
- **参数**：

```json
{
  "username": "用户名",
  "password": "密码"
}
```

- **返回**：

```json
{
  "access": "访问令牌",
  "refresh": "刷新令牌"
}
```

---

### 7. 登出

- **接口**：`POST /api/auth/logout`
- **参数**：

```json
{
  "refresh": "刷新令牌"
}
```

- **返回**：空对象

---

> 如需补充其他接口或字段，请联系前端同学。 