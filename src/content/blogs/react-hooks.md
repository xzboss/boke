---
title: "react-hooks"
description: "测试用例描述测试用例描述"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["react", "框架", "前端", "hook", "hooks"]
---

# 测试用例 3 - 购物车功能测试

## 测试背景

购物车是电商网站的关键功能模块，直接影响用户的购买体验和转化率。本测试用例将全面验证购物车的各项功能，确保用户能够顺畅地管理购买商品。

## 测试目标

- 验证商品添加到购物车的功能
- 验证购物车商品数量修改功能
- 验证商品删除功能
- 验证价格计算准确性
- 验证库存检查机制
- 验证购物车数据持久化

## 功能测试用例

### TC301 - 添加商品到购物车

**测试目的：** 验证用户能成功将商品添加到购物车

**前置条件：**

- 用户已登录系统
- 商品详情页面正常显示
- 商品库存充足

**测试步骤：**

1. 进入商品详情页面
2. 选择商品规格（颜色、尺寸等）
3. 设置购买数量为 2
4. 点击"加入购物车"按钮
5. 查看购物车图标数量变化
6. 进入购物车页面验证商品信息

**预期结果：**

- 商品成功添加到购物车
- 购物车图标显示商品数量增加
- 购物车页面显示正确的商品信息（名称、规格、数量、价格）
- 显示操作成功提示信息

### TC302 - 重复添加相同商品

**测试场景：**

- 同一商品，相同规格，多次添加

**测试步骤：**

1. 将商品 A（红色，L 码）添加到购物车，数量 1
2. 再次将相同商品（红色，L 码）添加到购物车，数量 1
3. 查看购物车页面

**预期结果：**

- 购物车中该商品数量变为 2
- 不会产生重复的商品条目
- 总价格正确计算

### TC303 - 修改购物车商品数量

**测试步骤：**

1. 进入购物车页面
2. 选择一个商品
3. 点击数量增加按钮（+）
4. 点击数量减少按钮（-）
5. 直接在数量输入框输入数字 10
6. 输入超过库存数量的数值

**预期结果：**

- 点击+/-按钮，数量正确增减
- 输入框直接修改数量生效
- 超过库存时显示警告并限制为最大库存数
- 价格实时更新
- 总价格重新计算

### TC304 - 删除购物车商品

**测试方法：**

1. 在购物车页面选择要删除的商品
2. 点击"删除"按钮
3. 确认删除操作

**预期结果：**

- 商品从购物车中移除
- 总价格和商品数量重新计算
- 显示删除成功提示
- 如果购物车为空，显示空购物车提示

### TC305 - 批量操作测试

**测试内容：**

- 全选/取消全选功能
- 批量删除功能
- 移入收藏夹功能

**测试步骤：**

1. 购物车中添加多个商品
2. 点击"全选"复选框
3. 验证所有商品被选中
4. 取消选中某些商品
5. 点击"删除选中"
6. 确认批量删除操作

**预期结果：**

- 全选功能正常工作
- 部分选择状态正确显示
- 批量删除只删除选中商品
- 未选中商品保留在购物车中

## 价格计算测试

### TC306 - 价格计算准确性

**测试数据：**

| 商品   | 单价  | 数量 | 优惠     | 预期小计 |
| ------ | ----- | ---- | -------- | -------- |
| 商品 A | ¥100  | 2    | 无       | ¥200     |
| 商品 B | ¥88.5 | 3    | 满减 ¥10 | ¥255.5   |
| 商品 C | ¥199  | 1    | 9 折     | ¥179.1   |

**测试步骤：**

1. 分别添加以上商品到购物车
2. 验证每个商品的小计金额
3. 验证总金额计算
4. 应用优惠券或促销活动
5. 验证优惠后的最终金额

**预期结果：**

- 所有价格计算准确无误
- 优惠活动正确应用
- 小数点处理正确（四舍五入）
- 税费计算正确（如适用）

### TC307 - 促销活动测试

**促销类型：**

- 满减活动：满 200 减 20
- 折扣活动：第二件半价
- 买赠活动：买 2 送 1
- 会员折扣：VIP 用户 9.5 折

**测试场景：**

1. 购物车金额达到满减条件
2. 购买多件相同商品
3. 参与买赠活动
4. VIP 用户购买商品

**预期结果：**

- 各种促销活动正确应用
- 促销规则优先级正确处理
- 促销信息清晰显示
- 不符合条件时促销不生效

## 库存检查测试

### TC308 - 库存不足处理

**测试场景：**

- 商品库存为 5 件，用户购物车中已有 3 件
- 用户尝试增加数量到 10 件

**测试步骤：**

1. 在购物车页面将数量修改为 10
2. 点击更新按钮
3. 观察系统响应

