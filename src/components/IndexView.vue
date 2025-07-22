<template>
  <div id="app">
    <el-container
      style="height: 100vhl; text-align: center; background-color: #7a80e6"
    >
      <el-header>
        <h1>逍遥子 - 搜索引擎</h1>
      </el-header>
      <el-main>
        <el-input
          v-model="searchKeyword"
          placeholder="请输入搜索关键词"
          @keyup.enter.native="search"
          style="width: 50%; margin-bottom: 20px"
        >
          <template #prepend>
            <el-select
              v-model="searchType"
              placeholder="搜索类型"
              style="width: 100px"
            >
              <el-option label="网页" value="web"></el-option>
            </el-select>
          </template>
          <template #append>
            <el-button @click="search" icon="el-icon-search"></el-button>
          </template>
        </el-input>
        <el-result
          v-if="searchResults.length === 0 && hasSearched"
          icon="Info"
          title="没有找到相关结果"
        ></el-result>
        <div v-else>
          <el-card
            v-for="(result, index) in searchResults"
            :key="index"
            class="search-result-card"
            shadow="hover"
          >
            <template #header>
              <div class="result-header">
                <a :href="result.link" target="_blank" class="result-title">
                  {{ result.title }}
                </a>
              </div>
            </template>
            <div
              class="result-description"
              v-html="formatDescription(result.description)"
            ></div>
            <div class="result-url">
              <a :href="result.link" target="_blank" class="url-link">
                {{ result.link }}
              </a>
            </div>
            <div class="result-date" v-if="result.date">
              <el-tag type="info" size="small">{{ result.date }}</el-tag>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchKeyword: "",
      searchType: "web",
      searchResults: [],
      hasSearched: false,
    };
  },
  methods: {
    search() {
      if (!this.searchKeyword.trim()) {
        this.$message.warning("请输入搜索关键词");
        return;
      }
      this.hasSearched = true;
      axios
        .post("http://39.105.141.108:9090/api/search", this.searchKeyword)
        .then((response) => {
          this.parseSearchResults(response.data);
        })
        .catch((error) => {
          console.error("搜索失败:", error);
          this.$message.error("搜索失败，请稍后再试");
        });
    },
    parseSearchResults(data) {
      this.searchResults = data.map((item) => {
        const lines = item.split("\n").filter((line) => line.trim() !== "");
        let title = "";
        let link = "";
        let description = "";
        let date = "";

        // 智能解析不同格式的数据
        if (lines.length >= 1) {
          // 提取标题（支持"标题："前缀或直接标题）
          if (lines[0].startsWith("标题：")) {
            title = lines[0].substring(3);
          } else {
            title = lines[0];
          }
        }

        // 提取链接（支持"链接："前缀、URL在描述后或手动匹配URL格式）
        if (lines.length >= 2) {
          const secondLine = lines[1].trim();
          if (secondLine.startsWith("链接：")) {
            link = secondLine.substring(3);
          } else if (isValidUrl(secondLine)) {
            link = secondLine;
          } else {
            // 若第二行不是链接，则在描述中查找链接
            link = findUrlInDescription(lines.join("\n"));
          }
        } else {
          // 若行数不足，在描述中查找链接
          link = findUrlInDescription(lines.join("\n"));
        }

        // 提取描述和日期
        let descLines = lines.slice(2);
        if (lines.length >= 2 && !isValidUrl(lines[1].trim())) {
          descLines = lines.slice(1);
        }

        if (descLines.length > 0) {
          const firstDescLine = descLines[0].trim();
          const dateMatch = firstDescLine.match(
            /(\d{4}年\d{1,2}月\d{1,2}日) · /
          );
          if (dateMatch && dateMatch[1]) {
            date = dateMatch[1];
            description =
              firstDescLine.replace(dateMatch[0], "").trim() +
              (descLines.length > 1
                ? "\n" + descLines.slice(1).join("\n")
                : "");
          } else {
            description = descLines.join("\n").trim();
          }
        }

        return {
          title,
          link,
          description,
          date,
        };
      });
    },
    formatDescription(desc) {
      return desc
        .replace(/(\d+)\./g, "<span class='list-item'>$1.</span>")
        .replace(/\n/g, "<br>");
    },
  },
};

// 工具函数：验证URL有效性
function isValidUrl(url) {
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  return urlPattern.test(url);
}

// 工具函数：从文本中提取URL
function findUrlInDescription(text) {
  const urlPattern = /https?:\/\/[^\s]+/g;
  const match = text.match(urlPattern);
  return match ? match[0] : "";
}
</script>

<style>
/* 保持原有样式不变，新增链接样式 */
.url-link {
  color: #006621;
  font-size: 12px;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
    color: #004d19;
  }
}
</style>
