<template>
  <view class="dialog-overlay" v-if="draft.visible">
    <view class="dialog-header">
      <h3>{{ title }}</h3>
    </view>
    <view class="dialog-content">
      <view v-for="(item, index) in draft.detailsFields">
        <view> {{ item.label }}</view>
        <view> <component :is="generateField(item.type)"></component></view>
      </view>
    </view>
  </view>
</template>
<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: "",
    },
    draft: {
      detailsFields: {
        type: Array,
        required: {
          label: "haha",
          fieldType: "select",
          fieldName: "haha",
          option: [],
        },
      },
    },
  },
  methods: {
    generateField(item) {
      switch (item?.fieldType) {
        case "select":
      }
    },
  },
  setup() {},
});
</script>

<style></style>