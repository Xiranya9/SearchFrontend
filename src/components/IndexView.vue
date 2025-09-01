<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 标题栏 -->
      <el-header>
        <h1>逍遥子 - 搜索引擎</h1>
      </el-header>

      <!-- 主体 -->
      <el-main>
        <!-- 搜索框 -->
        <el-input
          v-model="searchKeyword"
          placeholder="请输入搜索关键词"
          @keyup.enter.native="handleSearch"
          class="search-input"
        >
          <!-- 搜索类型选择 -->
          <template #prepend>
            <el-select
              v-model="searchType"
              placeholder="搜索类型"
              style="width: 100px"
            >
              <el-option label="网页" value="web"></el-option>
            </el-select>
          </template>

          <!-- 搜索按钮 -->
          <template #append>
            <el-button @click="handleSearch" icon="el-icon-search"></el-button>
          </template>
        </el-input>

        <!-- 加载动画 -->
        <div v-if="loading" class="loading-container">
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
          <p>正在搜索，请稍候...</p>
        </div>

        <!-- 搜索结果 -->
        <transition name="fade">
          <el-result
            v-if="!searchResults.length && hasSearched && !loading"
            icon="Info"
            title="没有找到相关结果"
          />
        </transition>

        <transition-group name="fade" tag="div">
          <el-card
            v-for="(result, index) in searchResults"
            :key="index"
            class="search-result-card"
            shadow="hover"
          >
            <!-- 结果标题 -->
            <template #header>
              <a :href="result.link" target="_blank" class="result-title">
                {{ result.title }}
              </a>
            </template>

            <!-- 描述 -->
            <div
              class="result-description"
              v-html="formatDescription(result.description)"
            />

            <!-- 链接 -->
            <div class="result-url">
              <a :href="result.link" target="_blank" class="url-link">{{
                result.link
              }}</a>
            </div>

            <!-- 日期 -->
            <div class="result-date" v-if="result.date">
              <el-tag type="info" size="small">{{ result.date }}</el-tag>
            </div>
          </el-card>
        </transition-group>
      </el-main>
    </el-container>
    <FooterBar />
  </div>
</template>

<script>
import axios from "axios";
import { isValidUrl, findUrlInText } from "../utils/urlUtils";
import { Loading } from "@element-plus/icons-vue";
import FooterBar from "./FootBar.vue";

export default {
  components: { Loading, FooterBar },
  data() {
    return {
      searchKeyword: "",
      searchType: "web",

      searchResults: [],
      hasSearched: false,
      loading: false, // 新增 loading 状态
    };
  },
  methods: {
    /** 点击搜索按钮或回车 */
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.$message.warning("请输入搜索关键词");
        return;
      }

      this.hasSearched = true;
      this.loading = true; // 开始加载

      axios
        .post("http://hdnla.asia:9093/api/search", this.searchKeyword)
        .then((res) => this.parseSearchResults(res.data))
        .catch((err) => {
          console.error("搜索失败:", err);
          this.$message.error("搜索失败，请稍后再试");
        })
        .finally(() => {
          this.loading = false; // 请求结束
        });
    },

    /** 解析后端返回的数据 */
    parseSearchResults(data) {
      this.searchResults = data.map(this.parseSingleResult);
    },

    /** 解析单个结果 */
    parseSingleResult(item) {
      const lines = item.split("\n").filter((line) => line.trim() !== "");
      let [title, link, description, date] = ["", "", "", ""];

      // 标题
      title = lines[0]?.replace(/^标题：/, "") || "";

      // 链接
      const secondLine = lines[1]?.trim();
      if (secondLine?.startsWith("链接：")) {
        link = secondLine.substring(3);
      } else if (isValidUrl(secondLine)) {
        link = secondLine;
      } else {
        link = findUrlInText(lines.join("\n"));
      }

      // 描述 + 日期
      let descLines = lines.slice(2);
      if (secondLine && !isValidUrl(secondLine)) {
        descLines = lines.slice(1);
      }

      if (descLines.length) {
        const firstDescLine = descLines[0];
        const dateMatch = firstDescLine.match(/(\d{4}年\d{1,2}月\d{1,2}日) · /);
        if (dateMatch) {
          date = dateMatch[1];
          description =
            firstDescLine.replace(dateMatch[0], "").trim() +
            (descLines.length > 1 ? "\n" + descLines.slice(1).join("\n") : "");
        } else {
          description = descLines.join("\n").trim();
        }
      }

      return { title, link, description, date };
    },

    /** 格式化描述内容 */
    formatDescription(desc) {
      return desc
        .replace(/(\d+)\./g, "<span class='list-item'>$1.</span>")
        .replace(/\n/g, "<br>");
    },
  },
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  text-align: center;
  background-color: #7a80e6;
  padding-bottom: 50px;
}

.search-input {
  width: 50%;
  margin-bottom: 20px;
}

.loading-container {
  margin-top: 40px;
  font-size: 14px;
  color: #555;
}

.loading-container .el-icon {
  font-size: 28px;
  color: #409eff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.result-title {
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  color: #1a0dab;
}

.result-title:hover {
  text-decoration: underline;
}

.result-description {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.result-url {
  margin-top: 6px;
}

.url-link {
  color: #006621;
  font-size: 12px;
  word-break: break-all;
  text-decoration: none;
}

.url-link:hover {
  text-decoration: underline;
  color: #004d19;
}

/* 渐隐动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
