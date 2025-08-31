<template>
  <footer class="footer-bar">
    <p class="footer-text">© 2025 逍遥子搜索引擎</p>
    <div class="footer-links">
      <a href="https://github.com/your-repo" target="_blank">GitHub</a>
      <span>|</span>
      <a href="https://your-website.com" target="_blank">官网</a>
      <span>|</span>
      <a href="mailto:your-email@example.com">联系我</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterBar",
};
</script>

<style scoped>
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  /* 渐变背景 + 半透明效果 */
  background: linear-gradient(
    to top,
    rgba(92, 98, 176, 0.9),
    rgba(92, 98, 176, 0)
  );
  backdrop-filter: blur(6px);

  color: white;
  text-align: center;
  padding: 8px 10px; /* 更轻薄 */
  font-size: 13px;

  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);
}

.footer-text {
  margin: 0;
  font-size: 12px;
  color: #eee;
}

.footer-links {
  margin-top: 4px;
  font-size: 13px;
}

.footer-links a {
  color: #ddd;
  text-decoration: none;
  margin: 0 6px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
  text-decoration: underline;
}
</style>
