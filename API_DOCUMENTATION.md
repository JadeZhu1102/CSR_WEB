# CSR Web API 文档

## 概述

CSR Web 是一个企业社会责任活动管理平台的 API 接口文档。本文档详细描述了所有可用的 API 端点、请求/响应格式以及使用示例。

**基础信息：**
- 基础 URL: `https://joy4giving.cn`
- 认证方式: Bearer Token
- 数据格式: JSON
- 字符编码: UTF-8

## 通用响应格式

所有 API 响应都遵循统一的格式：

```typescript
interface IResponse<T = {}> {
    code: number;        // 状态码，200表示成功
    data: T;            // 响应数据
    message: string;    // 响应消息
}
```

## 认证相关 API

### 1. 用户登录

**端点:** `POST /api/auth/login`

**请求参数:**
```typescript
interface ILoginParams {
    username: string;   // 用户名
    password: string;   // 密码
}
```

**响应数据:**
```typescript
interface ILoginResponse {
    accessToken: string;    // 访问令牌
    refreshToken: string;   // 刷新令牌
    expiresIn: number;      // 过期时间（分钟）
    tokenType: 'Bearer';    // 令牌类型
    id: number;             // 用户ID
    username: string;       // 用户名
    token?: string;         // 兼容字段
    user?: {                // 用户信息
        id: number;
        username: string;
        name?: string;
    };
}
```

**示例:**
```bash
curl -X POST https://joy4giving.cn/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### 2. 用户注册

**端点:** `POST /api/auth/register`

**请求参数:**
```typescript
interface IRegisterParams {
    username: string;   // 用户名（必填）
    password: string;   // 密码（必填）
    email?: string;     // 邮箱（可选）
    gender?: string;    // 性别（可选）
    city?: string;      // 城市（可选）
}
```

**响应数据:**
```typescript
interface IRegisterResponse {
    code: number;
    message: string;
}
```

### 3. 刷新令牌

**端点:** `POST /api/auth/refresh`

**请求头:**
```
Authorization: Bearer <refresh_token>
```

### 4. 用户登出

**端点:** `POST /api/auth/logout`

**请求头:**
```
Authorization: Bearer <access_token>
```

## 活动相关 API

### 1. 获取事件下的活动列表

**端点:** `GET /api/activities`

**查询参数:**
```typescript
interface IEventListApiRequest {
    eventId: number;        // 所属事件ID（必填）
    userId?: number;        // 用户ID（可选）
    page: number;           // 页码，从1开始（必填）
    pageSize: number;       // 每页条数（必填）
    needsTotal?: boolean;   // 是否需要总数（可选）
}
```

**响应数据:**
```typescript
interface IActivity {
    id: number;                     // 活动ID
    name: string;                   // 活动名称
    eventId: number;                // 所属事件ID
    templateId: number;             // 模板ID
    duration: number;               // 持续时间
    icon: string;                   // 图标
    description: string;            // 描述
    startTime: string;              // 开始时间
    endTime: string;                // 结束时间
    status: string;                 // 状态
    visibleLocations: string[];     // 可见位置
    visibleRoles: string[];         // 可见角色
    createdAt: string | null;       // 创建时间
    totalParticipants: number | null; // 总参与人数
    totalTime: number | null;       // 总时间
    userActivityDetail?: {          // 用户活动详情
        comment: string;
        amount: number;
    };
    userActivityState: 'SIGN_UP';   // 用户活动状态
    userActivityCreatedAt: string;  // 用户活动创建时间
    completed?: boolean;            // 是否完成
    isUserAdded?: boolean;          // 是否用户添加
    thumbs?: string[];              // 缩略图
}
```

**示例:**
```bash
curl -X GET "https://joy4giving.cn/api/activities?eventId=1&page=1&pageSize=10" \
  -H "Authorization: Bearer <access_token>"
