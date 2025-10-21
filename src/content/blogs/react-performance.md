---
title: "react-performance"
description: "测试用例描述测试用例描述"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["react", "框架", "前端", "hook", "性能"]
---

# 测试用例 4 - 订单管理系统测试

## 测试概述

订单管理系统是电商平台的核心业务模块，涉及订单创建、状态流转、支付处理、物流跟踪等关键功能。本测试用例将对订单全生命周期进行详细测试验证。

## 测试目标

- 验证订单创建流程的完整性和准确性
- 验证订单状态流转的正确性
- 验证支付集成功能
- 验证订单查询和筛选功能
- 验证订单修改和取消功能
- 验证系统异常处理能力

## 业务流程测试

### TC401 - 标准订单创建流程

**测试目的：** 验证用户能够成功创建订单并完成基本信息填写

**业务流程：**
购物车 → 确认订单 → 填写收货信息 → 选择支付方式 → 提交订单 → 支付 → 订单创建成功

**前置条件：**

- 用户已登录系统
- 购物车中有商品
- 收货地址信息完整
- 支付方式可用

**测试步骤：**

1. 用户在购物车页面点击"去结算"
2. 进入订单确认页面，检查商品信息
3. 选择收货地址或新增收货地址
4. 选择配送方式（标准快递/次日达等）
5. 选择支付方式（微信/支付宝/银行卡）
6. 填写订单备注（可选）
7. 确认订单总金额和优惠信息
8. 点击"提交订单"按钮
9. 跳转到支付页面完成支付
10. 支付成功后查看订单详情

**预期结果：**

- 订单创建成功，获得唯一订单号
- 订单状态为"待发货"
- 订单金额计算正确
- 收货信息和配送方式正确保存
- 库存相应扣减
- 用户收到订单确认通知

### TC402 - 订单地址管理

**测试场景：**

- 选择已有地址
- 新增收货地址
- 修改收货地址
- 删除收货地址
- 设置默认地址

**地址信息验证：**

- 收件人姓名：必填，2-20 个字符
- 手机号码：必填，11 位数字，格式验证
- 详细地址：必填，不超过 100 字符
- 邮政编码：6 位数字
- 地区选择：省/市/区三级联动

**测试步骤：**

1. 在订单确认页面点击"新增地址"
2. 填写完整的收货地址信息
3. 提交地址信息
4. 验证地址保存成功
5. 在地址列表中选择新添加的地址

**预期结果：**

- 地址信息验证规则生效
- 地址保存成功并可以正常选择
- 默认地址功能正常工作
- 地区联动选择正确

### TC403 - 配送方式选择

**配送选项测试：**

| 配送方式 | 配送时间     | 配送费用 | 适用条件     |
| -------- | ------------ | -------- | ------------ |
| 标准快递 | 3-5 个工作日 | ¥8       | 全国可达     |
| 次日达   | 次日送达     | ¥15      | 一线城市     |
| 当日达   | 当日送达     | ¥25      | 核心城区     |
| 免邮快递 | 3-5 个工作日 | ¥0       | 订单满 99 元 |
| 货到付款 | 3-7 个工作日 | ¥10      | 指定区域     |

**测试内容：**

1. 根据收货地址显示可用配送方式
2. 配送费用自动计算并加入订单总额
3. 特殊商品（生鲜、易碎品）配送限制
4. 偏远地区配送可达性检查

**预期结果：**

- 配送方式筛选准确
- 费用计算正确
- 不可达区域正确提示
- 预计送达时间合理显示

## 支付功能测试

### TC404 - 多种支付方式测试

**支持的支付方式：**

- 微信支付
- 支付宝支付
- 银联在线支付
- 信用卡支付
- 余额支付
- 分期付款

**测试场景：**

1. **微信支付测试**

   - 生成微信支付二维码
   - 模拟扫码支付成功
   - 模拟支付超时
   - 模拟支付失败

2. **支付宝支付测试**

   - 跳转支付宝页面
   - 完成支付流程
   - 返回商户页面
   - 支付结果通知处理

