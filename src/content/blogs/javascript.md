---
title: "javascript"
description: "测试用例描述测试用例描述"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["js", "javascript", "前端"]
---

# 测试用例 5 - 用户权限管理系统测试

## 测试背景

用户权限管理系统是企业级应用的核心安全模块，负责控制不同用户对系统资源的访问权限。本测试用例将全面验证权限分配、角色管理、访问控制等关键功能的正确性和安全性。

## 测试目标

- 验证用户角色分配和权限继承机制
- 验证页面和功能的访问控制
- 验证数据级权限控制
- 验证权限变更的实时生效
- 验证权限系统的安全防护能力
- 验证多租户权限隔离

## 权限模型说明

### 角色层级结构

```
超级管理员 (Super Admin)
├── 系统管理员 (System Admin)
├── 部门管理员 (Department Admin)
├── 项目经理 (Project Manager)
├── 普通用户 (Regular User)
└── 访客用户 (Guest User)
```

### 权限分类

- **系统权限**：用户管理、角色管理、系统配置
- **业务权限**：订单管理、商品管理、财务管理
- **数据权限**：全部数据、部门数据、个人数据
- **功能权限**：查看、新增、编辑、删除、审核

## 角色权限测试

### TC501 - 超级管理员权限验证

**权限范围：** 拥有系统所有权限，包括用户管理、角色分配、系统配置等

**测试账号:** superadmin / SuperPass123

**测试步骤：**

1. 使用超级管理员账号登录系统
2. 验证左侧导航菜单显示所有模块
3. 进入用户管理页面，验证可以查看所有用户
4. 尝试创建新用户并分配角色
5. 进入角色管理页面，验证可以管理所有角色
6. 进入系统配置页面，验证可以修改系统参数
7. 验证数据访问范围为全部数据

**预期结果：**

- 所有页面和功能均可正常访问
- 可以对任意用户进行增删改查操作
- 可以创建、修改、删除角色
- 可以修改系统级配置参数
- 数据查询无权限限制

### TC502 - 系统管理员权限验证

**权限范围：** 用户管理、部门管理、基础配置，但不能管理超级管理员

**测试账号:** sysadmin / SysPass123

**测试内容：**

1. **可访问功能模块**

   - 用户管理（除超级管理员外）
   - 角色管理（除超管角色外）
   - 部门管理
   - 基础配置管理

2. **权限限制验证**
   - 无法查看或编辑超级管理员账号
   - 无法分配超级管理员角色
   - 无法访问高级系统配置
   - 无法删除系统预设角色

**测试步骤：**

1. 系统管理员登录系统
2. 进入用户管理，验证用户列表不包含超级管理员
3. 尝试新建用户，验证角色选择中无超管角色
4. 尝试直接访问超管用户编辑页面（通过 URL）
5. 验证系统返回权限不足提示

**预期结果：**

- 用户列表正确过滤超级管理员
- 角色分配受到正确限制
- 直接访问被拒绝资源时有权限提示
- 所有操作都有完整的审计日志

### TC503 - 部门管理员权限验证

**权限范围：** 仅能管理本部门用户和数据

**测试场景设计：**

- 部门 A 管理员：deptadmin_a / DeptPass123
- 部门 B 管理员：deptadmin_b / DeptPass123
- 跨部门数据访问测试

**测试步骤：**

1. 部门 A 管理员登录系统
2. 验证用户管理页面只显示本部门用户
3. 尝试编辑其他部门用户信息
4. 验证订单管理中只能查看本部门相关订单
5. 尝试通过 API 直接访问其他部门数据
6. 验证导出功能的数据范围限制

**数据权限验证：**

```sql
-- 部门A管理员应该只能看到的数据
SELECT u.username, u.department_id
FROM users u
WHERE u.department_id = 'DEPT_A';

-- 验证跨部门数据访问被阻止
SELECT COUNT(*) as should_be_zero
FROM orders o
WHERE o.department_id != 'DEPT_A'
AND o.created_by = 'current_user_session';
```

### TC504 - 普通用户权限验证

**权限特点：** 只能访问基本业务功能，无管理权限

**测试账号:** normaluser / NormalPass123

