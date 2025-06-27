# CSR-API 最终版接口文档


## 📋 项目概述

CSR-API 是一个面向企业级管理后台和用户端的统一接口文档，涵盖用户、事件、活动等核心业务。

- **认证方式**: JWT Token
- **数据格式**: JSON
- **编码格式**: UTF-8
- **API 基础路径**: `/api`
- **请求头要求**:
  ```
  Content-Type: application/json
  Authorization: Bearer {token}  # 需要认证的接口
  ```

---

## 目录
- 认证模块
- 用户管理
- 事件管理
- 活动管理
- 用户贡献/成就/反馈
- 系统配置
- 通用说明

---

## 🔐 认证模块

### 1. 用户登录
**POST** `/api/auth/login`

**请求参数：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，最大45字符 |
| password | string | 是 | 密码，最少6字符 |

**响应：**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 300
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| accessToken | string | JWT访问令牌，用于API认证 |
| refreshToken | string | JWT刷新令牌，用于获取新access token |
| tokenType | string | 令牌类型，固定为"Bearer" |
| expiresIn | number | access token过期时间（秒），300=5分钟 |

### 2. 退出登录
**POST** `/api/auth/logout`

**请求头：**
```
Authorization: Bearer {token}
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 是 | 需要失效的刷新令牌 |

**响应：**
```json
{
  "code": 200,
  "message": "Logged out successfully",
  "data": null
}
```

### 3. 修改个人信息
**PUT** `/api/profile`

**请求头：**
```
Authorization: Bearer {token}
```
**请求参数：**
```json
{
  "nickname": "新昵称",
  "realName": "真实姓名",
  "gender": "male" // male/female/other
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| realName | string | 否 | 真实姓名 |
| gender | string | 否 | 性别（male/female/other）|

**响应：**
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

---

## 👥 用户管理

### 4. 获取用户列表
**GET** `/api/users?page=1&pageSize=10&username=john&sortField=createTime&sortOrder=descend`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（从1开始，默认1） |
| pageSize | integer | 否 | 每页条数（默认10） |
| username | string | 否 | 按用户名模糊查询（不区分大小写） |
| sortField | string | 否 | 排序字段（id, username, createTime等） |
| sortOrder | string | 否 | 排序方向："ascend" 或 "descend" |

**响应：**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "john_doe",
        "role": "User",
        "location": "上海",
        "reviewerId": 2,
        "reviewerName": "李明",
        "createTime": "2024-01-15 10:30:00",
        "eventCount": 5,
        "activityCount": 12
      },
      {
        "id": 2,
        "username": "admin_user",
        "role": "Administrator",
        "location": "深圳",
        "reviewerId": null,
        "reviewerName": null,
        "createTime": "2024-01-16 14:20:00",
        "eventCount": 0,
        "activityCount": 0
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| data | array | 用户对象数组 |
| data[].id | integer | 用户唯一标识 |
| data[].username | string | 用户名 |
| data[].role | string | 用户角色 |
| data[].location | string | 用户所在地区 |
| data[].reviewerId | integer | 审核人ID |
| data[].reviewerName | string | 审核人姓名 |
| data[].createTime | string | 创建时间（YYYY-MM-DD HH:mm:ss） |
| data[].eventCount | integer | 参与事件数 |
| data[].activityCount | integer | 参与活动数 |
| total | integer | 总用户数 |
| page | integer | 当前页码 |
| pageSize | integer | 每页条数 |

### 5. 获取用户详情
**GET** `/api/users/{id}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要查询的用户ID |

**响应：**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "用户1",
    "role": "admin",
    "location": "上海",
    "reviewerId": 3,
    "reviewerName": "孙雄鹰",
    "createTime": "2024-01-15 10:30:00",
    "eventCount": 5,
    "activityCount": 12
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 用户唯一标识 |
| username | string | 用户名 |
| role | string | 用户角色（admin 或 user） |
| location | string | 用户所在地区 |
| reviewerId | integer | 审核人ID |
| reviewerName | string | 审核人姓名 |
| createTime | string | 创建时间（YYYY-MM-DD HH:mm:ss） |
| eventCount | integer | 参与事件数 |
| activityCount | integer | 参与活动数 |

### 6. 更新用户信息
**PUT** `/api/users/{id}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要更新的用户ID |

**请求参数：**
```json
{
  "username": "新用户名",
  "role": "user",
  "location": "深圳"
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 新用户名（最大45字符，唯一） |
| role | string | 是 | 用户角色："admin" 或 "user" |
| location | string | 是 | 用户地区："SH"（上海）或 "SZ"（深圳） |

**响应：**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 7. 更新用户审核人
**PUT** `/api/users/{id}/reviewer`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要更改审核人的用户ID |

**请求参数：**
```json
{
  "reviewerId": 2
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| reviewerId | integer | 是 | 新审核人用户ID |

**响应：**
```json
{
  "code": 200,
  "message": "设置成功"
}
```

### 8. 重置用户密码
**PUT** `/api/users/{id}/reset-password`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要重置密码的用户ID |

**请求参数：**
```json
{
  "password": "newPassword123"
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| password | string | 是 | 新密码（最少6字符） |

**响应：**
```json
{
  "code": 200,
  "message": "密码重置成功"
}
```

### 9. 获取用户事件记录
**GET** `/api/users/{id}/events`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要查询事件的用户ID |

**响应：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "年度技术分享大会",
      "type": "线下事件",
      "duration": "8小时",
      "status": "active"
    }
  ]
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 事件ID |
| name | string | 事件名称 |
| type | string | 事件类型："offline"、"online"、"hybrid" |
| duration | string | 事件时长（如"8小时"） |
| status | string | 事件状态："active" 或 "ended" |

### 10. 获取用户活动记录
**GET** `/api/users/{id}/activities`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 需要查询活动的用户ID |

**响应：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "开场致辞",
      "eventName": "年度技术分享大会",
      "duration": "30分钟"
    }
  ]
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 活动ID |
| name | string | 活动名称 |
| eventName | string | 所属事件名称 |
| duration | string | 活动时长（如"30分钟"） |

### 11. 批量删除用户
**DELETE** `/api/users/batch-delete`

**请求参数：**
```json
{
  "userIds": [1, 2, 3, 4]
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userIds | array | 是 | 需要删除的用户ID数组（不能为空） |

**响应：**
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 📅 事件管理

### 12. 获取事件列表
**GET** `/api/events`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（从1开始，默认1） |
| pageSize | integer | 否 | 每页条数（默认10） |

**响应：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "年度技术分享大会",
      "startTime": "2024-03-20 09:00",
      "endTime": "2024-03-20 18:00",
      "is_display": true,
      "bgImage": "https://example.com/bg.jpg",
    }
  ]
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 事件ID |
| name | string | 事件名称 |
| startTime | string | 事件开始时间 |
| endTime | string | 事件结束时间 |
| is_display | boolean | 是否展示 |
| bgImage | string | 背景图片URL |
| activities | array | 活动列表 |
| activities[].id | integer | 活动ID |
| activities[].name | string | 活动名称 |
| activities[].description | string | 活动描述 |
| activities[].startTime | string | 活动开始时间 |
| activities[].endTime | string | 活动结束时间 |
| activities[].status | string | 活动状态 |

### 13. 获取事件详情
**GET** `/api/events/{id}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 事件ID |

**响应：**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "年度技术分享大会",
    "total_time": 480,
    "icon": "/icons/tech-conference.png",
    "description": "公司年度技术分享大会，邀请各部门技术专家分享最新技术成果...",
    "is_display": true,
    "visibleLocations": ["上海", "深圳"],
    "visibleRoles": ["admin", "user"]，
    "activities": [
        {
          "id": 1,
          "name": "开场致辞",
          "description": "公司CEO致开场词",
          "startTime": "2024-03-20 09:00",
          "endTime": "2024-03-20 09:30",
          "status": "registering"
        }
      ]
  }
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 事件ID |
| name | string | 事件名称 |
| total_time | integer | 总时长（分钟） |
| icon | string | 事件图标URL |
| description | string | 事件描述 |
| is_display | boolean | 是否展示 |
| visibleLocations | array | 可见地区 |
| visibleRoles | array | 可见角色 |

### 14. 创建事件
**POST** `/api/events`

**请求参数：**
```json
{
  "name": "新事件名称",
  "total_time": 240,
  "icon": "/icons/new-event.png",
  "description": "事件详细描述...",
  "is_display": true,
  "visibleLocations": ["上海"],
  "visibleRoles": ["admin", "user"]
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 事件名称 |
| total_time | integer | 是 | 总时长（分钟） |
| icon | string | 是 | 事件图标URL |
| description | string | 是 | 事件描述 |
| is_display | boolean | 是 | 是否展示 |
| visibleLocations | array | 是 | 可见地区 |
| visibleRoles | array | 是 | 可见角色 |

**响应：**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": { "id": 2 }
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 新建事件ID |

### 15. 更新事件
**PUT** `/api/events/{id}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 事件ID |

**请求参数：** 同创建事件接口

**响应：**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 16. 更新事件展示状态
**PUT** `/api/events/{id}/display`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 事件ID |

**请求参数：**
```json
{
  "is_display": false
}
```
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| is_display | boolean | 是 | 是否展示 |

**响应：**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 17. 删除事件
**DELETE** `/api/events/{id}`

**路径参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | integer | 是 | 事件ID |

**响应：**
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 🎯 活动管理

### 18. 获取活动列表（是否可以与13 & 19合并？）
**GET** `/api/activities`

**查询参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventId | integer | 否 | 所属事件ID |
| page | integer | 否 | 页码（从1开始，默认1） |
| pageSize | integer | 否 | 每页条数（默认10） |

**响应：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "开场致辞",
      "eventId": 1,
      "startTime": "2024-03-20 09:00",
      "endTime": "2024-03-20 09:30",
      "description": "公司CEO致开场词",
      "status": "registering",
      "templateType": "default",
      "visibleLocations": ["上海", "深圳"],
      "visibleRoles": ["admin", "user"]
    }
  ]
}
```
| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 活动ID |
| name | string | 活动名称 |
| eventId | integer | 所属事件ID |
| startTime | string | 活动开始时间 |
| endTime | string | 活动结束时间 |
| description | string | 活动描述 |
| status | string | 活动状态 |
| templateType | string | 活动模板类型 |
| visibleLocations | array | 可见地区 |
| visibleRoles | array | 可见角色 |

### 19. 获取活动详情
**GET** `/api/activities/{id}`

**响应：**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "开场致辞",
    "eventId": 1,
    "startTime": "2024-03-20 09:00",
    "endTime": "2024-03-20 09:30",
    "description": "公司CEO致开场词，介绍大会主题和议程安排",
    "status": "registering",
    "templateType": "default",
    "visibleLocations": ["上海", "深圳"],
    "visibleRoles": ["admin", "user"]
  }
}
```