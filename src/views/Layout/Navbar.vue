<template>
  <div class="nav-bar-wrapper"
    :class="{'is-home-page': isHomePage}"
    :style="`background-image:url(${this.$customizeConfig.selected.bannerBackground};`"
  >
    <div class="nav-bar-mobile"
      :style="`background-image:url(${this.$customizeConfig.selected.mobileBannerBackground};`">
      <div class="container align-items-center">
        <a class="logo-container" :href="`/`" >
          <img class ="logo" :src="this.$customizeConfig.logo"/>
        </a>
        <div class="rate">
          <!--<div v-if="this.sourceSelected === 'kusama'" class="kms-rate">
            <span class="label">{{$t('kusama.short')}}</span>
            <span class="info">{{price}}</span>
          </div>-->
        </div>
        <div class="right-menu align-items-center">
          <ul class="nav-item-list align-items-center">
            <router-link class="nav-item" to="/block" tag="a" active-class="choosed">{{$t('blocks')}}</router-link>
            <router-link class="nav-item" to="/extrinsic" tag="a" active-class="choosed">{{$t('extrinsics')}}</router-link>
            <router-link v-if="this.$customizeConfig.hasModule('transfer')"
            class="nav-item" to="/transfer" tag="a" active-class="choosed">{{$t('transfers')}}</router-link>
            <el-dropdown class="account-dropdown" trigger="click">
              <li class="nav-item">{{$t('accounts')}}</li>
              <el-dropdown-menu slot="dropdown" class="account-dropdown-menu">
                <el-dropdown-item v-if="this.$customizeConfig.hasModule('staking')"  class="menu-item">
                  <router-link class="account-nav-item" to="/validator" tag="a" active-class="choosed">{{$t('validators')}}</router-link>
                </el-dropdown-item>
                <el-dropdown-item class="menu-item">
                <router-link class="account-nav-item"
                  :to="`/asset/${getCurrencyName}`" tag="a" active-class="choosed">{{$t('holders')}}</router-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ul>
          <el-dropdown class="dropdown" trigger="click">
            <span class="el-dropdown-link align-items-center">
              <!--<div class="choosed-source">{{sourceSelectedLabel}}</div>-->
              <div>
                <img class ="network-button" :src="this.$customizeConfig.selected.buttonIcon"/>
              </div>


            </span>
            <el-dropdown-menu slot="dropdown" class="menu-dropdown">
              <li
                class="menu-dropdown-item align-items-center"
                v-for="item in this.$customizeConfig.chains"
                :key="item.name"
              >
                <i class="choosed-icon" :class="{show: sourceSelected===item.name}"></i>
                <a class="menu-dropdown-item-label" :href="`/?network=${item.name}`">{{item.name}}</a>
              </li>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="mobile-menu">
            <div class="menu-area" @click="drawer = true">
              <icon-svg icon-class="menu" class="icon"/>
            </div>
          </div>
          <el-drawer
            :title="$t('menu')"
            class="mobile-drawer"
            size="260px"
            :visible.sync="drawer"
            :direction="direction">
            <div class="drawer-content">
              <div class="menu-section">
                <div class="row">
                    <router-link class="item" to="/" tag="div" @click.native="drawer = false">{{$t('home')}}</router-link>
                    <el-collapse v-model="activeNames" @change="handleChange">
                      <router-link class="item" to="/block" tag="div" @click.native="drawer = false">{{$t('blocks')}}</router-link>
                      <router-link class="item" to="/extrinsic" tag="div" @click.native="drawer = false">{{$t('extrinsics')}}</router-link>
                      <router-link class="item" to="/transfer" tag="div" @click.native="drawer = false">{{$t('transfers')}}</router-link>
                      <el-collapse-item :title="$t('accounts')" name="1">
                        <router-link v-if="this.$customizeConfig.hasModule('staking')"
                         class="sub-item" to="/validator" tag="div" @click.native="drawer = false">{{$t('validators')}}</router-link>
                        <router-link class="sub-item" :to="`/asset/${getCurrencyName}`" tag="div" @click.native="drawer = false">{{$t('holders')}}</router-link>
                      </el-collapse-item>
                    </el-collapse>
                </div>
              </div>
              <div class="language-section">
                <div class="row">
                  <div class="item" @click="changeLanguage('zh-CN')">简体中文</div>
                  <div class="item" @click="changeLanguage('en')">English</div>
                </div>
              </div>
            </div>
          </el-drawer>
        </div>
      </div>
      <div class="nav-bar-search">
        <search-input
          class="search-input"
          :selectList="selectList"
          :placeholder="$t('placeholder.search_by')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import SearchInput from '@/views/Components/SearchInput';