**权限矩阵验证：**

| 功能模块 | 查看    | 新增 | 编辑      | 删除 | 审核 |
| -------- | ------- | ---- | --------- | ---- | ---- |
| 商品信息 | ✓       | ✗    | ✗         | ✗    | ✗    |
| 订单管理 | ✓(个人) | ✓    | ✓(待支付) | ✗    | ✗    |
| 用户管理 | ✗       | ✗    | ✓(个人)   | ✗    | ✗    |
| 财务报表 | ✗       | ✗    | ✗         | ✗    | ✗    |
| 系统设置 | ✗       | ✗    | ✗         | ✗    | ✗    |

**测试执行：**

1. 普通用户登录验证菜单权限
2. 逐一验证每个功能的操作权限
3. 尝试越权访问管理功能
4. 验证数据范围限制（只能看个人数据）

## 访问控制测试

### TC505 - 页面访问控制测试

**测试方法：** 直接通过 URL 访问未授权页面

**测试用例：**

```javascript
// 测试用例数据
const testCases = [
  {
    role: "普通用户",
    restrictedUrls: [
      "/admin/users",
      "/admin/roles",
      "/admin/system-config",
      "/reports/financial",
      "/audit/logs",
    ],
    expectedResponse: 403, // Forbidden
  },
  {
    role: "部门管理员",
    restrictedUrls: [
      "/admin/system-config",
      "/admin/super-admin",
      "/global-reports",
    ],
    expectedResponse: 403,
  },
];

// 自动化测试脚本
async function testPageAccess(userRole, restrictedUrls) {
  for (const url of restrictedUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${userRole.token}`,
        },
      });

      if (response.status !== 403) {
        console.error(`权限控制失败: ${userRole.name} 可以访问 ${url}`);
      } else {
        console.log(`✓ 权限控制正常: ${url} 访问被拒绝`);
      }
    } catch (error) {
      console.error(`测试访问 ${url} 时出错:`, error);
    }
  }
}
```

### TC506 - API 接口权限测试

**接口权限矩阵：**

| API 接口                   | 超管 | 系统管理员 | 部门管理员 | 普通用户 |
| -------------------------- | ---- | ---------- | ---------- | -------- |
| GET /api/users             | ✓    | ✓          | ✓(部门)    | ✗        |
| POST /api/users            | ✓    | ✓          | ✓(部门)    | ✗        |
| PUT /api/users/:id         | ✓    | ✓          | ✓(部门)    | ✓(本人)  |
| DELETE /api/users/:id      | ✓    | ✓          | ✓(部门)    | ✗        |
| GET /api/roles             | ✓    | ✓          | ✗          | ✗        |
| POST /api/orders           | ✓    | ✓          | ✓          | ✓        |
| GET /api/reports/financial | ✓    | ✓          | ✗          | ✗        |

**自动化 API 权限测试：**

```python
import requests
import json