3. **银行卡支付测试**
   - 卡号格式验证
   - CVV 码验证
   - 有效期验证
   - 支付密码验证

**测试步骤：**

1. 在订单确认页面选择支付方式
2. 点击"立即支付"按钮
3. 跳转到对应支付平台
4. 完成支付操作
5. 返回订单系统
6. 验证支付状态更新

**预期结果：**

- 各支付方式正常工作
- 支付金额准确传递
- 支付状态正确同步
- 支付失败时订单状态正确处理

### TC405 - 支付异常处理

**异常场景测试：**

- 支付超时处理
- 支付金额不一致
- 重复支付检测
- 网络中断恢复
- 支付接口异常

**测试方法：**

1. 模拟网络中断情况
2. 模拟支付接口返回错误
3. 模拟用户取消支付
4. 模拟余额不足情况

**预期结果：**

- 异常情况有友好提示
- 订单状态正确回滚
- 库存数量正确恢复
- 用户可以重新尝试支付

## 订单状态管理测试

### TC406 - 订单状态流转

**标准状态流程：**
待支付 → 待发货 → 待收货 → 待评价 → 已完成

**异常状态流程：**

- 支付超时 → 已关闭
- 用户取消 → 已取消
- 退款申请 → 退款中 → 已退款
- 售后申请 → 售后中 → 售后完成

**测试内容：**

1. 验证每个状态变更的触发条件
2. 验证状态变更的权限控制
3. 验证状态变更的通知机制
4. 验证状态回滚的异常处理

**自动化状态检查：**

- 未支付订单 24 小时后自动关闭
- 已发货订单 10 天后自动确认收货
- 已完成订单 30 天后不可申请售后

### TC407 - 订单修改功能

**可修改内容：**

- 收货地址（仅待发货状态）
- 收货人信息（仅待发货状态）
- 配送方式（仅待发货状态）
- 订单备注（任何时候）

**权限控制：**

- 不同状态下可修改的字段不同
- 部分修改需要客服审核
- 涉及金额变更需要重新支付确认

**测试步骤：**

1. 创建测试订单（待发货状态）
2. 尝试修改收货地址
3. 提交修改申请
4. 验证修改是否生效
5. 测试不同状态下的修改限制

**预期结果：**

- 允许修改的字段可以正常更新
- 禁止修改的字段有明确提示
- 修改历史有完整记录
- 涉及费用变更有正确处理

## 订单查询和搜索测试

### TC408 - 订单列表查询

**查询功能：**

- 按订单状态筛选
- 按订单时间范围筛选
- 按商品名称搜索
- 按订单号精确查找
- 按收货人信息搜索

**排序功能：**

- 按创建时间排序（默认）
- 按订单金额排序
- 按状态优先级排序

**分页功能：**

- 每页显示数量：10/20/50
- 分页导航
- 总数统计

**测试数据准备：**

```sql
-- 插入测试订单数据
INSERT INTO orders (order_no, user_id, status, total_amount, create_time) VALUES
('ORD202401001', 1001, 'pending_payment', 299.00, '2024-01-01 10:00:00'),
('ORD202401002', 1001, 'pending_shipment', 156.50, '2024-01-02 14:30:00'),
('ORD202401003', 1001, 'shipped', 89.90, '2024-01-03 09:15:00'),
('ORD202401004', 1001, 'completed', 234.80, '2024-01-04 16:45:00'),
('ORD202401005', 1001, 'cancelled', 45.00, '2024-01-05 11:20:00');
```

**测试执行：**

1. 测试各种筛选条件组合
2. 验证搜索结果准确性
3. 测试分页功能正确性
4. 验证排序功能

**性能要求：**

- 查询响应时间 < 2 秒
- 大数据量（10 万+订单）查询稳定
- 复杂条件查询优化

### TC409 - 订单详情展示

**详情信息包含：**