**预期结果：**

- 显示库存不足提醒
- 数量自动调整为最大可购买数量（5 件）
- 提供库存监控提醒选项

### TC309 - 库存实时更新

**测试条件：**

- 多个用户同时购买同一商品
- 商品库存有限

**测试步骤：**

1. 用户 A 将商品添加到购物车（数量 5）
2. 用户 B 同时将相同商品添加到购物车（数量 3）
3. 库存总量为 6 件
4. 两用户分别尝试结算

**预期结果：**

- 先结算的用户成功购买
- 后结算的用户收到库存不足提醒
- 库存数据实时更新

## 数据持久化测试

### TC310 - 登录状态购物车同步

**测试步骤：**

1. 用户未登录时添加商品到购物车
2. 用户登录账号
3. 查看购物车内容
4. 在另一设备登录相同账号
5. 查看购物车内容

**预期结果：**

- 登录后本地购物车与服务端数据合并
- 不同设备间购物车数据同步
- 商品信息完整保存
- 数量累计正确处理

### TC311 - 长期存储测试

**测试场景：**

- 商品添加到购物车后 7 天不操作
- 商品添加到购物车后 30 天不操作

**预期结果：**

- 7 天内购物车数据完整保存
- 30 天后可能清理或提醒用户
- 清理前给用户发送提醒通知

## 移动端适配测试

### TC312 - 移动端购物车体验

**测试设备：**

- iPhone 13 Pro (iOS 16)
- Samsung Galaxy S22 (Android 12)
- 各种屏幕尺寸适配

**测试内容：**

- 购物车页面布局适配
- 商品信息显示完整
- 操作按钮大小适中
- 滑动操作流畅
- 数量修改操作便捷

**预期结果：**

- 移动端界面友好易用
- 所有功能正常工作
- 触摸操作响应灵敏
- 页面加载速度快

## 性能测试

### TC313 - 大量商品处理

**测试条件：**

- 购物车中添加 100 种不同商品
- 每种商品数量 10 件

**测试指标：**

- 页面加载时间：<3 秒
- 数量修改响应时间：<1 秒
- 价格计算时间：<2 秒
- 批量操作响应时间：<5 秒

### TC314 - 并发操作测试

**测试场景：**

- 50 个用户同时操作购物车
- 每用户执行添加、修改、删除操作

**监控指标：**

- 服务器响应时间
- 数据库连接数
- 内存使用情况
- 错误率统计

## 自动化测试脚本