class APIPermissionTest:
    def __init__(self):
        self.base_url = "http://test-api.example.com"
        self.test_users = {
            "superadmin": {"token": "super_token_123", "role": "超级管理员"},
            "sysadmin": {"token": "sys_token_123", "role": "系统管理员"},
            "deptadmin": {"token": "dept_token_123", "role": "部门管理员"},
            "normaluser": {"token": "normal_token_123", "role": "普通用户"}
        }

    def test_api_permissions(self):
        """测试API接口权限"""
        test_cases = [
            {
                "endpoint": "/api/users",
                "method": "GET",
                "allowed_roles": ["superadmin", "sysadmin", "deptadmin"],
                "denied_roles": ["normaluser"]
            },
            {
                "endpoint": "/api/users",
                "method": "POST",
                "allowed_roles": ["superadmin", "sysadmin", "deptadmin"],
                "denied_roles": ["normaluser"],
                "data": {
                    "username": "testuser",
                    "email": "test@example.com",
                    "role": "normaluser"
                }
            },
            {
                "endpoint": "/api/roles",
                "method": "GET",
                "allowed_roles": ["superadmin", "sysadmin"],
                "denied_roles": ["deptadmin", "normaluser"]
            },
            {
                "endpoint": "/api/reports/financial",
                "method": "GET",
                "allowed_roles": ["superadmin", "sysadmin"],
                "denied_roles": ["deptadmin", "normaluser"]
            }
        ]

        for case in test_cases:
            self.run_permission_test(case)

    def run_permission_test(self, test_case):
        """执行单个权限测试用例"""
        endpoint = test_case["endpoint"]
        method = test_case["method"]

        print(f"\n测试接口: {method} {endpoint}")

        # 测试允许访问的角色
        for role in test_case["allowed_roles"]:
            result = self.make_request(
                endpoint, method, role, test_case.get("data")
            )
            if result["status_code"] in [200, 201]:
                print(f"  ✓ {self.test_users[role]['role']} 访问成功")
            else:
                print(f"  ✗ {self.test_users[role]['role']} 访问失败 (应该成功)")

        # 测试拒绝访问的角色
        for role in test_case["denied_roles"]:
            result = self.make_request(
                endpoint, method, role, test_case.get("data")
            )
            if result["status_code"] == 403:
                print(f"  ✓ {self.test_users[role]['role']} 访问被拒绝")
            else:
                print(f"  ✗ {self.test_users[role]['role']} 访问成功 (应该被拒绝)")

    def make_request(self, endpoint, method, role, data=None):
        """发送HTTP请求"""
        url = f"{self.base_url}{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.test_users[role]['token']}",
            "Content-Type": "application/json"
        }

        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)

            return {
                "status_code": response.status_code,
                "response": response.json() if response.status_code != 403 else None
            }
        except Exception as e:
            return {"status_code": 500, "error": str(e)}

# 执行API权限测试
if __name__ == "__main__":
    test = APIPermissionTest()
    test.test_api_permissions()
```

## 数据权限测试

### TC507 - 数据级权限控制

**测试场景：** 不同角色用户查询相同接口时返回不同范围的数据

**数据权限规则：**

- 超级管理员：查看所有数据
- 系统管理员：查看所有业务数据
- 部门管理员：仅查看本部门数据
- 普通用户：仅查看个人相关数据

**测试数据准备：**

```sql
-- 创建测试部门
INSERT INTO departments (id, name) VALUES
('DEPT_A', '技术部'),
('DEPT_B', '销售部'),
('DEPT_C', '市场部');

-- 创建测试用户
INSERT INTO users (username, department_id, role) VALUES
('user_tech_1', 'DEPT_A', 'normal'),
('user_tech_2', 'DEPT_A', 'normal'),
('user_sales_1', 'DEPT_B', 'normal'),
('admin_tech', 'DEPT_A', 'dept_admin'),
('admin_sales', 'DEPT_B', 'dept_admin');

-- 创建测试订单数据
INSERT INTO orders (order_no, user_id, department_id, amount) VALUES
('ORD001', 'user_tech_1', 'DEPT_A', 100.00),
('ORD002', 'user_tech_2', 'DEPT_A', 200.00),
('ORD003', 'user_sales_1', 'DEPT_B', 300.00);
```

**数据权限验证：**

```python
def test_data_permissions():
    """测试数据级权限控制"""
    test_cases = [
        {
            "user": "admin_sales",  # 销售部管理员
            "endpoint": "/api/orders",
            "expected_orders": ["ORD003"],  # 只应该看到销售部的订单
            "unexpected_orders": ["ORD001", "ORD002"]  # 不应该看到技术部的订单
        },
        {
            "user": "user_tech_1",  # 技术部普通用户
            "endpoint": "/api/orders",
            "expected_orders": ["ORD001"],  # 只能看到自己的订单
            "unexpected_orders": ["ORD002", "ORD003"]
        },
        {
            "user": "superadmin",  # 超级管理员
            "endpoint": "/api/orders",
            "expected_orders": ["ORD001", "ORD002", "ORD003"],  # 能看到所有订单
            "unexpected_orders": []
        }
    ]

    for case in test_cases:
        response = make_authenticated_request(
            case["endpoint"],
            case["user"]
        )

        if response.status_code == 200:
            orders = response.json()["data"]
            order_nos = [order["order_no"] for order in orders]

            # 验证应该看到的订单
            for expected_order in case["expected_orders"]:
                assert expected_order in order_nos, \
                    f"{case['user']} 应该能看到订单 {expected_order}"

            # 验证不应该看到的订单
            for unexpected_order in case["unexpected_orders"]:
                assert unexpected_order not in order_nos, \
                    f"{case['user']} 不应该看到订单 {unexpected_order}"

            print(f"✓ {case['user']} 数据权限验证通过")
        else:
            print(f"✗ {case['user']} 请求失败: {response.status_code}")
