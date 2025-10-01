---
title: "LeetCode 两数之和：从暴力到哈希表"
description: "深入解析 LeetCode 经典题目两数之和，从暴力解法到最优解法的完整思路"
createdAt: "2024-01-20T16:45:00Z"
updatedAt: "2024-01-25T11:20:00Z"
tags: ["leetcode", "algorithm", "hash-table", "array", "two-pointer", "javascript", "python"]
category: "algorithm"
featured: true
---

# LeetCode 两数之和：从暴力到哈希表

两数之和（Two Sum）是 LeetCode 上最经典的算法题目之一，也是很多面试的必考题目。本文将详细解析这道题目的多种解法，从最直观的暴力解法到最优的哈希表解法。

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

**示例 1：**
```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例 2：**
```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

## 解法一：暴力解法

最直观的解法是使用双重循环遍历数组，检查每两个数的和是否等于目标值。

### JavaScript 实现

```javascript
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
```

### 复杂度分析

- **时间复杂度**：O(n²)，需要遍历数组两次
- **空间复杂度**：O(1)，只使用了常数额外空间

## 解法二：哈希表解法（推荐）

使用哈希表可以在一次遍历中完成查找，大大提高效率。

### JavaScript 实现

```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
```

### Python 实现

```python
def twoSum(nums, target):
    hash_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in hash_map:
            return [hash_map[complement], i]
        
        hash_map[num] = i
    
    return []
```

### 复杂度分析

- **时间复杂度**：O(n)，只需要遍历数组一次
- **空间复杂度**：O(n)，最坏情况下需要存储 n 个元素

## 解法三：双指针法（需要排序）

如果题目允许修改原数组，可以先排序再使用双指针。

```javascript
function twoSum(nums, target) {
    // 创建索引数组
    const indices = nums.map((num, index) => ({ num, index }));
    
    // 按数值排序
    indices.sort((a, b) => a.num - b.num);
    
    let left = 0;
    let right = indices.length - 1;
    
    while (left < right) {
        const sum = indices[left].num + indices[right].num;
        
        if (sum === target) {
            return [indices[left].index, indices[right].index];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
}
```

### 复杂度分析

- **时间复杂度**：O(n log n)，主要是排序的时间复杂度
- **空间复杂度**：O(n)，需要额外的索引数组

## 解法四：一次遍历优化

对哈希表解法进行微优化，减少不必要的操作。

```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const complement = target - num;
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(num, i);
    }
    
    return [];
}
```

## 边界情况处理

在实际应用中，我们需要考虑以下边界情况：

1. **空数组**：返回空数组
2. **无解情况**：返回空数组
3. **重复元素**：题目保证有唯一解
4. **负数**：算法同样适用

```javascript
function twoSum(nums, target) {
    if (!nums || nums.length < 2) {
        return [];
    }
    
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
```

## 扩展：三数之和

基于两数之和的思路，我们可以解决三数之和问题：

```javascript
function threeSum(nums) {
    if (nums.length < 3) return [];
    
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

## 总结

两数之和问题展示了算法优化的重要性：

1. **暴力解法**：思路简单，但效率低下
2. **哈希表解法**：时间空间权衡的最佳选择
3. **双指针法**：适用于已排序数组
4. **边界处理**：提高代码的健壮性

掌握这些解法不仅有助于解决 LeetCode 题目，更重要的是培养了算法思维和优化意识。

---

*算法学习是一个循序渐进的过程，从暴力解法到最优解法，每一步都是思维的提升。*