```

### 2. 参与活动

**端点:** `POST /api/users/activity-detail`

**请求参数:**
```typescript
interface IJoinActivityRequest {
    activityId: number;     // 活动ID
    comment?: string;       // 评论
    amount?: number;        // 数量
    // userId 会自动从token中获取
}
```

**响应数据:**
```typescript
boolean // 成功返回true
```

### 3. 检查活动参与状态

**端点:** `POST /api/activity/join/check/{activitySession}`

**响应数据:**
```typescript
interface IActivityJoinResult {
    id: number;         // 活动ID
    title: string;      // 活动标题
    joined: boolean;    // 是否已参与
    joinedDate: string; // 参与日期
}
```

### 4. 活动报名

**端点:** `POST /api/activities/{activityId}/enroll`

**请求头:**
```
Authorization: Bearer <access_token>
```

## 用户相关 API

### 1. 获取用户详情

**端点:** `GET /api/users/{userId}`

**响应数据:**
```typescript
interface IUserDetail {
    id: number;             // 用户ID
    username: string;       // 用户名
    role: string;           // 角色
    location: string;       // 位置
    reviewerId?: number;    // 审核者ID
    reviewerName?: string;  // 审核者姓名
    createTime: string;     // 创建时间
    eventCount: number;     // 事件数量
    activityCount: number;  // 活动数量
}
```

### 2. 获取用户资料

**端点:** `GET /api/profile`

**请求头:**
```
Authorization: Bearer <access_token>
```

**响应数据:**
```typescript
interface IUserProfileResponse {
    // 用户资料信息
}
```

### 3. 更新用户资料

**端点:** `PUT /api/profile`

**请求参数:**
```typescript
interface IUpdateUserProfile {
    nickname?: string;      // 昵称
    realName?: string;      // 真实姓名
    gender?: string;        // 性别
    [key: string]: any;     // 其他字段
}
```

### 4. 获取用户参与的活动列表

**端点:** `GET /api/activities?userId={userId}`

**响应数据:**
```typescript
interface IUserActivity {
    id: number;         // 活动ID
    name: string;       // 活动名称
    eventName: string;  // 事件名称
    duration: string;   // 持续时间
    status?: string;    // 状态
}[]
```

### 5. 获取用户参与的事件列表

**端点:** `GET /api/users/{userId}/events`

**响应数据:**
```typescript
interface IUserEvent {
    id: number;         // 事件ID
    name: string;       // 事件名称
    type: string;       // 类型
    duration: string;   // 持续时间
    status: string;     // 状态
}[]
```

### 6. 获取用户活动详情

**端点:** `GET /api/users/{userId}/activity-details`

**响应数据:**
```typescript
IActivity[] // 活动详情数组
```

## 事件相关 API

### 1. 获取事件列表

**端点:** `GET /api/events`

**响应数据:**
```typescript
interface IEventItem {
    // 事件列表项信息
}[]
```

### 2. 获取事件详情

**端点:** `GET /api/events/{eventId}`

**响应数据:**
```typescript
interface IEventDetailResponse {
    id: number;                         // 事件ID
    name: string;                       // 事件名称
    detailImage: string;                // 详情图片
    totalTime: number;                  // 总时间
    icon: string;                       // 图标
    isDisplay: boolean;                 // 是否显示
    visibleLocations: string[];         // 可见位置
    visibleRoles: ('admin' | 'user')[]; // 可见角色
    description: string;                // 描述
    totalParticipants: number;          // 总参与人数
    activities: IActivityDetail[];      // 活动详情
    bgImage: string;                    // 背景图片
    endTime: string | null;             // 结束时间
    startTime: string | null;           // 开始时间
    status: string;                     // 状态
    numberOfParticipants: number;       // 参与人数
}
```

## 反馈相关 API

### 1. 提交用户反馈

**端点:** `POST /api/feedback`

**请求参数:**
```typescript
interface IFeedbackData {
    content: string;        // 反馈内容（必填）
    userId?: string;        // 用户ID（可选）
    timestamp?: string;     // 时间戳（可选）
}
```

**请求体:**
```json
{
    "feedbackDetail": "用户反馈内容"
}
```

## 用户贡献相关 API

### 1. 获取用户贡献数据

**端点:** `GET /api/users/{userId}/contributions`

**响应数据:**
```typescript
interface IUserContribution {
    stats: IContributionStats;      // 统计数据
    records: IActivityRecord[];     // 活动记录
}

interface IContributionStats {
    totalActivities: number;        // 总活动数
    totalHours: number;             // 总小时数
    completedActivities: number;    // 已完成活动数
    ongoingActivities: number;      // 进行中活动数
    pendingActivities: number;      // 待处理活动数
}

interface IActivityRecord {
    id: number;                             // 记录ID
    name: string;                           // 活动名称
    date: string;                           // 日期
    status: 'completed' | 'ongoing' | 'pending'; // 状态
    hours?: number;                         // 小时数
    description?: string;                   // 描述
}
```

## 错误处理

### 常见错误码

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | - |
| 401 | 未授权/Token过期 | 重新登录 |
| 404 | 资源不存在 | 检查请求路径 |
| 500 | 服务器内部错误 | 稍后重试 |

### 错误响应格式

```typescript
{
    "code": 401,
    "message": "Unauthorized",
    "data": null
}
```

## 国际化支持

API 支持多语言，通过在请求 URL 中添加 `lang` 参数来指定语言：

```
GET /api/activities?eventId=1&lang=en
GET /api/activities?eventId=1&lang=zh-CN
```

## 认证机制

1. **获取Token**: 通过登录接口获取 `accessToken` 和 `refreshToken`
2. **使用Token**: 在请求头中添加 `Authorization: Bearer <accessToken>`
3. **刷新Token**: 当 `accessToken` 过期时，使用 `refreshToken` 获取新的令牌
4. **自动跳转**: Token过期时系统会自动跳转到登录页面

## 请求示例

### 使用 JavaScript/TypeScript

```typescript
// 登录
const loginResponse = await fetch('https://joy4giving.cn/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'john_doe',
        password: 'password123'
    })
});

const loginData = await loginResponse.json();
const token = loginData.data.accessToken;

// 获取活动列表
const activitiesResponse = await fetch('https://joy4giving.cn/api/activities?eventId=1&page=1&pageSize=10', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const activitiesData = await activitiesResponse.json();
```

### 使用 curl

```bash
# 登录
curl -X POST https://joy4giving.cn/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "password123"}'

# 获取活动列表
curl -X GET "https://joy4giving.cn/api/activities?eventId=1&page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 参与活动
curl -X POST https://joy4giving.cn/api/users/activity-detail \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"activityId": 1, "comment": "很有意义的活动", "amount": 2}'
```

## 版本信息

- **当前版本**: v1.0.0
- **最后更新**: 2025-08-05
- **维护状态**: 活跃维护中

## 联系方式

如有问题或建议，请联系开发团队。