```

## 权限变更实时生效测试

### TC508 - 角色权限动态更新

**测试目的：** 验证用户角色或权限变更后能立即生效，无需重新登录

**测试步骤：**

1. 用户 A 以普通用户身份登录系统
2. 验证用户 A 只能访问基础功能
3. 管理员将用户 A 角色变更为部门管理员
4. 用户 A 在不退出登录的情况下刷新页面
5. 验证用户 A 获得了部门管理员权限
6. 管理员撤销用户 A 的部门管理员权限
7. 验证用户 A 权限立即回退到普通用户

**技术实现验证：**

```javascript
// 前端权限实时更新机制测试
class PermissionUpdateTest {
  constructor() {
    this.currentUser = null;
    this.webSocket = null;
  }

  // 建立WebSocket连接接收权限更新通知
  connectPermissionUpdates() {
    this.webSocket = new WebSocket("ws://test-server/permission-updates");

    this.webSocket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === "PERMISSION_CHANGED") {
        this.handlePermissionUpdate(update);
      }
    };
  }

  // 处理权限更新
  handlePermissionUpdate(update) {
    if (update.userId === this.currentUser.id) {
      // 重新获取用户权限信息
      this.refreshUserPermissions();

      // 更新页面显示
      this.updateUIBasedOnPermissions();

      // 显示权限变更通知
      this.showPermissionChangeNotification(update);
    }
  }

  // 测试权限实时更新
  async testRealTimePermissionUpdate() {
    // 1. 模拟用户登录
    const user = await this.loginUser("testuser", "password");
    this.currentUser = user;

    // 2. 建立权限更新连接
    this.connectPermissionUpdates();

    // 3. 验证初始权限
    const initialPermissions = await this.getUserPermissions();
    console.log("初始权限:", initialPermissions);

    // 4. 模拟管理员修改用户角色
    await this.simulateRoleChange(user.id, "dept_admin");

    // 5. 等待权限更新通知
    await this.waitForPermissionUpdate(5000); // 等待5秒

    // 6. 验证权限已更新
    const updatedPermissions = await this.getUserPermissions();
    console.log("更新后权限:", updatedPermissions);

    // 7. 验证新权限生效
    const canAccessAdminPanel = await this.testAdminPanelAccess();
    console.log("管理面板访问测试:", canAccessAdminPanel ? "成功" : "失败");
  }
}
```

### TC509 - 权限缓存清理验证

**测试场景：** 验证权限变更后各级缓存的及时清理

**缓存层级：**

- 前端权限缓存（localStorage/sessionStorage）
- API 网关权限缓存（Redis）
- 应用层权限缓存（内存缓存）
- 数据库权限表

**测试步骤：**

1. 监控各级缓存中的权限数据
2. 执行权限变更操作
3. 验证缓存清理的时序和完整性
4. 确认所有缓存层级都已更新

## 安全测试

### TC510 - 权限绕过攻击测试

**测试目的：** 验证系统对常见权限绕过攻击的防护能力

**攻击场景测试：**

1. **直接对象引用**

```python
def test_direct_object_reference():
    """测试直接对象引用漏洞"""
    # 用户A创建订单
    user_a_token = login_user("userA", "password")
    response = create_order(user_a_token, {"product_id": 1001, "quantity": 1})
    order_id = response.json()["order_id"]

    # 用户B尝试访问用户A的订单
    user_b_token = login_user("userB", "password")
    response = get_order(user_b_token, order_id)

    # 验证访问被拒绝
    assert response.status_code == 403, "用户B不应该能访问用户A的订单"

