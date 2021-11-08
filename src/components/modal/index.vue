<template>
  <portal to="modal-wrapper">
    <transition name="fade" appear>
      <div class="modal-background-main">
        <transition name="pop" appear>
          <div class="modal-wrapper-main">
            <div class="modal-header-wrapper">
              <slot name="modal-header">
                <div class="modal-header-left">
                  <button
                    v-if="folderDepth.length > 1"
                    @click="$emit('prev')"
                    class="prev-btn active-hover pointer"
                  >
                    <i class="fas fa-arrow-left"></i>
                  </button>
                  <span class="folder-name">{{
                    folderStructure && folderStructure.name
                      ? folderStructure.name
                      : fileRoot
                  }}</span>
                </div>
                <div class="modal-header-right">
                  <button
                    @click="$emit('close-modal')"
                    class="cancel-btn active-hover pointer"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </slot>
            </div>
            <div class="modal-body-wrapper scrollbar">
              <slot name="modal-body">
                <button
                  class="folder-item active-hover pointer"
                  v-for="(item, index) in folderStructure &&
                  folderStructure.folders
                    ? folderStructure.folders
                    : []"
                  :key="item.id || index"
                  @click="$emit('next', index)"
                >
                  <div class="folder-left">
                    <span class="folder-icon pointer"
                      ><i class="far fa-folder"></i>
                    </span>
                    <span class="folder-name">{{ item.name }}</span>
                  </div>
                  <div class="folder-right">
                    <span class="inner-btn pointer">
                      <i class="fas fa-greater-than"></i>
                    </span>
                  </div>
                </button>
                <button
                  v-for="(item, index) in folderStructure &&
                  folderStructure.files
                    ? folderStructure.files.filter(
                        (file) =>
                          file.mimeType === 'image/jpeg' ||
                          file.mimeType === 'image/png' ||
                          file.mimeType === 'application/pdf'
                      )
                    : []"
                  :key="item.id || index"
                  @click="addRemove(item)"
                  class="image-item active-hover pointer"
                >
                  <div class="image-left">
                    <span class="image-icon pointer">
                      <!-- <i
                        v-if="item.mimeType === 'application/pdf'"
                        class="far fa-file-pdf"
                      ></i> -->
                      <i
                        v-if="item.mimeType === 'application/pdf'"
                        class="far fa-file-image"
                      ></i>
                      <img
                        v-else
                        @error="handleImgErr"
                        :src="item.url"
                        :alt="item.name"
                      />
                    </span>
                    <span class="image-name">{{ item.name }}</span>
                  </div>
                  <div
                    v-if="arrayIncludes(temporarySelection, 'id', item.id)"
                    class="image-right"
                  >
                    <span class="inner-btn pointer">
                      <i class="fas fa-check-circle"></i>
                    </span>
                  </div>
                </button>
              </slot>
            </div>
            <div class="modal-footer-wrapper">
              <slot name="modal-footer">
                <div class="btn-wrapper">
                  <button
                    :disabled="temporarySelection.length < 1"
                    @click="handleSave"
                    class="btn inner-modal-btn"
                  >
                    Select
                    {{
                      temporarySelection.length > 0
                        ? temporarySelection.length
                        : ""
                    }}
                    File{{ temporarySelection.length > 1 ? "s" : "" }}
                  </button>
                </div>
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </portal>
</template>
<script>
import { Portal } from "portal-vue";
import errorImagePlaceholder from "../../assets/error-img.png";
export default {
  name: "Modal",
  data() {
    return {
      temporarySelection: [],
      fileRoot: "C:\\",
      errorImagePlaceholder,
    };
  },
  components: {
    Portal,
  },
  props: {
    folderStructure: {
      type: Object,
      default: () => {},
    },
    selectedFiles: {
      type: Array,
      default: () => [],
    },
    arrayIncludes: {
      type: Function,
    },
    folderDepth: {
      type: Array,
    },
  },
  methods: {
    // item to add and remove item from list
    addRemove(item) {
      this.arrayIncludes(this.temporarySelection, "id", item.id)
        ? (this.temporarySelection = this.temporarySelection?.filter(
            (file) => file?.id !== item?.id
          ))
        : this.temporarySelection.push(item);
    },

    // function to save and close modal
    handleSave() {
      this.$emit("add-remove-item", this.temporarySelection);
      this.$emit("close-modal");
    },

    // function to change imgage src on error
    handleImgErr(img) {
      img.target.src = this.errorImagePlaceholder;
    },
  },
  mounted() {
    if (this.selectedFiles.length) {
      this.temporarySelection = [...this.selectedFiles];
    }
  },
  watch: {
    selectedFiles: {
      handler: function (newValue) {
        if (newValue.length) {
          this.temporarySelection = [...newValue];
        }
      },
      deep: true, // check the children of the arr changes
    },
  },
  beforeDestroy() {
    // reseting the value of temporary selection
    this.temporarySelection = null;
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
