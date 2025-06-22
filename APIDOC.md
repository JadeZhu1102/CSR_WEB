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

### 6. 获取活动进度阶段

- **接口**：`GET /api/activity/{activityId}/stages`
- **参数**：`activityId`（活动ID）
- **返回示例**：

```json
[
  {
    "id": 1,
    "name": "项目启动会",
    "time": "2025-04-10T08:00:00",
    "description": "参与项目启动会，了解整体流程和目标。",
    "thumbnail": "图标URL",
    "progress": 100,
    "records": ["图片URL1", "图片URL2"],
    "isUserAdded": false
  }
]
```

- **字段说明**：

| 字段          | 类型     | 说明           |
|--------------|---------|----------------|
| id           | number  | 阶段ID         |
| name         | string  | 阶段名称       |
| time         | string  | 阶段时间       |
| description  | string  | 阶段描述       |
| thumbnail    | string  | 缩略图URL      |
| progress     | number  | 进度百分比     |
| records      | array   | 记录图片列表   |
| isUserAdded  | boolean | 是否用户添加   |

---

### 7. 添加个人事件记录

- **接口**：`POST /api/activity/{activityId}/personal-event`
- **参数**：

```json
{
  "type": "种玉米",
  "content": "活动内容描述",
  "date": "2025-04-15T10:00:00",
  "images": ["图片URL1", "图片URL2"]
}
```

- **返回示例**：

```json
{
  "success": true,
  "message": "事件添加成功",
  "eventId": 123
}
```

---

## 用户认证相关

### 8. 登录

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

### 9. 登出

- **接口**：`POST /api/auth/logout`
- **参数**：

```json
{
  "refresh": "刷新令牌"
}
```

- **返回**：空对象

---

## 用户贡献相关

### 10. 获取用户贡献统计

- **接口**：`GET /api/user/contribution/stats`
- **参数**：无（通过token获取用户信息）
- **返回示例**：

```json
{
  "stats": {
    "totalActivities": 12,
    "totalHours": 48,
    "completedActivities": 8,
    "ongoingActivities": 2,
    "pendingActivities": 2
  },
  "records": [
    {
      "id": 1,
      "name": "2025玉米行",
      "date": "2025-04-10",
      "status": "completed",
      "hours": 8,
      "description": "参与崇明岛种玉米活动"
    }
  ]
}
```

- **字段说明**：

| 字段                  | 类型     | 说明           |
|----------------------|---------|----------------|
| totalActivities      | number  | 总参与活动数   |
| totalHours           | number  | 累计贡献时长   |
| completedActivities  | number  | 已完成活动数   |
| ongoingActivities    | number  | 进行中活动数   |
| pendingActivities    | number  | 待参与活动数   |

**活动记录字段说明**：

| 字段        | 类型     | 说明           |
|------------|---------|----------------|
| id         | number  | 记录ID         |
| name       | string  | 活动名称       |
| date       | string  | 参与日期       |
| status     | string  | 状态（completed/ongoing/pending） |
| hours      | number  | 贡献时长       |
| description| string  | 活动描述       |

---

### 11. 获取用户活动记录

- **接口**：`GET /api/user/activities`
- **参数**：
  - `page`（可选）：页码，默认1
  - `size`（可选）：每页数量，默认10
  - `status`（可选）：状态筛选（completed/ongoing/pending）
- **返回示例**：

```json
{
  "total": 12,
  "page": 1,
  "size": 10,
  "records": [
    {
      "id": 1,
      "name": "2025玉米行",
      "date": "2025-04-10",
      "status": "completed",
      "hours": 8,
      "description": "参与崇明岛种玉米活动",
      "activityId": 1
    }
  ]
}
```

---

## 用户反馈相关

### 12. 提交用户反馈

- **接口**：`POST /api/feedback/submit`
- **参数**：

```json
{
  "content": "反馈内容",
  "type": "suggestion",
  "contact": "联系方式（可选）"
}
```

- **返回示例**：

```json
{
  "success": true,
  "message": "反馈提交成功",
  "feedbackId": 123
}
```

---

### 13. 获取用户反馈历史

- **接口**：`GET /api/feedback/history`
- **参数**：
  - `page`（可选）：页码，默认1
  - `size`（可选）：每页数量，默认10
- **返回示例**：

```json
{
  "total": 5,
  "page": 1,
  "size": 10,
  "records": [
    {
      "id": 1,
      "content": "反馈内容",
      "type": "suggestion",
      "status": "pending",
      "createdAt": "2025-01-15T10:30:00",
      "reply": "回复内容（可选）"
    }
  ]
}
```

---

## 用户成就相关

### 14. 获取用户成就统计

- **接口**：`GET /api/user/achievements`
- **参数**：无（通过token获取用户信息）
- **返回示例**：

```json
{
  "userLevel": 5,
  "experience": 1250,
  "nextLevel": 6,
  "nextLevelExp": 2000,
  "badges": [
    {
      "id": 1,
      "name": "环保先锋",
      "description": "参与10次环保活动",
      "icon": "徽章图标URL",
      "unlocked": true,
      "unlockedAt": "2025-01-10T15:30:00"
    }
  ],
  "stats": {
    "totalEvents": 25,
    "completedEvents": 20,
    "ongoingEvents": 3,
    "pendingEvents": 2
  }
}
```

---

## 系统配置相关

### 15. 获取系统配置

- **接口**：`GET /api/system/config`
- **参数**：无
- **返回示例**：

```json
{
  "supportedLanguages": ["zh-Hans", "zh-Hant", "en"],
  "defaultLanguage": "zh-Hans",
  "appVersion": "1.0.0",
  "maintenanceMode": false
}
```

---

### 16. 更新用户语言设置

- **接口**：`PUT /api/user/language`
- **参数**：

```json
{
  "language": "zh-Hans"
}
```

- **返回示例**：

```json
{
  "success": true,
  "message": "语言设置更新成功"
}
```

---

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误信息",
  "code": "ERROR_CODE",
  "details": {}
}
```

### 分页响应

```json
{
  "total": 100,
  "page": 1,
  "size": 10,
  "records": []
}
```

---

## 状态码说明

| 状态码 | 说明           |
|--------|----------------|
| 200    | 请求成功       |
| 201    | 创建成功       |
| 400    | 请求参数错误   |
| 401    | 未授权         |
| 403    | 禁止访问       |
| 404    | 资源不存在     |
| 500    | 服务器内部错误 |

---

## 认证方式

所有需要认证的接口都需要在请求头中包含：

```
Authorization: Bearer {access_token}
```

---

> 如需补充其他接口或字段，请联系前端同学。 