def test_privilege_escalation():
    """测试权限提升攻击"""
    # 普通用户登录
    normal_user_token = login_user("normaluser", "password")

    # 尝试修改自己的角色为管理员
    response = update_user_role(normal_user_token, "admin")

    # 验证操作被拒绝
    assert response.status_code == 403, "普通用户不应该能提升自己的权限"
```

2. **参数污染攻击**

```python
def test_parameter_pollution():
    """测试参数污染攻击"""
    # 构造恶意请求，尝试通过参数污染绕过权限检查
    malicious_params = {
        "user_id": "normal_user_id",
        "user_id": "admin_user_id",  # 重复参数
        "action": "view",
        "action": "delete"  # 重复参数，尝试提升权限
    }

    response = make_request("/api/users", params=malicious_params)

    # 验证系统正确处理参数污染
    assert response.status_code in [400, 403], "系统应该拒绝参数污染请求"
```

3. **会话固定攻击**

```python
def test_session_fixation():
    """测试会话固定攻击"""
    # 1. 获取未认证的会话ID
    session_id = get_anonymous_session()

    # 2. 使用该会话ID进行登录
    login_response = login_with_session(session_id, "admin", "password")

    # 3. 验证登录后会话ID已更换
    new_session_id = extract_session_id(login_response)
    assert new_session_id != session_id, "登录后应该更换会话ID"
```

### TC511 - 敏感数据泄露测试

**测试目的：** 确保不同权限用户无法获取超出权限范围的敏感数据

**测试场景：**

1. API 响应数据过滤
2. 错误信息泄露
3. 日志数据泄露
4. 批量导出权限控制

```python
def test_sensitive_data_leakage():
    """测试敏感数据泄露"""
    # 普通用户获取用户列表
    normal_user_token = login_user("normaluser", "password")
    response = get_users(normal_user_token)

    if response.status_code == 200:
        users = response.json()["data"]

        # 验证敏感字段已过滤
        for user in users:
            assert "password" not in user, "用户密码不应该在响应中"
            assert "salt" not in user, "密码盐值不应该在响应中"
            assert "secret_key" not in user, "密钥不应该在响应中"

        # 验证只返回允许查看的用户
        admin_users = [u for u in users if u.get("role") == "admin"]
        assert len(admin_users) == 0, "普通用户不应该看到管理员信息"

def test_error_message_leakage():
    """测试错误信息泄露"""
    # 尝试访问不存在的资源
    response = get_user_by_id("invalid_user_id")

    error_message = response.json().get("message", "")

    # 验证错误信息不包含敏感内容
    sensitive_keywords = ["database", "sql", "table", "connection", "server"]
    for keyword in sensitive_keywords:
        assert keyword.lower() not in error_message.lower(), \
            f"错误信息不应该包含敏感词: {keyword}"
