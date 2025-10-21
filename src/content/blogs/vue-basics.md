---
title: "vue-basics"
description: "测试用例描述测试用例描述"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["vue", "前端"]
---

# 测试用例 1 - 用户登录功能测试

## 测试目标

验证用户登录功能在各种场景下的正确性，包括正常登录、异常处理、安全机制等方面的测试。

## 测试环境

- 测试环境：测试环境服务器
- 测试工具：Selenium WebDriver
- 浏览器版本：Chrome 120+, Firefox 110+, Safari 16+
- 测试数据：预置测试账号 10 个

## 功能测试用例

### TC001 - 正常登录测试

**测试步骤：**

1. 打开登录页面
2. 输入正确的用户名：testuser001
3. 输入正确的密码：Test123456
4. 点击登录按钮
5. 验证登录成功

**预期结果：**

- 用户成功登录系统
- 页面跳转到首页
- 显示用户头像和用户名
- Cookie 中保存登录状态

### TC002 - 用户名错误测试

**测试步骤：**

1. 打开登录页面
2. 输入错误的用户名：wronguser
3. 输入正确的密码：Test123456
4. 点击登录按钮

**预期结果：**

- 显示错误提示："用户名或密码错误"
- 页面保持在登录页面
- 用户名输入框获得焦点

### TC003 - 密码错误测试

**测试步骤：**

1. 打开登录页面
2. 输入正确的用户名：testuser001
3. 输入错误的密码：wrongpassword
4. 点击登录按钮

**预期结果：**

- 显示错误提示："用户名或密码错误"
- 页面保持在登录页面
- 密码输入框清空并获得焦点

## 边界值测试

### TC004 - 用户名长度边界测试

**测试数据：**

- 最小长度：3 个字符
- 最大长度：20 个字符
- 边界值：2 个字符、21 个字符

**测试步骤：**

1. 分别输入不同长度的用户名
2. 输入正确密码
3. 点击登录按钮
4. 验证系统响应

**预期结果：**

- 长度不符合要求时显示相应提示
- 符合长度要求时正常处理

### TC005 - 密码复杂度测试

**测试场景：**

- 纯数字密码：12345678
- 纯字母密码：abcdefgh
- 字母数字组合：abc12345
- 包含特殊字符：abc123!@

**预期结果：**

- 系统按照密码策略进行验证
- 不符合策略的密码给出明确提示

## 安全性测试

### TC006 - SQL 注入测试

**测试数据：**

```sql
' OR '1'='1
' UNION SELECT * FROM users--
admin'; DROP TABLE users;--
```

**测试步骤：**

1. 在用户名或密码字段输入 SQL 注入语句
2. 提交登录请求
3. 观察系统响应

**预期结果：**

- 系统正确处理特殊字符
- 不执行恶意 SQL 语句
- 返回正常的登录失败提示

### TC007 - XSS 攻击测试

**测试数据：**

```javascript
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')
```

**预期结果：**

- 输入被正确转义或过滤
- 不执行恶意脚本
- 页面正常显示

## 性能测试

### TC008 - 登录响应时间测试

**测试条件：**

- 并发用户数：100
- 测试持续时间：10 分钟
- 网络环境：局域网

**性能指标：**

- 平均响应时间：< 2 秒
- 95%响应时间：< 5 秒
- 错误率：< 1%
- 系统资源使用率：< 80%

### TC009 - 并发登录测试

**测试场景：**

- 同时 1000 个用户尝试登录
- 观察系统稳定性
- 监控数据库连接数
- 检查内存使用情况

## 兼容性测试

### TC010 - 浏览器兼容性

**测试浏览器：**

- Chrome 120+
- Firefox 110+
- Safari 16+
- Edge 110+

**测试内容：**

- 页面布局显示
- 功能操作正常
- JavaScript 执行正确
- CSS 样式渲染正确

### TC011 - 移动端适配测试

**测试设备：**

- iPhone 14 Pro (iOS 17)
- Samsung Galaxy S23 (Android 13)
- iPad Air (iPadOS 17)

