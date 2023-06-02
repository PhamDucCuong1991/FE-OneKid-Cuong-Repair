<template>
  <div>
    <h1>thay đổi ngôn ngữ</h1>
    <div>
      <button
        v-for="entry in languages"
        :key="entry.title"
        @click="changeLocale(entry.language)"
      >
        <flag :iso="entry.flag" v-bind:squared="false" />
        {{ entry.title }}
      </button>
    </div>
    <div>sau khi thay đổi</div>
    <h1>{{ $t("welcomeMsg") }}</h1>
    <h1>{{ $t("guide") }}</h1>
  </div>
</template>

<script>
import i18n from "@/language/i18n.js";
export default {
  data() {
    return {
      languages: [
        { flag: "us", language: "en", title: "English" },
        { flag: "vn", language: "vn", title: "Vietnam" },
      ],
    };
  },
  methods: {
    changeLocale(locale) {
      i18n.locale = locale;
    },
  },
};
</script>