- 基本信息：订单号、创建时间、状态
- 商品信息：名称、规格、数量、单价
- 金额信息：商品金额、运费、优惠、实付金额
- 收货信息：收货人、地址、电话
- 物流信息：快递公司、快递单号、物流状态
- 操作记录：状态变更历史、操作人、操作时间

**测试内容：**

1. 验证所有信息显示完整准确
2. 测试不同状态下的操作按钮
3. 验证物流信息实时更新
4. 测试订单操作权限控制

## 批量操作测试

### TC410 - 订单批量处理

**批量操作功能：**

- 批量发货
- 批量打印
- 批量导出
- 批量状态更新

**测试场景：**

1. 选择多个相同状态订单进行批量操作
2. 选择不同状态订单尝试批量操作
3. 大批量数据处理（1000+订单）
4. 操作过程中的异常处理

**权限验证：**

- 普通用户无批量操作权限
- 客服人员有部分批量操作权限
- 管理员有完整批量操作权限

## 自动化测试框架

```python
import unittest
import time
import random
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

class OrderManagementTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.base_url = "http://test-shop.example.com"
        cls.wait = WebDriverWait(cls.driver, 10)

    def setUp(self):
        """每个测试用例前的准备工作"""
        self.login_as_user("testuser001", "test123456")

    def login_as_user(self, username, password):
        """用户登录"""
        self.driver.get(f"{self.base_url}/login")

        username_input = self.driver.find_element(By.ID, "username")
        password_input = self.driver.find_element(By.ID, "password")
        login_btn = self.driver.find_element(By.ID, "loginBtn")

        username_input.send_keys(username)
        password_input.send_keys(password)
        login_btn.click()

        # 等待登录成功
        self.wait.until(EC.url_contains("/dashboard"))

    def prepare_cart_with_items(self):
        """准备购物车商品"""
        # 添加测试商品到购物车
        test_products = ["1001", "1002", "1003"]

        for product_id in test_products:
            self.driver.get(f"{self.base_url}/product/{product_id}")

            # 随机选择数量
            quantity = random.randint(1, 3)
            quantity_input = self.driver.find_element(By.ID, "quantity")
            quantity_input.clear()
            quantity_input.send_keys(str(quantity))

            # 添加到购物车
            add_cart_btn = self.driver.find_element(By.ID, "addToCart")
            add_cart_btn.click()

            # 等待添加成功
            self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "success-message"))
            )

    def test_create_order_flow(self):
        """测试标准订单创建流程"""
        # 准备购物车
        self.prepare_cart_with_items()

        # 进入购物车
        self.driver.get(f"{self.base_url}/cart")

        # 点击去结算
        checkout_btn = self.driver.find_element(By.ID, "checkoutBtn")
        checkout_btn.click()

        # 等待进入订单确认页面
        self.wait.until(EC.url_contains("/checkout"))

        # 验证商品信息显示
        cart_items = self.driver.find_elements(By.CLASS_NAME, "order-item")
        self.assertGreater(len(cart_items), 0, "订单确认页面未显示商品")

        # 选择收货地址
        address_select = Select(self.driver.find_element(By.ID, "addressSelect"))
        address_select.select_by_index(0)  # 选择第一个地址

        # 选择配送方式
        shipping_options = self.driver.find_elements(By.NAME, "shippingMethod")
        shipping_options[0].click()  # 选择标准快递

        # 选择支付方式
        payment_options = self.driver.find_elements(By.NAME, "paymentMethod")
        payment_options[0].click()  # 选择微信支付

        # 记录订单总金额
        total_amount_element = self.driver.find_element(By.CLASS_NAME, "total-amount")
        total_amount = total_amount_element.text

        # 提交订单
        submit_btn = self.driver.find_element(By.ID, "submitOrderBtn")
        submit_btn.click()

        # 等待跳转到支付页面
        self.wait.until(EC.url_contains("/payment"))

        # 模拟支付成功
        self.simulate_payment_success()

        # 验证订单创建成功
        self.wait.until(EC.url_contains("/order/success"))

        # 获取订单号
        order_no_element = self.driver.find_element(By.CLASS_NAME, "order-number")
        order_no = order_no_element.text

        self.assertIsNotNone(order_no, "订单号未生成")

        # 验证订单详情页面
        self.driver.get(f"{self.base_url}/order/{order_no}")

        order_status = self.driver.find_element(By.CLASS_NAME, "order-status")
        self.assertEqual(order_status.text, "待发货", "订单状态不正确")

    def simulate_payment_success(self):
        """模拟支付成功"""
        # 在测试环境中，可能有模拟支付的接口
        pay_btn = self.driver.find_element(By.ID, "mockPayBtn")
        pay_btn.click()

        # 等待支付处理完成
        time.sleep(2)

    def test_order_address_management(self):
        """测试订单地址管理"""
        self.prepare_cart_with_items()
        self.driver.get(f"{self.base_url}/checkout")

        # 点击新增地址
        add_address_btn = self.driver.find_element(By.ID, "addAddressBtn")
        add_address_btn.click()

        # 填写地址信息
        address_form = {
            "consignee": "测试收货人",
            "phone": "13800138000",
            "province": "广东省",
            "city": "深圳市",
            "district": "南山区",
            "detail": "科技园南区某某大厦A座1001室",
            "zipcode": "518000"
        }

        for field, value in address_form.items():
            if field in ["province", "city", "district"]:
                # 下拉选择
                select = Select(self.driver.find_element(By.ID, field))
                select.select_by_visible_text(value)
            else:
                # 文本输入
                input_field = self.driver.find_element(By.ID, field)
                input_field.send_keys(value)

        # 保存地址
        save_btn = self.driver.find_element(By.ID, "saveAddressBtn")
        save_btn.click()

        # 验证地址保存成功
        success_msg = self.wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "address-success"))
        )
        self.assertIn("保存成功", success_msg.text)

        # 验证新地址出现在选择列表中
        address_list = self.driver.find_elements(By.CLASS_NAME, "address-item")
        found_new_address = False
        for address in address_list:
            if "测试收货人" in address.text:
                found_new_address = True
                break

        self.assertTrue(found_new_address, "新添加的地址未出现在列表中")

    def test_payment_methods(self):
        """测试多种支付方式"""
        self.prepare_cart_with_items()
        self.driver.get(f"{self.base_url}/checkout")

        # 填写必要信息
        self.select_default_address()
        self.select_default_shipping()

        # 测试不同支付方式
        payment_methods = [
            ("wechat", "微信支付"),
            ("alipay", "支付宝"),
            ("unionpay", "银联支付"),
            ("balance", "余额支付")
        ]

        for method_id, method_name in payment_methods:
            # 选择支付方式
            payment_radio = self.driver.find_element(
                By.CSS_SELECTOR, f"input[value='{method_id}']"
            )
            payment_radio.click()

            # 验证支付方式选中
            self.assertTrue(payment_radio.is_selected(),
                          f"{method_name}未正确选中")

            # 验证相应的支付信息显示
            payment_info = self.driver.find_element(
                By.ID, f"{method_id}Info"
            )
            self.assertTrue(payment_info.is_displayed(),
                          f"{method_name}信息未显示")

    def test_order_modification(self):
        """测试订单修改功能"""
        # 先创建一个订单
        order_no = self.create_test_order()

        # 进入订单详情页面
        self.driver.get(f"{self.base_url}/order/{order_no}")

        # 检查当前订单状态
        order_status = self.driver.find_element(By.CLASS_NAME, "order-status")

        if order_status.text == "待发货":
            # 测试修改收货地址
            modify_btn = self.driver.find_element(By.ID, "modifyAddressBtn")
            modify_btn.click()

            # 选择新地址
            new_address = self.driver.find_element(
                By.CSS_SELECTOR, ".address-item:nth-child(2)"
            )
            new_address.click()

            # 确认修改
            confirm_btn = self.driver.find_element(By.ID, "confirmModifyBtn")
            confirm_btn.click()

            # 验证修改成功
            success_msg = self.wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "modify-success"))
            )
            self.assertIn("修改成功", success_msg.text)

    def test_order_cancellation(self):
        """测试订单取消功能"""
        # 创建待支付订单
        order_no = self.create_pending_payment_order()

        # 进入订单详情页面
        self.driver.get(f"{self.base_url}/order/{order_no}")

        # 点击取消订单
        cancel_btn = self.driver.find_element(By.ID, "cancelOrderBtn")
        cancel_btn.click()

        # 选择取消原因
        reason_select = Select(self.driver.find_element(By.ID, "cancelReason"))
        reason_select.select_by_visible_text("不想要了")

        # 确认取消
        confirm_cancel_btn = self.driver.find_element(By.ID, "confirmCancelBtn")
        confirm_cancel_btn.click()

        # 验证取消成功
        self.wait.until(
            EC.text_to_be_present_in_element(
                (By.CLASS_NAME, "order-status"), "已取消"
            )
        )

        # 验证库存恢复（需要后台验证）

    def test_order_search_and_filter(self):
        """测试订单搜索和筛选功能"""
        # 进入订单列表页面
        self.driver.get(f"{self.base_url}/orders")

        # 测试按状态筛选
        status_filter = Select(self.driver.find_element(By.ID, "statusFilter"))
        status_filter.select_by_visible_text("待发货")

        # 点击筛选按钮
        filter_btn = self.driver.find_element(By.ID, "filterBtn")
        filter_btn.click()

        # 验证筛选结果
        time.sleep(1)  # 等待结果加载
        order_items = self.driver.find_elements(By.CLASS_NAME, "order-item")

        for item in order_items:
            status_text = item.find_element(By.CLASS_NAME, "item-status").text
            self.assertEqual(status_text, "待发货", "筛选结果不准确")

        # 测试订单号搜索
        search_input = self.driver.find_element(By.ID, "orderSearch")
        search_input.clear()
        search_input.send_keys("ORD202401001")

        search_btn = self.driver.find_element(By.ID, "searchBtn")
        search_btn.click()

        # 验证搜索结果
        time.sleep(1)
        order_items = self.driver.find_elements(By.CLASS_NAME, "order-item")
        self.assertEqual(len(order_items), 1, "搜索结果数量不正确")

        order_no = order_items[0].find_element(By.CLASS_NAME, "order-number").text
        self.assertIn("ORD202401001", order_no, "搜索结果订单号不匹配")

    def create_test_order(self):
        """创建测试订单并返回订单号"""
        self.prepare_cart_with_items()
        self.driver.get(f"{self.base_url}/checkout")

        self.select_default_address()
        self.select_default_shipping()
        self.select_default_payment()

        submit_btn = self.driver.find_element(By.ID, "submitOrderBtn")
        submit_btn.click()

        self.wait.until(EC.url_contains("/payment"))
        self.simulate_payment_success()

        self.wait.until(EC.url_contains("/order/success"))
        order_no_element = self.driver.find_element(By.CLASS_NAME, "order-number")
        return order_no_element.text.strip()

    def create_pending_payment_order(self):
        """创建待支付订单"""
        self.prepare_cart_with_items()
        self.driver.get(f"{self.base_url}/checkout")

        self.select_default_address()
        self.select_default_shipping()
        self.select_default_payment()

        submit_btn = self.driver.find_element(By.ID, "submitOrderBtn")
        submit_btn.click()

        # 不进行支付，直接返回订单号
        self.wait.until(EC.url_contains("/payment"))
        order_info = self.driver.find_element(By.CLASS_NAME, "payment-order-info")
        order_no = order_info.find_element(By.CLASS_NAME, "order-number").text
        return order_no.strip()

    def select_default_address(self):
        """选择默认地址"""
        address_select = Select(self.driver.find_element(By.ID, "addressSelect"))
        address_select.select_by_index(0)

    def select_default_shipping(self):
        """选择默认配送方式"""
        shipping_options = self.driver.find_elements(By.NAME, "shippingMethod")
        shipping_options[0].click()

    def select_default_payment(self):
        """选择默认支付方式"""
        payment_options = self.driver.find_elements(By.NAME, "paymentMethod")
        payment_options[0].click()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    # 创建测试套件
    suite = unittest.TestSuite()

    # 添加测试用例
    suite.addTest(OrderManagementTest('test_create_order_flow'))
    suite.addTest(OrderManagementTest('test_order_address_management'))
    suite.addTest(OrderManagementTest('test_payment_methods'))
    suite.addTest(OrderManagementTest('test_order_modification'))
    suite.addTest(OrderManagementTest('test_order_cancellation'))
    suite.addTest(OrderManagementTest('test_order_search_and_filter'))

    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 输出测试结果
    print(f"\n测试执行完成:")
    print(f"总用例数: {result.testsRun}")
    print(f"成功用例: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"失败用例: {len(result.failures)}")
    print(f"错误用例: {len(result.errors)}")
```