```

## 多租户权限隔离测试

### TC512 - 租户数据隔离验证

**测试背景：** 在 SaaS 模式下，确保不同租户的数据完全隔离

**租户模型：**

- 租户 A：tech_company（技术公司）
- 租户 B：sales_company（销售公司）
- 租户 C：education_org（教育机构）

**测试步骤：**

1. 在不同租户下创建相同用户名的账号
2. 验证租户间用户数据隔离
3. 测试跨租户数据访问防护
4. 验证共享资源的权限控制

```python
class MultiTenantPermissionTest:
    def __init__(self):
        self.tenants = {
            "tech_company": {"admin": "tech_admin", "user": "tech_user"},
            "sales_company": {"admin": "sales_admin", "user": "sales_user"},
            "education_org": {"admin": "edu_admin", "user": "edu_user"}
        }

    def test_tenant_data_isolation(self):
        """测试租户数据隔离"""
        # 在不同租户创建相同名称的数据
        for tenant_id, users in self.tenants.items():
            # 切换到对应租户
            set_tenant_context(tenant_id)

            # 创建测试数据
            create_product({
                "name": "测试产品",
                "price": 100.00,
                "tenant_id": tenant_id
            })

        # 验证每个租户只能看到自己的数据
        for tenant_id in self.tenants.keys():
            set_tenant_context(tenant_id)

            products = get_products()

            # 验证只返回当前租户的产品
            for product in products:
                assert product["tenant_id"] == tenant_id, \
                    f"租户 {tenant_id} 看到了其他租户的数据"

            print(f"✓ 租户 {tenant_id} 数据隔离验证通过")

    def test_cross_tenant_access_prevention(self):
        """测试跨租户访问防护"""
        # 租户A用户尝试访问租户B的数据
        tenant_a_token = login_user_with_tenant("tech_admin", "tech_company")

        # 构造租户B的资源URL
        tenant_b_resource_url = "/api/products?tenant_id=sales_company"

        response = make_request(
            tenant_b_resource_url,
            headers={"Authorization": f"Bearer {tenant_a_token}"}
        )

        # 验证访问被拒绝
        assert response.status_code == 403, "不应该能访问其他租户的数据"

    def test_shared_resource_permissions(self):
        """测试共享资源权限"""
        # 系统级共享资源（如系统公告）
        system_announcement = create_system_announcement({
            "title": "系统维护通知",
            "content": "系统将在今晚进行维护",
            "scope": "all_tenants"
        })

        # 验证所有租户都能看到
        for tenant_id in self.tenants.keys():
            set_tenant_context(tenant_id)
            announcements = get_system_announcements()

            found = any(
                ann["id"] == system_announcement["id"]
                for ann in announcements
            )
            assert found, f"租户 {tenant_id} 应该能看到系统公告"
```

## 性能和并发测试

### TC513 - 权限检查性能测试

**测试目的：** 验证权限检查机制在高并发情况下的性能表现

**性能指标：**

- 权限检查响应时间 < 50ms
- 1000 并发用户权限验证成功率 > 99%
- 权限缓存命中率 > 95%

```python
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

class PermissionPerformanceTest:
    def __init__(self):
        self.base_url = "http://test-api.example.com"
        self.test_results = []

    async def test_permission_check_performance(self):
        """权限检查性能测试"""
        # 准备测试用户token
        test_tokens = []
        for i in range(100):
            token = await self.get_test_user_token(f"testuser{i}")
            test_tokens.append(token)

        # 并发执行权限检查
        tasks = []
        for token in test_tokens:
            for _ in range(10):  # 每个用户执行10次权限检查
                task = self.check_permission_async(token)
                tasks.append(task)

        start_time = time.time()
        results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = time.time()

        # 统计结果
        total_requests = len(results)
        successful_requests = sum(1 for r in results if isinstance(r, dict) and r.get("success"))
        average_response_time = (end_time - start_time) / total_requests

        print(f"权限检查性能测试结果:")
        print(f"总请求数: {total_requests}")
        print(f"成功请求数: {successful_requests}")
        print(f"成功率: {(successful_requests/total_requests)*100:.2f}%")
        print(f"平均响应时间: {average_response_time*1000:.2f}ms")

        # 验证性能指标
        assert (successful_requests/total_requests) > 0.99, "权限检查成功率不达标"
        assert average_response_time < 0.05, "权限检查响应时间过长"

    async def check_permission_async(self, token):
        """异步权限检查"""
        try:
            async with aiohttp.ClientSession() as session:
                start = time.time()

                async with session.get(
                    f"{self.base_url}/api/users/profile",
                    headers={"Authorization": f"Bearer {token}"}
                ) as response:
                    end = time.time()

                    return {
                        "success": response.status == 200,
                        "response_time": end - start
                    }
        except Exception as e:
            return {"success": False, "error": str(e)}