**测试点：**

- 响应式布局
- 触摸操作
- 软键盘适配
- 页面缩放

## 自动化测试脚本

```python
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginTest:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.base_url = "http://test.example.com"

    def test_normal_login(self):
        """正常登录测试"""
        self.driver.get(f"{self.base_url}/login")

        # 输入用户名
        username_input = self.driver.find_element(By.ID, "username")
        username_input.send_keys("testuser001")

        # 输入密码
        password_input = self.driver.find_element(By.ID, "password")
        password_input.send_keys("Test123456")

        # 点击登录按钮
        login_button = self.driver.find_element(By.ID, "loginBtn")
        login_button.click()

        # 等待页面跳转
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("/dashboard")
        )

        # 验证登录成功
        user_info = self.driver.find_element(By.CLASS_NAME, "user-info")
        assert "testuser001" in user_info.text

    def test_wrong_password(self):
        """错误密码测试"""
        self.driver.get(f"{self.base_url}/login")

        username_input = self.driver.find_element(By.ID, "username")
        username_input.send_keys("testuser001")

        password_input = self.driver.find_element(By.ID, "password")
        password_input.send_keys("wrongpassword")

        login_button = self.driver.find_element(By.ID, "loginBtn")
        login_button.click()

        # 验证错误提示
        error_msg = WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "error-message"))
        )
        assert "用户名或密码错误" in error_msg.text

    def tearDown(self):
        self.driver.quit()

# 测试执行
if __name__ == "__main__":
    test = LoginTest()
    test.test_normal_login()
    test.test_wrong_password()
    test.tearDown()
    print("测试执行完成")
```

## 测试数据准备

### 测试账号

| 用户名      | 密码       | 角色     | 状态 | 备注           |
| ----------- | ---------- | -------- | ---- | -------------- |
| testuser001 | Test123456 | 普通用户 | 激活 | 正常测试账号   |
| testuser002 | Test123456 | 管理员   | 激活 | 管理员权限测试 |
| testuser003 | Test123456 | 普通用户 | 禁用 | 禁用账号测试   |
| testuser004 | Test123456 | 普通用户 | 锁定 | 账号锁定测试   |

### 环境配置

```yaml
# 测试环境配置
database:
  host: test-db.example.com
  port: 3306
  name: test_db
  username: test_user
  password: test_password

redis:
  host: test-redis.example.com
  port: 6379
  database: 0

application:
  host: test.example.com
  port: 8080
  ssl: false
```

## 缺陷统计

### 已发现缺陷

1. **BUG-001**: 用户名包含特殊字符时登录失败但无错误提示

   - 严重程度：中
   - 状态：已修复
   - 修复版本：v1.2.1

2. **BUG-002**: 移动端登录页面在横屏模式下布局错乱

   - 严重程度：低
   - 状态：待修复
   - 预计修复版本：v1.3.0

3. **BUG-003**: 并发登录时偶现响应时间超过 10 秒
   - 严重程度：高
   - 状态：修复中
   - 负责人：开发团队

## 测试结论

### 测试覆盖率

- 功能测试覆盖率：95%
- 代码覆盖率：87%
- 用例执行通过率：92%
- 自动化覆盖率：75%

### 风险评估

- **高风险**：并发性能问题
- **中风险**：移动端兼容性问题
- **低风险**：特殊字符处理问题

### 发布建议

建议在修复 BUG-003 并发性能问题后再发布到生产环境。其他低优先级问题可在后续版本中修复。

## 附录

### 测试工具清单

- **自动化工具**：Selenium WebDriver 4.15
- **性能测试**：JMeter 5.5
- **接口测试**：Postman, Newman
- **缺陷管理**：Jira
- **测试管理**：TestRail

### 参考文档

- 需求文档：REQ-LOGIN-001
- 设计文档：DESIGN-LOGIN-001
- API 文档：API-DOC-v1.2
- 测试策略：TEST-STRATEGY-v2.0
