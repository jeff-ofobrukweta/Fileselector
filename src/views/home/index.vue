<template>
  <div class="home">
    <Modal
      @close-modal="isModalOpen = false"
      v-if="isModalOpen"
      :folderStructure="currentFolder"
      :selectedFiles="selectedFiles"
      @add-remove-item="addRemove($event)"
      :arrayIncludes="arrayIncludes"
      @next="handleNext($event)"
      @prev="handlePrev"
      :folderDepth="folderDepth"
    />
    <div class="select-file-area">
      <div class="button-area">
        <button class="btn select-btn" @click="isModalOpen = !isModalOpen">
          Select Files
        </button>
      </div>
      <div v-if="selectedFiles.length" class="files-section">
        <span class="selected-header">Files selected</span>
        <div class="files-area">
          <div
            class="file"
            v-for="(item, index) in selectedFiles"
            :key="item.id || index"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosGet } from "@/utils/api";
import Modal from "@/components/modal/index.vue";
export default {
  name: "Home",
  components: {
    Modal,
  },
  data() {
    return {
      folderStructure: null,
      isModalOpen: false,
      selectedFiles: [],
      folderDepth: [],
      currentFolder: null,
    };
  },
  methods: {
    // method to check if an array objects includes a certain property
    arrayIncludes(array, property, itemToFind) {
      return (
        array.filter((arr) => arr[property] && arr[property] === itemToFind)
          .length > 0
      );
    },
    // method to get property with the string
    getPropertyWithString(object, string) {
      string = string.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
      string = string.replace(/^\./, ""); // strip a leading dot
      const a = string.split(".");
      for (let i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in object) {
          object = object[k];
        } else {
          return;
        }
      }
      return object;
    },

    addRemove(item) {
      this.selectedFiles = [...item];
    },

    // handling next
    handleNext(e) {
      this.folderDepth.push(".folders");
      this.folderDepth.push(`[${e}]`);
      this.currentFolder = this.currentFolder.folders[e];
    },

    // going backwards
    handlePrev() {
      if (this.folderDepth.length < 1) {
        this.currentFolder = this.folderStructure;
        return;
      }
      this.folderDepth.pop();
      this.folderDepth.pop();
      const folderDepthString = this.folderDepth.toString().replace(/,/g, "");
      if (!folderDepthString.length) {
        this.currentFolder = this.folderStructure;
      } else {
        this.currentFolder = this.getPropertyWithString(
          this.folderStructure,
          folderDepthString
        );
      }
    },
  },

  mounted() {
    // function to get list of folders
    axiosGet()
      .then((data) => {
        this.folderStructure = { ...data };
        this.currentFolder = { ...this.folderStructure };
      })
      .catch((err) => {
        throw new Error(err);
      });
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