```

## 测试数据清理和恢复

### 测试环境管理

```python
class PermissionTestDataManager:
    def __init__(self):
        self.db_connection = get_test_db_connection()
        self.test_data_records = []

    def setup_test_data(self):
        """设置测试数据"""
        # 创建测试角色
        test_roles = [
            {"name": "test_admin", "permissions": ["all"]},
            {"name": "test_user", "permissions": ["read"]},
            {"name": "test_dept_admin", "permissions": ["dept_manage"]}
        ]

        for role in test_roles:
            role_id = self.create_test_role(role)
            self.test_data_records.append(("roles", role_id))

        # 创建测试用户
        test_users = [
            {"username": "perm_test_admin", "role": "test_admin"},
            {"username": "perm_test_user", "role": "test_user"},
            {"username": "perm_test_dept", "role": "test_dept_admin"}
        ]

        for user in test_users:
            user_id = self.create_test_user(user)
            self.test_data_records.append(("users", user_id))

    def cleanup_test_data(self):
        """清理测试数据"""
        for table, record_id in reversed(self.test_data_records):
            try:
                self.db_connection.execute(
                    f"DELETE FROM {table} WHERE id = %s",
                    (record_id,)
                )
                print(f"清理测试数据: {table}#{record_id}")
            except Exception as e:
                print(f"清理数据失败: {e}")

        self.test_data_records.clear()

    def create_test_role(self, role_data):
        """创建测试角色"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            "INSERT INTO roles (name, permissions) VALUES (%s, %s) RETURNING id",
            (role_data["name"], json.dumps(role_data["permissions"]))
        )
        return cursor.fetchone()[0]

    def create_test_user(self, user_data):
        """创建测试用户"""
        cursor = self.db_connection.cursor()
        cursor.execute(
            "INSERT INTO users (username, role, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (user_data["username"], user_data["role"], "test_hash_123")
        )
        return cursor.fetchone()[0]
```

## 测试报告生成

### 权限测试总结报告

```python
class PermissionTestReporter:
    def __init__(self):
        self.test_results = []
        self.start_time = None
        self.end_time = None

    def generate_test_report(self):
        """生成测试报告"""
        report = {
            "测试概况": {
                "测试时间": f"{self.start_time} - {self.end_time}",
                "测试用例总数": len(self.test_results),
                "通过用例数": len([r for r in self.test_results if r["status"] == "PASS"]),
                "失败用例数": len([r for r in self.test_results if r["status"] == "FAIL"]),
                "通过率": f"{self.calculate_pass_rate():.1f}%"
            },
            "功能测试结果": self.group_results_by_category("功能测试"),
            "安全测试结果": self.group_results_by_category("安全测试"),
            "性能测试结果": self.group_results_by_category("性能测试"),
            "发现的问题": self.get_failed_test_issues(),
            "建议和改进": self.get_recommendations()
        }

        return report

    def calculate_pass_rate(self):
        """计算通过率"""
        if not self.test_results:
            return 0
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        return (passed / len(self.test_results)) * 100

    def group_results_by_category(self, category):
        """按类别分组测试结果"""
        category_results = [
            r for r in self.test_results
            if r.get("category") == category
        ]

        return {
            "总数": len(category_results),
            "通过": len([r for r in category_results if r["status"] == "PASS"]),
            "失败": len([r for r in category_results if r["status"] == "FAIL"]),
            "详细结果": category_results
        }

    def get_failed_test_issues(self):
        """获取失败测试的问题描述"""
        failed_tests = [r for r in self.test_results if r["status"] == "FAIL"]

        issues = []
        for test in failed_tests:
            issues.append({
                "测试用例": test["name"],
                "失败原因": test.get("error_message", "未知错误"),
                "严重程度": test.get("severity", "中"),
                "建议修复": test.get("fix_suggestion", "需要开发团队分析")
            })

        return issues

    def get_recommendations(self):
        """获取测试建议"""
        return [
            "加强权限变更后的缓存清理机制",
            "优化高并发场景下的权限检查性能",
            "完善权限相关的错误提示信息",
            "增加权限操作的审计日志记录",
            "建立权限变更的自动化回归测试"
        ]

# 使用示例
if __name__ == "__main__":
    # 执行权限测试
    reporter = PermissionTestReporter()
    reporter.start_time = datetime.now()

    # 这里执行所有权限测试用例...

    reporter.end_time = datetime.now()

    # 生成并输出报告
    report = reporter.generate_test_report()
    print(json.dumps(report, indent=2, ensure_ascii=False))
```

本测试用例涵盖了用户权限管理系统的所有关键功能点，包括角色权限验证、访问控制、数据权限、安全防护等方面。通过全面的自动化测试脚本和详细的测试场景设计，能够有效保障权限系统的安全性和可靠性。
