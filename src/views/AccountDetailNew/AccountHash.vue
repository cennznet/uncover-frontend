<template>
    <div class="account-hash">
            <div class="icon">
              <identicon :size="this.size" theme="polkadot" :value="this.hash" />
            </div>
            <div class="detail">
              <div class="align-items-center" :style ="`min-height: ${this.adjustHeight}`"></div>
              <div class="hash-wrapper align-items-center">
                <div class="hash">
                     <router-link :to="`/account/${this.hash}`"
                     >{{hash}}</router-link>
                </div>
                <div class="copy-btn" v-clipboard:copy="hash" v-clipboard:success="clipboardSuccess">
                <icon-svg class="iconfont" icon-class="copy" />
                </div>
              </div>
            </div>
     </div>
</template>>

<script>
import Identicon from "@polkadot/vue-identicon";
import clipboard from "Directives/clipboard";
export default {
    components: {
        Identicon
    },
    directives: {
        clipboard
    },
    props: {
      hash: {
        type: String,
        default: ""
      },
      size: {
        type: Number,
        default: 40
      },
      adjustHeight: {
        type: String,
        default: "0px"
      }
    },
    methods: {
        clipboardSuccess() {
            this.$message({
                type: "success",
                message: this.$t("copy_success")
            });
        }
    }
}
</script>>
<style lang="scss" scoped>
.account-hash{
    display: flex;
    word-break: break-all;
    .detail{
        margin-left: 10px;
        .hash-wrapper{
            .hash{
                color: var(--link-color);
                cursor: pointer;
            }
            .copy-btn {
                margin-left: 10px;
                font-size: 16px;
                color: var(--main-color-light);
                cursor: pointer;
            }
        }
    }
}
</style>>