---
title: "vue-router-guide"
description: "测试用例描述测试用例描述"
createdAt: "2024-01-15"
updatedAt: "2024-01-20"
tags: ["vue", "前端", "vue-router"]
---

# 测试用例 2 - 商品搜索功能测试

## 测试概述

商品搜索功能是电商平台的核心功能之一，本测试用例将对搜索功能的准确性、性能、用户体验等方面进行全面测试。

## 测试范围

- 基础搜索功能
- 高级搜索功能
- 搜索结果排序
- 搜索建议/自动完成
- 搜索结果分页
- 移动端搜索体验

## 功能测试用例

### TC201 - 基础关键词搜索

**测试目的：** 验证用户输入关键词后能正确返回相关商品

**前置条件：**

- 商品数据库中存在测试商品
- 搜索服务正常运行
- 搜索索引已更新

**测试步骤：**

1. 进入商品搜索页面
2. 在搜索框输入关键词"手机"
3. 点击搜索按钮或按回车键
4. 查看搜索结果页面

**预期结果：**

- 返回包含"手机"关键词的商品列表
- 搜索结果按相关度排序
- 显示搜索结果总数
- 搜索用时显示在合理范围内（<1 秒）

### TC202 - 空白搜索测试

**测试步骤：**

1. 在搜索框不输入任何内容
2. 点击搜索按钮

**预期结果：**

- 显示提示信息："请输入搜索关键词"
- 不执行搜索操作
- 页面保持在当前状态

### TC203 - 特殊字符搜索

**测试数据：**

- @#$%^&\*()
- <script>alert('test')</script>
- '; DROP TABLE products; --
- 中文特殊符号：￥ ¥€£

**测试步骤：**

1. 分别输入各种特殊字符
2. 执行搜索操作
3. 观察系统响应

**预期结果：**

- 系统正确处理特殊字符
- 不出现 SQL 注入或 XSS 攻击
- 返回相应的搜索结果或无结果提示

## 高级搜索测试

### TC204 - 多条件组合搜索

**测试场景：**

- 商品名称：手机
- 价格范围：1000-5000 元
- 品牌：华为
- 评分：4 星以上

**测试步骤：**

1. 进入高级搜索页面
2. 设置各项搜索条件
3. 点击搜索按钮
4. 验证搜索结果

**预期结果：**

- 返回符合所有条件的商品
- 筛选条件在结果页面正确显示
- 可以修改或删除筛选条件

### TC205 - 价格区间搜索

**测试用例：**

| 最低价格 | 最高价格 | 预期结果             |
| -------- | -------- | -------------------- |
| 100      | 500      | 返回 100-500 元商品  |
| 0        | 100      | 返回 100 元以下商品  |
| 1000     | 空       | 返回 1000 元以上商品 |
| 空       | 空       | 返回所有商品         |
| 500      | 100      | 提示价格区间错误     |

## 搜索结果排序测试

### TC206 - 排序功能测试

**排序选项：**

- 相关度（默认）
- 价格从低到高
- 价格从高到低
- 销量排序
- 评分排序
- 上架时间

**测试步骤：**

1. 执行搜索获得结果列表
2. 分别选择不同排序方式
3. 验证排序结果正确性

**预期结果：**

- 每种排序方式都能正确排序
- 排序切换响应时间<2 秒
- 当前排序方式有明显标识

## 搜索建议测试

### TC207 - 自动完成功能

**测试步骤：**

1. 在搜索框输入"手"
2. 观察下拉建议列表
3. 继续输入"机"
4. 观察建议列表变化
5. 点击某个建议项

**预期结果：**

- 输入 1 个字符后显示建议列表
- 建议内容与输入相关
- 最多显示 10 个建议
- 点击建议后自动搜索

### TC208 - 搜索历史功能

**测试步骤：**

1. 执行几次不同的搜索
2. 清空搜索框并点击获得焦点
3. 查看是否显示搜索历史

**预期结果：**

- 显示最近 5 次搜索历史
- 按时间倒序排列
- 可以点击历史记录直接搜索
- 提供清除历史记录功能

## 分页功能测试

### TC209 - 分页导航测试

**测试条件：**

- 搜索结果超过 20 条（每页显示 20 条）

**测试步骤：**

1. 执行搜索获得多页结果
2. 点击第 2 页
3. 点击下一页
4. 点击上一页
5. 直接跳转到第 5 页

**预期结果：**

- 分页导航正确显示
- 页面跳转正常
- 当前页面有高亮标识
- 每页显示条数正确

## 性能测试

### TC210 - 搜索响应时间测试

**测试条件：**

