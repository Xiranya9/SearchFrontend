// src/utils/urlUtils.js

// 校验 URL 是否有效
export function isValidUrl(url) {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  return pattern.test(url);
}

// 从文本中提取第一个 URL
export function findUrlInText(text) {
  const pattern = /https?:\/\/[^\s]+/g;
  const match = text.match(pattern);
  return match ? match[0] : "";
}
