# 📐 開發規範

> 用於團隊專題協作時統一寫法、提升可讀性與維護性

---

## 🎨 SCSS 規範

- 巢狀層級 **不超過 3 層**（即大括號最多 3 層）
- **變數命名**：
  - 使用 `$` 開頭
  - 命名格式為 **kebab-case**（烤肉串命名）
  - 例：`$color-primary`
- **縮排**：兩個空格

## 📌 SCSS 檔案新增流程：

```scss
// 1. 建立檔案（例如 _card.scss）
src/assets/scss/_card.scss

// 2. 到 style.scss 中加入
@forward "./assets/scss/card";
```

---

## 🧠 JavaScript 規範

```js
// 禁止使用 var
const userName = "Jason";

// 使用箭頭函式為主
const handleClick = () => {
  console.log("clicked");
};

// 小駝峰命名（camelCase）
let userScore = 10;

// 布林變數前綴加 is / has / can
const hasData = true;
let isLoading = false;
const canSubmit = true;

// 回傳布林值的函式前綴加 check
function checkIsUser() {
  return Boolean(localStorage.getItem("token"));
}

// 縮排使用兩個空格
if (hasData) {
  console.log("資料存在");
}
```

---

## 📁 其他規範

| 類別            | 規範說明                                         |
| --------------- | ------------------------------------------------ |
| Vue 元件檔名    | 使用 **大駝峰命名（PascalCase）**                |
| class / id 名稱 | 建議直接「複製貼上」，避免手打出錯導致找不到     |
| 新增圖片        | 在 src/assets/img 底下新增，建立新資料夾後再新增 |
| 圖片與檔案命名  | 一律使用 **kebab-case**                          |
| 其他命名規範    | 若有連接詞則使用底線\_（例：`menu_and_nav`）     |
| SCSS 註解風格   | 區塊建議用 `// === 區塊名稱 ===`，其餘自由書寫   |
| RWD 設計順序    | 手機優先（Mobile First）                         |