## 性能测试方案

### 订单并发创建测试

**测试目标：** 验证系统在高并发订单创建场景下的稳定性

**测试参数：**

- 并发用户数：500
- 每用户订单数：10
- 测试持续时间：30 分钟
- 订单金额范围：50-2000 元

**性能指标：**

- 订单创建成功率 > 99%
- 平均响应时间 < 3 秒
- 95%响应时间 < 5 秒
- 系统 CPU 使用率 < 80%
- 数据库连接池使用率 < 70%

**负载测试脚本：**

```python
import asyncio
import aiohttp
import time
import json
import random
from concurrent.futures import ThreadPoolExecutor

class OrderLoadTest:
    def __init__(self):
        self.base_url = "http://test-api.example.com"
        self.success_count = 0
        self.failure_count = 0
        self.response_times = []

    async def create_order(self, session, user_id):
        """异步创建订单"""
        order_data = {
            "user_id": user_id,
            "items": [
                {
                    "product_id": random.randint(1001, 1010),
                    "quantity": random.randint(1, 5),
                    "price": random.uniform(50, 500)
                }
            ],
            "shipping_address": {
                "consignee": f"测试用户{user_id}",
                "phone": "13800138000",
                "address": "测试地址"
            },
            "payment_method": "wechat"
        }

        start_time = time.time()

        try:
            async with session.post(
                f"{self.base_url}/api/orders",
                json=order_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                end_time = time.time()
                response_time = end_time - start_time
                self.response_times.append(response_time)

                if response.status == 200:
                    result = await response.json()
                    if result.get("success"):
                        self.success_count += 1
                    else:
                        self.failure_count += 1
                else:
                    self.failure_count += 1

        except Exception as e:
            self.failure_count += 1
            print(f"订单创建异常: {e}")

    async def run_load_test(self, concurrent_users=100, orders_per_user=10):
        """运行负载测试"""
        connector = aiohttp.TCPConnector(limit=200)
        async with aiohttp.ClientSession(connector=connector) as session:
            tasks = []

            for user_id in range(1, concurrent_users + 1):
                for _ in range(orders_per_user):
                    task = self.create_order(session, user_id)
                    tasks.append(task)

            print(f"开始执行负载测试: {len(tasks)} 个订单创建任务")
            start_time = time.time()

            await asyncio.gather(*tasks)

            end_time = time.time()
            total_time = end_time - start_time

            # 计算统计信息
            total_orders = self.success_count + self.failure_count
            success_rate = (self.success_count / total_orders) * 100
            avg_response_time = sum(self.response_times) / len(self.response_times)

            self.response_times.sort()
            p95_response_time = self.response_times[int(len(self.response_times) * 0.95)]

            print(f"\n=== 负载测试结果 ===")
            print(f"总订单数: {total_orders}")
            print(f"成功订单数: {self.success_count}")
            print(f"失败订单数: {self.failure_count}")
            print(f"成功率: {success_rate:.2f}%")
            print(f"总用时: {total_time:.2f}秒")
            print(f"平均响应时间: {avg_response_time:.2f}秒")
            print(f"95%响应时间: {p95_response_time:.2f}秒")
            print(f"TPS: {total_orders/total_time:.2f}")

# 执行负载测试
if __name__ == "__main__":
    load_test = OrderLoadTest()
    asyncio.run(load_test.run_load_test(concurrent_users=500, orders_per_user=10))
```