```python
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class ShoppingCartTest:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.base_url = "http://test-shop.example.com"
        self.wait = WebDriverWait(self.driver, 10)

    def login(self, username="testuser", password="test123"):
        """登录系统"""
        self.driver.get(f"{self.base_url}/login")

        username_input = self.driver.find_element(By.ID, "username")
        password_input = self.driver.find_element(By.ID, "password")
        login_btn = self.driver.find_element(By.ID, "loginBtn")

        username_input.send_keys(username)
        password_input.send_keys(password)
        login_btn.click()

        # 等待登录成功
        self.wait.until(EC.url_contains("/dashboard"))

    def add_product_to_cart(self, product_id, quantity=1):
        """添加商品到购物车"""
        self.driver.get(f"{self.base_url}/product/{product_id}")

        # 设置数量
        quantity_input = self.driver.find_element(By.ID, "quantity")
        quantity_input.clear()
        quantity_input.send_keys(str(quantity))

        # 添加到购物车
        add_cart_btn = self.driver.find_element(By.ID, "addToCart")
        add_cart_btn.click()

        # 验证成功提示
        success_msg = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
        )
        assert "成功添加到购物车" in success_msg.text

    def test_add_to_cart(self):
        """测试添加商品到购物车"""
        self.login()

        # 记录添加前购物车数量
        cart_count_before = self.get_cart_count()

        # 添加商品
        self.add_product_to_cart("1001", 2)

        # 验证购物车数量增加
        cart_count_after = self.get_cart_count()
        assert cart_count_after == cart_count_before + 2

    def test_modify_quantity(self):
        """测试修改商品数量"""
        self.login()
        self.add_product_to_cart("1001", 1)

        # 进入购物车页面
        self.driver.get(f"{self.base_url}/cart")

        # 修改数量
        quantity_input = self.driver.find_element(By.CLASS_NAME, "quantity-input")
        quantity_input.clear()
        quantity_input.send_keys("5")

        # 点击更新按钮
        update_btn = self.driver.find_element(By.CLASS_NAME, "update-quantity")
        update_btn.click()

        # 验证数量更新
        time.sleep(1)  # 等待更新完成
        updated_quantity = quantity_input.get_attribute("value")
        assert updated_quantity == "5"

        # 验证价格更新
        price_element = self.driver.find_element(By.CLASS_NAME, "item-total")
        # 这里需要根据实际商品价格计算预期值

    def test_remove_item(self):
        """测试删除商品"""
        self.login()
        self.add_product_to_cart("1001", 1)

        # 进入购物车页面
        self.driver.get(f"{self.base_url}/cart")

        # 记录删除前商品数量
        items_before = len(self.driver.find_elements(By.CLASS_NAME, "cart-item"))

        # 点击删除按钮
        remove_btn = self.driver.find_element(By.CLASS_NAME, "remove-item")
        remove_btn.click()

        # 确认删除
        confirm_btn = self.wait.until(
            EC.element_to_be_clickable((By.CLASS_NAME, "confirm-remove"))
        )
        confirm_btn.click()

        # 验证商品被删除
        time.sleep(1)
        items_after = len(self.driver.find_elements(By.CLASS_NAME, "cart-item"))
        assert items_after == items_before - 1

    def test_price_calculation(self):
        """测试价格计算"""
        self.login()

        # 添加多个商品
        products = [
            {"id": "1001", "quantity": 2, "price": 100},
            {"id": "1002", "quantity": 1, "price": 250},
            {"id": "1003", "quantity": 3, "price": 80}
        ]

        expected_total = 0
        for product in products:
            self.add_product_to_cart(product["id"], product["quantity"])
            expected_total += product["price"] * product["quantity"]

        # 进入购物车页面验证总价
        self.driver.get(f"{self.base_url}/cart")

        total_element = self.driver.find_element(By.CLASS_NAME, "cart-total")
        actual_total = float(total_element.text.replace("¥", "").replace(",", ""))

        assert actual_total == expected_total, f"价格计算错误: 期望{expected_total}, 实际{actual_total}"

    def test_stock_limit(self):
        """测试库存限制"""
        self.login()

        # 尝试添加超过库存的数量
        self.driver.get(f"{self.base_url}/product/1001")

        quantity_input = self.driver.find_element(By.ID, "quantity")
        quantity_input.clear()
        quantity_input.send_keys("999")  # 假设库存不足999

        add_cart_btn = self.driver.find_element(By.ID, "addToCart")
        add_cart_btn.click()

        # 验证库存不足提示
        try:
            error_msg = self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "stock-error"))
            )
            assert "库存不足" in error_msg.text
        except TimeoutException:
            # 如果没有错误提示，检查是否自动调整为最大库存
            cart_page = self.driver.get(f"{self.base_url}/cart")
            quantity_in_cart = self.driver.find_element(By.CLASS_NAME, "quantity-input")
            cart_quantity = int(quantity_in_cart.get_attribute("value"))
            assert cart_quantity < 999, "库存限制未生效"

    def get_cart_count(self):
        """获取购物车商品数量"""
        try:
            cart_badge = self.driver.find_element(By.CLASS_NAME, "cart-count")
            return int(cart_badge.text)
        except:
            return 0

    def tearDown(self):
        self.driver.quit()

# 批量测试执行
if __name__ == "__main__":
    test = ShoppingCartTest()

    try:
        print("开始执行购物车功能测试...")

        test.test_add_to_cart()
        print("✓ 添加商品到购物车测试通过")

        test.test_modify_quantity()
        print("✓ 修改商品数量测试通过")

        test.test_remove_item()
        print("✓ 删除商品测试通过")

        test.test_price_calculation()
        print("✓ 价格计算测试通过")

        test.test_stock_limit()
        print("✓ 库存限制测试通过")

        print("所有购物车测试执行完成！")

    except Exception as e:
        print(f"测试执行失败: {str(e)}")

    finally:
        test.tearDown()

# API 接口测试
import requests
import json

class CartAPITest:
    def __init__(self):
        self.base_url = "http://api.test-shop.example.com"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer test_token"
        }

    def test_add_to_cart_api(self):
        """测试添加商品API"""
        url = f"{self.base_url}/api/cart/add"
        data = {
            "product_id": "1001",
            "quantity": 2,
            "spec": {"color": "red", "size": "L"}
        }

        response = requests.post(url, json=data, headers=self.headers)

        assert response.status_code == 200
        result = response.json()
        assert result["success"] == True
        assert "cart_id" in result

    def test_get_cart_api(self):
        """测试获取购物车API"""
        url = f"{self.base_url}/api/cart"

        response = requests.get(url, headers=self.headers)

        assert response.status_code == 200
        result = response.json()
        assert "items" in result
        assert "total_price" in result
        assert "total_quantity" in result

    def test_update_quantity_api(self):
        """测试更新数量API"""
        # 先添加商品
        self.test_add_to_cart_api()

        url = f"{self.base_url}/api/cart/update"
        data = {
            "product_id": "1001",
            "quantity": 5
        }

        response = requests.put(url, json=data, headers=self.headers)

        assert response.status_code == 200
        result = response.json()
        assert result["success"] == True

    def test_remove_item_api(self):
        """测试删除商品API"""
        url = f"{self.base_url}/api/cart/remove"
        data = {"product_id": "1001"}

        response = requests.delete(url, json=data, headers=self.headers)

        assert response.status_code == 200
        result = response.json()
        assert result["success"] == True

# API测试执行
if __name__ == "__main__":
    api_test = CartAPITest()

    print("开始执行购物车API测试...")

    api_test.test_add_to_cart_api()
    print("✓ 添加商品API测试通过")

    api_test.test_get_cart_api()
    print("✓ 获取购物车API测试通过")

    api_test.test_update_quantity_api()
    print("✓ 更新数量API测试通过")

    api_test.test_remove_item_api()
    print("✓ 删除商品API测试通过")

    print("所有API测试执行完成！")
```

