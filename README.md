# babel-plugin-transform-classname-and

一个用于转换 JSX 元素 className 属性的 & 符的 babel 插件。& 的规则类似预编译样式语言（如，Less）中的一致。

# 用法
这个插件支持将 `jsx` 片段中的 `&` 符像 `Less` 一样转换成父类名。例如：

```jsx
<div className="a">
  <div className="&-b"></div>
</div>
```

```jsx
<div className="a">
  <div className="a-b"></div>
</div>
```

并且可以支持使用 `&[n]`的格式来选择使用某个特定的父类名（默认是第一个，`n`从 0 开始）：
```jsx
<div className="a b">
  <div className="&[1]-c"></div>
</div>
```

```jsx
<div className="a">
  <div className="b-c"></div>
</div>
```

# todo
- [x] 支持取父元素中第 n 个类名
- [ ] 支持 classname 中的类名替换