## 数据完整性验证

### 订单数据一致性检查

**检查项目：**

1. 订单总金额 = 商品金额 + 运费 - 优惠金额
2. 订单商品数量与库存扣减一致
3. 支付金额与订单金额一致
4. 订单状态变更有完整记录
5. 相关数据表数据同步（订单表、订单商品表、支付表等）

**数据验证脚本：**

```sql
-- 订单金额一致性检查
SELECT
    o.order_no,
    o.total_amount as order_total,
    (oi.item_total + o.shipping_fee - o.discount_amount) as calculated_total,
    CASE
        WHEN o.total_amount = (oi.item_total + o.shipping_fee - o.discount_amount)
        THEN 'PASS'
        ELSE 'FAIL'
    END as check_result
FROM orders o
LEFT JOIN (
    SELECT
        order_id,
        SUM(quantity * price) as item_total
    FROM order_items
    GROUP BY order_id
) oi ON o.id = oi.order_id
WHERE o.create_time >= '2024-01-01'
AND check_result = 'FAIL';

-- 库存一致性检查
SELECT
    p.id as product_id,
    p.name as product_name,
    p.stock as current_stock,
    COALESCE(sold.total_sold, 0) as total_sold,
    p.initial_stock - COALESCE(sold.total_sold, 0) as expected_stock,
    CASE
        WHEN p.stock = (p.initial_stock - COALESCE(sold.total_sold, 0))
        THEN 'PASS'
        ELSE 'FAIL'
    END as stock_check
FROM products p
LEFT JOIN (
    SELECT
        oi.product_id,
        SUM(oi.quantity) as total_sold
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status NOT IN ('cancelled', 'closed')
    GROUP BY oi.product_id
) sold ON p.id = sold.product_id
WHERE stock_check = 'FAIL';
```