- 商品数据量：100 万+
- 并发用户：50
- 测试时长：30 分钟

**性能指标：**

- 平均响应时间：<1 秒
- 95%响应时间：<3 秒
- 最大响应时间：<5 秒
- 错误率：<0.1%

### TC211 - 大数据量搜索测试

**测试场景：**

- 热门关键词搜索（返回结果>10 万条）
- 冷门关键词搜索（返回结果<10 条）
- 无结果搜索

**监控指标：**

- 服务器 CPU 使用率
- 内存使用情况
- 数据库连接数
- 缓存命中率

## 移动端适配测试

### TC212 - 移动端搜索体验

**测试设备：**

- iPhone 14 Pro Max
- Samsung Galaxy S23 Ultra
- iPad Air

**测试内容：**

1. 搜索框大小适配
2. 虚拟键盘处理
3. 触摸操作响应
4. 页面布局适配

**预期结果：**

- 搜索框易于点击和输入
- 软键盘弹出时页面布局正常
- 搜索建议列表在移动端正确显示
- 搜索结果采用适合移动端的布局

## 自动化测试脚本

```python
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class SearchTest:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.base_url = "http://test-shop.example.com"

    def test_basic_search(self):
        """基础搜索功能测试"""
        self.driver.get(f"{self.base_url}")

        # 定位搜索框
        search_box = self.driver.find_element(By.ID, "searchInput")
        search_box.send_keys("手机")

        # 点击搜索按钮
        search_btn = self.driver.find_element(By.ID, "searchBtn")
        search_btn.click()

        # 等待搜索结果加载
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-results"))
        )

        # 验证搜索结果
        results = self.driver.find_elements(By.CLASS_NAME, "product-item")
        assert len(results) > 0, "搜索结果为空"

        # 验证关键词高亮
        for result in results[:5]:  # 检查前5个结果
            product_title = result.find_element(By.CLASS_NAME, "product-title")
            assert "手机" in product_title.text, "搜索结果不包含关键词"

    def test_empty_search(self):
        """空白搜索测试"""
        self.driver.get(f"{self.base_url}")

        search_btn = self.driver.find_element(By.ID, "searchBtn")
        search_btn.click()

        # 验证提示信息
        error_msg = WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-error"))
        )
        assert "请输入搜索关键词" in error_msg.text

    def test_search_suggestions(self):
        """搜索建议测试"""
        self.driver.get(f"{self.base_url}")

        search_box = self.driver.find_element(By.ID, "searchInput")
        search_box.send_keys("手")

        # 等待建议列表出现
        suggestions = WebDriverWait(self.driver, 5).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "suggestion-item"))
        )

        assert len(suggestions) > 0, "未显示搜索建议"
        assert len(suggestions) <= 10, "搜索建议过多"

        # 点击第一个建议
        suggestions[0].click()

        # 验证自动搜索
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-results"))
        )

    def test_advanced_search(self):
        """高级搜索测试"""
        self.driver.get(f"{self.base_url}/advanced-search")

        # 设置搜索条件
        product_name = self.driver.find_element(By.ID, "productName")
        product_name.send_keys("手机")

        min_price = self.driver.find_element(By.ID, "minPrice")
        min_price.send_keys("1000")

        max_price = self.driver.find_element(By.ID, "maxPrice")
        max_price.send_keys("5000")

        # 选择品牌
        brand_select = self.driver.find_element(By.ID, "brandSelect")
        brand_select.click()

        brand_option = self.driver.find_element(By.XPATH, "//option[text()='华为']")
        brand_option.click()

        # 执行搜索
        search_btn = self.driver.find_element(By.ID, "advancedSearchBtn")
        search_btn.click()

        # 验证结果
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-results"))
        )

        # 验证筛选条件显示
        filters = self.driver.find_elements(By.CLASS_NAME, "active-filter")
        assert len(filters) > 0, "未显示激活的筛选条件"

    def test_search_performance(self):
        """搜索性能测试"""
        start_time = time.time()

        self.driver.get(f"{self.base_url}")
        search_box = self.driver.find_element(By.ID, "searchInput")
        search_box.send_keys("手机")

        search_btn = self.driver.find_element(By.ID, "searchBtn")
        search_btn.click()

        # 等待结果加载完成
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "search-results"))
        )

        end_time = time.time()
        response_time = end_time - start_time

        assert response_time < 3, f"搜索响应时间过长: {response_time}秒"
        print(f"搜索响应时间: {response_time:.2f}秒")

    def tearDown(self):
        self.driver.quit()

# API测试
class SearchAPITest:
    def __init__(self):
        self.base_url = "http://api.test-shop.example.com"

    def test_search_api(self):
        """搜索API测试"""
        url = f"{self.base_url}/api/search"
        params = {
            "keyword": "手机",
            "page": 1,
            "size": 20,
            "sort": "relevance"
        }

        response = requests.get(url, params=params)

        assert response.status_code == 200, f"API返回错误状态码: {response.status_code}"

        data = response.json()
        assert "products" in data, "API响应缺少products字段"
        assert "total" in data, "API响应缺少total字段"
        assert len(data["products"]) <= 20, "返回商品数量超过限制"

    def test_search_api_performance(self):
        """搜索API性能测试"""
        url = f"{self.base_url}/api/search"
        params = {"keyword": "手机"}

        times = []
        for i in range(10):
            start_time = time.time()
            response = requests.get(url, params=params)
            end_time = time.time()

            assert response.status_code == 200
            times.append(end_time - start_time)

        avg_time = sum(times) / len(times)
        assert avg_time < 1, f"API平均响应时间过长: {avg_time:.2f}秒"
        print(f"API平均响应时间: {avg_time:.2f}秒")

# 测试执行
if __name__ == "__main__":
    # UI测试
    ui_test = SearchTest()
    ui_test.test_basic_search()
    ui_test.test_empty_search()
    ui_test.test_search_suggestions()
    ui_test.test_advanced_search()
    ui_test.test_search_performance()
    ui_test.tearDown()

    # API测试
    api_test = SearchAPITest()
    api_test.test_search_api()
    api_test.test_search_api_performance()

    print("所有搜索测试执行完成")
```