import { fmtNumber, fmtPercentage} from '../../utils/format';
export default {
  name: "NavBar",
  components: {
    SearchInput
  },
  data() {
    return {
      currentTime: Date.now(),
      drawer: false,
      direction: 'rtl',
      selectList: [
        {
          label: this.$t('all'),
          value: "all"
        },
        {
          label: this.$t('block'),
          value: "block"
        },
        {
          label: this.$t('extrinsic'),
          value: "extrinsic"
        },
        {
          label: this.$t('account'),
          value: "account"
        }
      ],
      activeNames: []
      // sourceList: [
      //   {
      //     label: "Kusama CC3",
      //     value: "kusama"
      //   },
      //   {
      //     label: "Darwinia Icefrog",
      //     value: "icefrog"
      //   },
      //   {
      //     label: "Edgeware Testnet",
      //     value: "edgeware"
      //   }
      // ]
    };
  },
  computed: {
    // sourceSelectedValue() {
    //   return this.sourceList.find(item => {
    //     return item.value === this.sourceSelected;
    //   }).value;
    // },
    isHomePage() {
      let path = this.$route.path;
      let result = false;
      switch (path) {
        case '/':
        case '/404':
        case '/noData':
          result = true;
          break;
        default:
            break;
      }
      return result
    },
    price() {
      if (this.token.detail) {
        let tokenDetail = this.token.detail[this.token.token];
        let price = '$' + fmtNumber(tokenDetail.price, 3);
        let change = ' (' + fmtPercentage(tokenDetail.price_change, 1, 2) + '%)';
        return price + change;
      } else {
        return '';
      }
    },
    getCurrencyName(){
      let currency = this.$customizeConfig.getCurrencyByType( 1)
      if(typeof currency === 'undefined'){
        currency = this.$customizeConfig.getCurrencyByType( 3)
      }
      return currency.name

    },
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.token
    })
  },
  created() {
    this.init();
    this.w = new Worker('/' + "timeWorker.js");
    this.w.onmessage = () => {
      this.changeTime();
    };
  },
  beforeDestroy() {
    // 销毁 worker
    if (this.w && typeof this.w.terminate === "function") {
      this.w.terminate();
    }
    this.$loop.removeLoop("metadata");
    this.$loop.removeLoop("token");
  },
  methods: {
    async init() {
      // await this.getData();
      this.$loop.addLoop(
        "metadata",
        () => {
          return this.getMetaData();
        },
        true
      );
      this.$loop.addLoop(
        "token",
        () => {
          return this.getToken();
        },
        true
      );
    },
    async getToken() {
      await Promise.all([
        this.$store.dispatch("SetToken")
      ]);
    },
    async getMetaData() {
      await Promise.all([
        this.$store.dispatch("SetMetadata")
      ]);
    },
    changeLanguage(language) {
      GLOBAL.vbus.$emit("CHANGE_LANGUAGE", language);
      this.$store.dispatch("SetLanguage", language);
      this.closeDrawer();
    },
    closeDrawer() {
      this.drawer = false;
    },
    getSourceHref(source) {
      return this.$const[`SYMBOL/${source}`]['domain']['value'];
    },
    changeTime() {
      this.currentTime = Date.now();
    },
    handleChange(val) {
        console.log(val);
      }
  }
};
</script>
<style lang="scss" scoped>
.nav-bar-wrapper {
  height: 50px;
  background: var(--navbar-bg);
  position: relative;
  color: #fff;
  .container {
    height: 100%;
    .logo {
      height: 25px;
      width: 125px;
      cursor: pointer;
    }
    .rate {
      flex: 1 1 auto;
      margin-top: 2px;
      font-size: 14px;
      .label {
        font-weight: bold;
      }
      .info {
        margin-left: 8px;
      }
    }
    .right-menu {
      .nav-item-list {
        > .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
          margin-right: 15px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .account-dropdown {
        color: #fff;
        .nav-item {
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          font-size: 14px;
          user-select: none;
          font-weight: 600;
        }
      }
      .dropdown {
        margin-left: 15px;
        margin-right: 1px;
        border-radius: 2px;
        .el-dropdown-link {
          /*padding: 0 10px;*/
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          .dropdown-icon {
            font-size: 11px;
          }
          .choosed-source {
            height: 31px;
            line-height: 31px;
            color: #201550;
            margin-right: 5px;
          }
        }
      }
      .mobile-menu {
        display: none;
      }

      .network-button{
        height: 30px;
        border-radius: 2px;
        background-color: #fff;
        display: flex;
        align-items: center;
      }
    }
    .logo-container {
      margin-right: 10px;
    }
  }
  .nav-bar-search {
    display: none;
  }
  &.is-home-page {
    height: 162px;
    .container {
      height: 80px;
    }
    .nav-bar-search {
      display: block;
      margin-top: 4px;
      margin-bottom: 4px;
      > div {
        width: 760px;
        margin: 0 auto;
      }
    }
  }
  @media screen and (max-width:$screen-xs) {
    .container {
      padding: 0 15px;
      .logo {
        flex: 0 0 45vw;
        margin-left: 10px;
      }
      .rate {
        display: none;
      }
      .right-menu {
        flex: 1 1 auto;
        .nav-item-list {
          display: none;
        }
        .dropdown {
          margin-left: 0;
        }
        .network-button{
          width: 100px;
        }
        .mobile-menu {
          display: block;
          font-size: 34px;
          flex: 1 1 auto;
          text-align: right;
          .menu-area {
            display: inline-block;
            padding-left: 10px;
          }
          .icon {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.drawer-content {
  height: 100%;
  color: #FFF;
  display: flex;
  flex-direction: column;
  .menu-section {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    text-align: center;
    background-color: #272727;
    .row {
      padding-top: 26px;
    }
    /deep/.el-collapse {
      border: none;
      padding-left: 30px;
      .item {
        margin-left: 0;
      }
      .el-collapse-item__header {
        background-color: initial;
        color: #fff;
        border: none;
        font-size: 20px;
        font-weight: 400;
      }
      .el-collapse-item__wrap {
        background-color: initial;
        color: #fff;
        border: none;
        text-align: left;
        padding-left: 10px;
      }
      .el-collapse-item__content{
        padding-bottom: 0;
        max-height: 200px;
        overflow: scroll;
      }
    }
    .item {
      font-size: 20px;
      padding: 10px 0;
      margin-left: 30px;
      color: #FFF;
      text-align: left;
    }
    .sub-item {
      display: block;
      font-size: 14px;
      padding: 10px 0;
      color: #fff;
    }
  }
  .language-section {
    height: 70px;
    background-color: #1D1D1D;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    text-align: center;
    .item {
      padding: 10px;
    }
  }
}

</style>
<style lang="scss"> 
.nav-bar-wrapper {
  background: var(--navbar-bg);
  &.is-home-page {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .nav-bar-mobile {
    background-size: 0 0;
  }
}
@media screen and (max-width:$screen-xs) {
  .nav-bar-wrapper {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 0 0;
    &.is-home-page {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 0 0;
    }
    .nav-bar-mobile {
      background-size: cover;
    }
  }
}
.account-dropdown-menu.el-dropdown-menu {
  .menu-item {
    text-align: center;
    color: #212529;
    cursor: pointer;
    outline: none;
    &:hover {
      color: #16181b;
      text-decoration: none;
      background-color: #f8f9fa;
    }
  }
}
.menu-dropdown.el-dropdown-menu {
  margin-top: 20px;
  background: #fff;
  padding: 5px 0;
  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  .menu-dropdown-item {
    line-height: 22px;
    height: 42px;
    padding: 10px 24px;
    cursor: pointer;
    .menu-dropdown-item-label {
      font-size: 16px;
      font-weight: 600;
      color: #201550;
    }
    .choosed-icon {
      margin-right: 10px;
      border-radius: 50%;
      width: 7px;
      height: 7px;
      background: linear-gradient(
        315deg,
        rgba(254, 56, 118, 1) 0%,
        rgba(124, 48, 221, 1) 71%,
        rgba(58, 48, 221, 1) 100%
      );
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }
  .popper__arrow {
    opacity: 0;
  }
}
.mobile-drawer {
  .el-drawer {
    color: #FFF;
    background-color: #302B3C;
  }
  .el-drawer__header {
    padding: 10px 0;
    color: #FFF;
    background-color: #1D1D1D;
    margin-bottom: 0;
    > span {
      margin-left: 10px;
      font-size: 14px;
    }
    button {
      padding: 0 10px;
    }
  }
}

</style>