## 测试报告模板

### 订单管理系统测试报告

**测试周期：** 2024.01.15 - 2024.01.30  
**测试版本：** v3.2.0  
**测试负责人：** 测试团队

#### 测试执行概况

| 测试类型   | 计划用例 | 执行用例 | 通过用例 | 通过率    |
| ---------- | -------- | -------- | -------- | --------- |
| 功能测试   | 35       | 35       | 32       | 91.4%     |
| 集成测试   | 15       | 15       | 14       | 93.3%     |
| 性能测试   | 8        | 8        | 7        | 87.5%     |
| 兼容性测试 | 12       | 12       | 11       | 91.7%     |
| 安全测试   | 6        | 6        | 6        | 100%      |
| **总计**   | **76**   | **76**   | **70**   | **92.1%** |

#### 主要问题分析

**高优先级问题：**

1. 订单金额计算在优惠券叠加时出现精度误差
2. 高并发创建订单时偶现库存超卖问题

**中优先级问题：** 3. 订单状态推送通知延迟较大 4. 移动端订单列表加载性能有待优化

**低优先级问题：** 5. 部分浏览器兼容性问题 6. 订单导出功能格式需要调整

#### 质量评估

**功能完整性：** 90%

- 核心下单流程稳定可靠
- 支付集成功能正常
- 订单管理功能基本完善

**系统稳定性：** 88%

- 常规场景运行稳定
- 异常处理机制完善
- 高并发场景需要优化

**用户体验：** 85%

- 操作流程简单直观
- 响应速度基本满足要求
- 移动端体验有提升空间

#### 发布建议

建议修复高优先级问题后发布生产环境，中低优先级问题可在后续版本中逐步解决。发布前需要进行小范围灰度测试，确保关键问题已解决。