## 测试环境配置

### 测试数据库配置

```sql
-- 商品表测试数据
INSERT INTO products (id, name, price, stock, status) VALUES
(1001, '测试商品A', 100.00, 50, 'active'),
(1002, '测试商品B', 250.00, 20, 'active'),
(1003, '测试商品C', 80.00, 100, 'active'),
(1004, '测试商品D', 199.99, 5, 'active');

-- 用户测试数据
INSERT INTO users (id, username, email, status) VALUES
(2001, 'testuser001', 'test1@example.com', 'active'),
(2002, 'testuser002', 'test2@example.com', 'active'),
(2003, 'vipuser001', 'vip@example.com', 'vip');

-- 促销活动测试数据
INSERT INTO promotions (id, name, type, rule, discount) VALUES
(3001, '满200减20', 'full_reduction', '{"min_amount": 200}', 20),
(3002, '第二件半价', 'second_half_price', '{"category": "electronics"}', 0.5),
(3003, 'VIP折扣', 'member_discount', '{"member_level": "vip"}', 0.95);
```

## 缺陷统计分析

### 历史缺陷分布

| 缺陷类型   | 数量 | 占比 | 严重程度分布     |
| ---------- | ---- | ---- | ---------------- |
| 功能缺陷   | 8    | 40%  | 高:2, 中:4, 低:2 |
| 性能缺陷   | 3    | 15%  | 高:1, 中:2, 低:0 |
| 兼容性缺陷 | 5    | 25%  | 高:0, 中:2, 低:3 |
| 界面缺陷   | 4    | 20%  | 高:0, 中:1, 低:3 |

### 当前版本缺陷状态

1. **CART-001**: 购物车商品数量显示延迟

   - 类型：功能缺陷
   - 严重程度：中
   - 状态：已修复
   - 影响：用户添加商品后需要刷新页面才能看到正确数量

2. **CART-002**: 移动端价格计算精度问题

   - 类型：功能缺陷
   - 严重程度：高
   - 状态：修复中
   - 影响：小数点后价格计算不准确

3. **CART-003**: 大量商品时页面加载缓慢
   - 类型：性能缺陷
   - 严重程度：中
   - 状态：待修复
   - 影响：购物车超过 50 件商品时加载时间>5 秒

## 测试总结报告

### 测试执行摘要

- **测试周期**：2024.01.15 - 2024.01.25
- **测试人员**：3 人
- **总用例数**：45 个
- **执行用例数**：43 个
- **通过用例数**：38 个
- **失败用例数**：5 个
- **阻塞用例数**：2 个
- **用例通过率**：88.4%

### 功能覆盖度评估

| 功能模块 | 覆盖率 | 通过率 | 关键问题       |
| -------- | ------ | ------ | -------------- |
| 添加商品 | 100%   | 95%    | 库存检查时机   |
| 数量修改 | 100%   | 85%    | 大数量输入处理 |
| 商品删除 | 100%   | 90%    | 批量删除确认   |
| 价格计算 | 100%   | 80%    | 精度和优惠叠加 |
| 数据同步 | 90%    | 85%    | 多设备同步延迟 |

### 质量评估结论

**整体质量**：良好

- 核心功能基本稳定
- 主要用户路径无阻塞问题
- 性能在可接受范围内
- 用户体验需要进一步优化

**发布建议**：

1. 修复价格计算精度问题后可发布
2. 性能优化可在后续版本进行
3. 建议增加用户操作引导

**后续改进方向**：

1. 加强边界值测试
2. 增加异常场景覆盖
3. 完善自动化测试覆盖率
4. 建立性能监控机制
