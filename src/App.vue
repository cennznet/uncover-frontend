<template>
  <div
    id="app"
    :class="[sourceSelected]"
    :style="
      `--main-color: ${this.$customizeConfig.selected.themeColor.mainColor};
    --main-color-light: ${
      this.$customizeConfig.selected.themeColor.mainColorLight
    };
    --main-color-white: ${
      this.$customizeConfig.selected.themeColor.mainColorWhite
    };
    --main-button-color: ${
      this.$customizeConfig.selected.themeColor.mainButtonColor
    };
    --link-color: ${this.$customizeConfig.selected.themeColor.linkColor};
    --navbar-bg: ${this.$customizeConfig.selected.themeColor.navbarBg};`
    "
  >
    <navbar />
    <div class="main">
      <router-view />
    </div>
    <footer-bar class="footer-bar"></footer-bar>
  </div>
</template>

<script>
import Navbar from "Views/Layout/Navbar";
import FooterBar from "Views/Layout/FooterBar";

const queryString = require("query-string");
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    navbar: Navbar,
    footerBar: FooterBar
  },
  data() {
    return {
      // network: [
      //   {
      //     key: "kusama",
      //     value: "kusama"
      //   },
      //   {
      //     key: "edgeware",
      //     value: "edgeware"
      //   },
      //   {
      //     key: "icefrog",
      //     value: "icefrog"
      //   }
      // ]
    };
  },
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected
    })
  },
  created() {
    // 接受路由中携带语言参数lang
    const parsedObj = queryString.parse(location.search);
    let language = parsedObj["lang"];

    if (language) {
      if (["en", "zh-CN"].indexOf(language) === -1) {
        // 浏览器语言不在列表中
        language = "en";
      }
      this.$store.dispatch("SetLanguage", language);
      this.$i18n.locale = language;
    }
    this.detectNetwork();
  },
  mounted() {
    GLOBAL.vbus.$on("CHANGE_LANGUAGE", language => {
      this.$i18n.locale = language;
    });
    document.getElementsByTagName("body")[0].className = this.sourceSelected;
  },
  methods: {
    detectNetwork() {
      let networkParam = process.env.VUE_APP_CHAIN_NAME;
      const materialText = location.host + networkParam;
      let network = this.$customizeConfig.defaultChain; //this.network[1].value;
      this.$customizeConfig.chains.forEach(item => {
        if (materialText.indexOf(item.name) > -1) {
          network = item.name;
        }
      });
      this.$store.dispatch("SetSourceSelected", network);
      this.$customizeConfig.setSelected(network);
    }
  }
};
</script>

<style lang="scss">
@import "./assets/style/index.scss";
// body {
// &.azalea {
//   --main-color: #5930dd;
//   --main-color-light: #5930dd80;
//   --main-color-white: #5930dd0d;
//   --main-button-color: #302b3c;
//   --link-color: #4572de;
//   --navbar-bg: linear-gradient(
//     315deg,
//     rgba(254, 56, 118, 1) 0%,
//     rgba(124, 48, 221, 1) 71%,
//     rgba(58, 48, 221, 1) 100%
//   );
// }

// &.kusama {
//   --main-color: #e90979;
//   --main-color-light: #e9097980;
//   --main-color-white: #e909790d;
//   --main-button-color: #302b3c;
//   --link-color: #4572de;
//   --navbar-bg: #000;
// }

// &.polkadot {
//   --main-color: #e90979;
//   --main-color-light: #e9097980;
//   --main-color-white: #e909790d;
//   --main-button-color: #302b3c;
//   --link-color: #4572de;
//   --navbar-bg: #e90979;
// }

// &.edgeware {
//   --main-color: #000;
//   --main-color-light: #00000080;
//   --main-color-white: #0000000d;
//   --main-button-color: #302b3c;
//   --link-color: #4572de;
//   --navbar-bg: #000;
// }
// }
#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .nav-bar {
    flex: none;
  }
  .footer-bar {
    flex: none;
  }
  .main {
    flex: auto;
    background: #f8f9fa;
  }
  .subscan-content {
    padding: 20px 0;
    overflow: scroll;
  }
  .subscan-card {
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: 1px solid rgba(231, 234, 243, 1);
  }
  .not-found-img {
    display: block;
    margin: 0 auto;
    width: 290px;
    height: 250px;
  }
  .el-table {
    &::before {
      background-color: transparent;
    }
    tr:last-child {
      td {
        border-bottom: none;
      }
    }
  }

  // &.icefrog {
  //   --main-color: #5930dd;
  //   --main-color-light: #5930dd80;
  //   --main-color-white: #5930dd0d;
  //   --main-button-color: #302b3c;
  //   --link-color: #4572de;
  //   --navbar-bg: linear-gradient(
  //     315deg,
  //     rgba(254, 56, 118, 1) 0%,
  //     rgba(124, 48, 221, 1) 71%,
  //     rgba(58, 48, 221, 1) 100%
  //   );
  // }

  // &.kusama {
  //   --main-color: #e90979;
  //   --main-color-light: #e9097980;
  //   --main-color-white: #e909790d;
  //   --main-button-color: #302b3c;
  //   --link-color: #4572de;
  //   --navbar-bg: #000;
  // }

  // &.polkadot {
  //   --main-color: #e90979;
  //   --main-color-light: #e9097980;
  //   --main-color-white: #e909790d;
  //   --main-button-color: #302b3c;
  //   --link-color: #4572de;
  //   --navbar-bg: #e90979;
  // }

  // &.edgeware {
  //   --main-color: #000;
  //   --main-color-light: #00000080;
  //   --main-color-white: #0000000d;
  //   --main-button-color: #302b3c;
  //   --link-color: #4572de;
  //   --navbar-bg: #000;
  // }

  --black-color: #302b3c;
  .link {
    a {
      color: var(--link-color);
    }
  }
  @media screen and (max-width: $screen-xs) {
    .main {
      padding-left: 20px;
      padding-right: 20px;
    }
    > .nav-bar-wrapper {
      height: 125px;
      &.is-home-page,
      .nav-bar-mobile {
        height: 125px;
        .nav-bar-search {
          margin-top: 10px;
        }
      }
      .nav-bar-search {
        display: block;
        padding: 0 20px;
        margin-top: 10px;
        > div.search-input-wrapper {
          width: 100%;
        }
      }
      .container {
        height: 50px;
      }
    }
    .container {
      .search-input-wrapper {
        display: none;
      }
    }
  }
}
</style>