## 测试数据管理

### 商品测试数据

```json
{
  "products": [
    {
      "id": 1001,
      "name": "华为P50 Pro 手机",
      "brand": "华为",
      "category": "手机",
      "price": 4988,
      "rating": 4.5,
      "sales": 1200,
      "keywords": ["手机", "华为", "拍照", "5G"],
      "status": "active"
    },
    {
      "id": 1002,
      "name": "iPhone 14 Pro Max",
      "brand": "苹果",
      "category": "手机",
      "price": 8999,
      "rating": 4.8,
      "sales": 800,
      "keywords": ["手机", "苹果", "iPhone", "拍照"],
      "status": "active"
    },
    {
      "id": 1003,
      "name": "小米13 Ultra 手机",
      "brand": "小米",
      "category": "手机",
      "price": 5999,
      "rating": 4.6,
      "sales": 950,
      "keywords": ["手机", "小米", "拍照", "性价比"],
      "status": "active"
    }
  ]
}
```

### 搜索关键词统计

| 关键词 | 搜索次数 | 结果数量 | 平均响应时间 |
| ------ | -------- | -------- | ------------ |
| 手机   | 15420    | 2580     | 0.8s         |
| iPhone | 8760     | 120      | 0.6s         |
| 华为   | 6890     | 890      | 0.7s         |
| 笔记本 | 4320     | 1200     | 0.9s         |
| 耳机   | 3210     | 560      | 0.5s         |

## 缺陷记录

### 已发现问题

1. **BUG-201**: 搜索建议列表在 IE11 中显示异常

   - 严重级别：低
   - 状态：已修复
   - 修复版本：v2.1.3

2. **BUG-202**: 价格筛选最大值超过商品最高价时返回空结果

   - 严重级别：中
   - 状态：待修复
   - 负责人：后端开发

3. **BUG-203**: 移动端搜索结果页面滚动性能问题
   - 严重级别：中
   - 状态：修复中
   - 预计修复：v2.2.0

## 测试总结

### 测试执行情况

- 计划用例数：25 个
- 实际执行数：25 个
- 通过用例数：22 个
- 失败用例数：3 个
- 阻塞用例数：0 个
- 用例通过率：88%

### 质量评估

**功能完整性**：90%

- 基础搜索功能完整
- 高级搜索功能基本满足需求
- 部分边缘场景需要优化

**性能表现**：85%

- 一般场景下性能良好
- 大数据量场景有待优化
- 移动端性能需要提升

**用户体验**：88%

- 搜索流程顺畅
- 界面友好直观
- 响应速度需要提升

### 建议

1. **优先修复**：价格筛选逻辑问题
2. **性能优化**：移动端滚动性能
3. **功能增强**：增加拼写纠错功能
4. **监控完善**：添加搜索质量监控指标

### 风险评估

- **高风险**：价格筛选问题影响用户购买决策
- **中风险**：移动端性能问题影响用户体验
- **低风险**：IE11 兼容性问题（用户占比低）

建议在修复关键问题后发布，非关键问题可在后续版本中解决。
