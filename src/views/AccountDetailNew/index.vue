<template>
  <div class="account-wrapper subscan-content">
    <div class="container">
      <search-input
        class="header-right"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <template v-if="notFound">

        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/404.png" alt="404" />
          <div class="no-data">{{$t('no_data')}}</div>
        </div>
      </template>
      <template v-else-if="stakingDetail">
        <div class="account-info subscan-card">
          <div class="account-intro">
            <accountHash :size="40" :hash="address" :adjustHeight="'10px'"></accountHash>
           <!-- <div class="icon">
              <identicon :size="40" theme="polkadot" :value="this.address" />
            </div>
            <div class="detail">
              <div class="name-wrapper align-items-center"></div>
              <div class="address-wrapper align-items-center">
                 <div class="address">{{address}}</div>
                 <div class="copy-btn" v-clipboard:copy="address" v-clipboard:success="clipboardSuccess">
                <icon-svg class="iconfont" icon-class="copy" />
                </div>
              </div>
               <div class="contact-wrapper align-items-center"></div>
            </div> -->
          </div>
          <div class="split-line"></div>  
            <div class="balance">
              <div class="label align-items-center">
                <div class="text">{{$t('balance')}}</div>
              </div>
              <div class="value">
                <div class="align-items-center">
                    <balances
                      :amount="`${addAccuracy(stakingDetail.free, this.stakingCurrency.id)}`"
                      :currencyType="this.stakingCurrency.type"
                    ></balances>
                </div>
              </div>
              <div v-if="spendingDetail && spendingDetail.free" class="value">
                <div class="align-items-center">
                  <balances
                    :amount="`${addAccuracy(spendingDetail.free, this.spendingCurrency.id)}`"
                    :currencyType="this.spendingCurrency.type"
                  ></balances>
                </div>
              </div>
            </div>
            
            <div class="bonded">
              <div class="label align-items-center">
                <div class="text">{{$t('bonded')}}</div>
              </div>
              <div v-if="stakingDetail.lock" class="value">
                <div class="align-items-center">
                    <balances
                      :amount="`${addAccuracy(stakingDetail.lock, this.stakingCurrency.id)}`"
                      :currencyType="this.stakingCurrency.type" :hasImg="false"
                    ></balances>
                </div>
              </div>
              <div v-if="spendingDetail && spendingDetail.lock" class="value">
                <div class="align-items-center">
                    <balances
                      :amount="`${addAccuracy(spendingDetail.lock, this.spendingCurrency.id)}`"
                      :currencyType="this.spendingCurrency.type" :hasImg="false"
                    ></balances>
                </div>
              </div>
            </div>
            <div class="nounce">
              <div class="label align-items-center">
                <div class="text">{{$t('nonce')}}</div>
              </div>
              <div class="value">
                <div class="align-items-center">{{nonce}} </div>
              </div>
            </div>  
        </div>
        
        <div class="transfer-extrinsic-wrapper subscan-card" v-loading="isLoading">
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="`${$t('extrinsics')}${extrinsicsInfo.count>0?` (${extrinsicsInfo.count})`:''}`"
              name="extrinsic"
            >
              <el-table :data="extrinsicsInfo.extrinsics" style="width: 100%">
                <el-table-column min-width="100" prop="extrinsic_index" :label="$t('extrinsic_id')">
                  <template slot-scope="scope">
                    <div class="link">
                      <router-link
                        :to="`/extrinsic/${scope.row.extrinsic_index}`"
                      >{{scope.row.extrinsic_index}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="100" prop="block_num" :label="$t('block')">
                  <template slot-scope="scope">
                    <div class="link">
                      <router-link :to="`/block/${scope.row.block_num}`">{{scope.row.block_num}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="140"
                  prop="extrinsic_hash"
                  :label="$t('extrinsic_hash')"
                  fit
                >
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.extrinsic_hash"
                        placement="top-start"
                      >
                        <router-link
                          :to="`/extrinsic/${scope.row.extrinsic_hash}`"
                        >{{scope.row.extrinsic_hash|hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="150" prop="block_timestamp" :label="$t('age')">
                  <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
                </el-table-column>
                <el-table-column min-width="70" prop="success" :label="$t('result')">
                  <template slot-scope="scope">
                    <icon-svg class="icon" :icon-class="scope.row.success?'success':'failed'" />
                  </template>
                </el-table-column>
                <el-table-column min-width="160" prop="call_module" :label="$t('action')">
                  <template
                    slot-scope="scope"
                  >{{`${scope.row.call_module}(${scope.row.call_module_function})`}}</template>
                </el-table-column>
                <el-table-column width="100" type="expand">
                  <template slot-scope="props">
                    <div class="expand-form">
                      <div v-if="props.row.params && props.row.params.length > 0">
                        <div class="struct-table-content">
                          <TreeItem :treeList="props.row.params" :isFirst="true"
                            treeType="extrinsic" :moudleName="props.row.call_module" 
                            :functionName="props.row.call_module_function"></TreeItem>
                        </div>
                      </div>
                      <div v-else>
                        <div class="label">{{$t('no_data')}}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane v-if="this.$customizeConfig.hasModule('transfer')"
              :label="`${$t('transfers')}${transfersInfo.count>0?` (${transfersInfo.count})`:''}`"
              name="transfer"
            >
              <el-table :data="transfersInfo.transfers" style="width: 100%">
                <el-table-column min-width="120" prop="extrinsic_index" :label="$t('extrinsic_id')">
                  <template slot-scope="scope">
                    <div class="link">
                      <router-link
                        :to="`/extrinsic/${scope.row.extrinsic_index}`"
                      >{{scope.row.extrinsic_index}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="120" prop="block_num" :label="$t('block')">
                  <template slot-scope="scope">
                    <div class="link">
                      <router-link :to="`/block/${scope.row.block_num}`">{{scope.row.block_num}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="150" prop="block_timestamp" :label="$t('age')">
                  <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
                </el-table-column>
                <el-table-column min-width="150" prop="from" :label="$t('from')">
                  <template slot-scope="scope">
                    <div :class="scope.row.from === address ? '' : 'link'">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.from"
                        placement="top-start"
                      >
                        <router-link
                          :to="`/account/${scope.row.from}`"
                        >{{scope.row.from|hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="50">
                  <template>
                    <div class="icon-wrapper">
                      <icon-svg class="iconfont" icon-class="from-to" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="150" prop="to" :label="$t('to')">
                  <template slot-scope="scope">
                    <div :class="scope.row.to === address ? '' : 'link'">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.to"
                        placement="top-start"
                      >
                        <router-link :to="`/account/${scope.row.to}`">{{scope.row.to|hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="120" prop="amount" :label="$t('value')" fit>
                  <template
                    slot-scope="scope"
                  >{{addAccuracy(scope.row.amount,scope.row.asset_id)}} {{getCurrencyName(scope.row.asset_id)}}</template>
                </el-table-column>
                <el-table-column min-width="70" prop="success" :label="$t('result')">
                  <template slot-scope="scope">
                    <icon-svg class="icon" :icon-class="scope.row.success?'success':'failed'" />
                  </template>
                </el-table-column>
                <el-table-column width="150" prop="hash" :label="$t('hash')">
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.hash"
                        placement="top-end"
                      >
                        <router-link
                          :to="`/extrinsic/${scope.row.hash}`"
                        >{{scope.row.hash|hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane
              v-if="this.$customizeConfig.hasModule('vote') && voteInfo.count>0"
              :label="`${$t('vote')}${voteInfo.count>0?` (${voteInfo.count})`:''}`"
              name="vote"
            >
              <el-table :data="voteInfo.list" style="width: 100%">
                <el-table-column min-width="150" prop="nominator_stash" :label="$t('validator')">
                  <template slot-scope="scope">
                    <div class="link">
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.validator_stash"
                        placement="top-start"
                      >
                        <router-link
                          :to="`/validator/${scope.row.validator_stash}`"
                        >{{scope.row.validator_stash | hashFormat}}</router-link>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="150"
                  prop="bonded_owner"
                  :label="$t('validator_bonded')"
                >
                  <template slot-scope="scope">
                    <div>
                      <span>{{scope.row.bonded_owner|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances', true)}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="150"
                  prop="total_bonded"
                  :label="$t('total_bonded')"
                >
                  <template slot-scope="scope">
                    <div>
                      <span>{{getTotalBonded(scope.row.bonded_nominators, scope.row.bonded_owner)|accuracyFormat(tokenDetail.accuracy)}} {{formatSymbol('balances', true)}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="100" prop="count_nominators" :label="$t('nominator')">
                  <template slot-scope="scope">
                    <div :class="{link:scope.row.count_nominators > 0}">
                      <router-link
                        :to="scope.row.count_nominators > 0 ? `/nominator?address=${scope.row.validator_stash}`: `${$route.fullPath}`"
                      >{{scope.row.count_nominators}}</router-link>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="110"
                  prop="validator_prefs_value"
                  :label="$t('commission')"
                >
                  <template slot-scope="scope">
                    <div>
                      <span>{{getCommission(scope.row.validator_prefs_value)}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column min-width="100" prop="my_share" :label="$t('my_share')">
                  <template
                    slot-scope="scope"
                  >{{getMyShare(scope.row.bonded, getTotalBonded(scope.row.bonded_nominators, scope.row.bonded_owner), 2)}}</template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="view-all-extrinsic" @click="goTransferOrExtrinsicByAddress">{{$t('view_all')}}</div>
        </div>
        <div
          class="view-all-extrinsic mobile"
          @click="goTransferOrExtrinsicByAddress"
        >{{$t('view_all')}}</div>
      </template>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import SearchInput from "@/views/Components/SearchInput";
import { mapState } from "vuex";
import { timeAgo, parseTimeToUtc, hashFormat, accuracyFormat } from "Utils/filters";
import clipboard from "Directives/clipboard";
import Balances from "../ExtrinsicDetail/Balances";
import { fmtPercentage, getCommission, bnPlus } from "../../utils/format";
import { getTokenDetail, formatSymbol, getCurrencyTokenDetail } from "../../utils/tools";
import AccountHash from "./AccountHash";
import TreeItem from "../ExtrinsicDetail/TreeItem"
export default {
  name: "AccountDetailNew",
  components: {
    SearchInput,
    Identicon,
    Balances,
    AccountHash,
    TreeItem
  },
  filters: {
    timeAgo,
    parseTimeToUtc,
    hashFormat,
    accuracyFormat
  },
  directives: {
    clipboard
  },
  data() {
    return {
      address: "",
      showKton: false,
      stakingCurrency: this.$customizeConfig.getCurrencyByType(1) 
        || this.$customizeConfig.getCurrencyByType(3),
      spendingCurrency: this.$customizeConfig.getCurrencyByType(2),
      nonce: "",
      stakingDetail: {},
      spendingDetail: {},
      transfersInfo: {
        count: 0,
        transfers: []
      },
      extrinsicsInfo: {
        count: 0,
        extrinsics: []
      },
      voteInfo: {
        count: 0,
        list: []
      },
      activeTab: "extrinsic",
      notFound: false,
      isLoading: false,
      isIntroLoading: false,
      selectList: [
        {
          label: this.$t("all"),
          value: "all"
        },
        {
          label: this.$t("block"),
          value: "block"
        },
        {
          label: this.$t("extrinsic"),
          value: "extrinsic"
        },
        {
          label: this.$t("account"),
          value: "account"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      metadata: state => state.polka.metadata,
      token: state => state.polka.token,
      sourceSelected: state => state.global.sourceSelected
    }),
    tokenDetail() {
      return getTokenDetail(this.token, this.sourceSelected, this.currency);
    }    
  },
  created() {
    this.address = this.$route.params.key;
    this.init();
  },
  watch: {
    "$route.params.key": function() {
      this.init();
    }
  },
  methods: {
    init() {
      this.getAccountInfo();
      this.activeTab = "extrinsic";
    },
    switch2Vote() {
      this.activeTab = "vote";
    },
    getMyShare(vote, total, digits) {
      return fmtPercentage(vote, total, digits) + "%";
    },
    getTotalBonded(own, nominator) {
      return bnPlus(own, nominator).toString();
    },
    getCommission(perf) {
      return getCommission(perf, this.metadata.commissionAccuracy);
    },
    formatSymbol(module, isValidate) {
      return formatSymbol(module, this.$const, this.sourceSelected, isValidate);
    },
    async getAccountInfo() {
      this.isLoading = true;
      this.isIntroLoading = true;
      const key = this.$route.params.key;
      let loadingInstance = this.$loading({
        target: '.main'
      });
      this.$api["polkaGetAccountDetail"]({ address : key })
        .then(async res => {
          if (res === undefined || typeof res !== "object") {
            return Promise.reject();
          }
          let stakingDetail = res.balances.find(ele => ele.assetId === this.stakingCurrency.id)
          if(stakingDetail === undefined || typeof stakingDetail !== "object"){
             return Promise.reject();
          }
          let spendingDetail = res.balances.find(ele => ele.assetId === this.spendingCurrency?.id)

          this.address = res.address;  
          this.nonce = res.nonce   
          this.stakingDetail = stakingDetail 
          this.spendingDetail = spendingDetail
          this.notFound = false;
          this.isIntroLoading = false;
          this.isbalanceLoading = false;
          loadingInstance.close();
          await Promise.all([
            this.$customizeConfig.hasModule('transfer') ? this.getTransferInfo() : undefined,
            this.getExtrinsicInfo(),
            this.$customizeConfig.hasModule('vote') ? this.getVoteInfo() : undefined
          ])
            .catch(() => {})
            .finally(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          this.notFound = true;
          this.accountInfo = {};
          this.isLoading = false;
          this.isIntroLoading = false;
          loadingInstance.close();
        });
    },
    async getTransferInfo() {
      const data = await this.$api["polkaGetTransfers"]({
        row: 10,
        page: 0,
        address: this.address
      }).catch(() => {
        this.transfersInfo = { count: 0, transfers: [] };
      });
      data.transfers === null && (data.transfers = []);
      this.transfersInfo = data;
    },
    async getVoteInfo() {
      const data = await this.$api["polkaGetVotes"]({
        row: 10,
        page: 0,
        address: this.address
      }).catch(() => {
        this.voteInfo = { count: 0, list: [] };
      });
      data.list === null && (data.list = []);
      data.count = data.list.length;
      data.list = data.list.slice(0, 10);
      this.voteInfo = data;
    },
    async getExtrinsicInfo() {
      const data = await this.$api["polkaGetExtrinsics"]({
        row: 10,
        page: 0,
        address: this.address,
        signed: "all"
      }).catch(() => {
        this.extrinsicsInfo = { count: 0, extrinsics: [] };
      });
      data.extrinsics === null && (data.extrinsics = []);
      data.extrinsics.forEach(item => {
        item.params = JSON.parse(item.params);
      });
      this.extrinsicsInfo = data;
    },
    goTransferOrExtrinsicByAddress() {
      this.$router.push(`/${this.activeTab}?address=${this.address}`);
    },
    clipboardSuccess() {
      this.$message({
        type: "success",
        message: this.$t("copy_success")
      });
    }, 
    tokenDetailNew(currencyId) {
      return getCurrencyTokenDetail(this.token,this.$customizeConfig.getCurrencyById(currencyId).name);
    },
    addAccuracy(amount, currencyId) {
      return accuracyFormat(amount, this.tokenDetailNew(currencyId).accuracy).toString()
    }, 
    getCurrencyName(currencyId){
      return this.$customizeConfig.getCurrencyById(currencyId).name
    }
  }
};
</script>

<style lang="scss" scoped>
#app .account-wrapper {
  .search-input {
    height: 50px;
  }
  .account-header {
    height: 50px;
    .header-left {
      &.mobile {
        display: none;
      }
      .icon {
      }
      .address {
        font-size: 18px;
        font-weight: 600;
        color: #0c0b0c;
        padding: 0 10px;
      }
      .copy-btn {
        font-size: 20px;
        color: var(--main-color-light);
        cursor: pointer;
      }
      .role {
        margin-left: 5px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-weight: bold;
        border-radius: 50%;
        &.nominator {
          border: 1px solid var(--main-color);
          color: var(--main-color);
        }
        &.validator {
          background-color: var(--main-color);
          color: #f8f9fa;
          border-radius: 50%;
        }
      }
    }
    .header-right {
      width: 400px;
      height: 100%;
    }
  }
  .account-info{
    margin-top: 20px;
    display: flex;
    .account-intro{
      flex: 0.8;
      display: flex;
      padding: 25px 16px 0 25px;
      .detail{
        margin-left: 20px;
        .name-wrapper{
          min-height: 6px;
        }
        .address-wrapper{
          margin-top:6px;
          .address{
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
        .contact-wrapper{
          margin-top: 5px;
          margin-bottom: 25px;
          font-size: 18px;
          min-height: 27px;
        }
      }
    }
    .split-line{
      width: 1px;
      margin: 30px 0;
      background-color: var(--link-color);
      opacity: .3;
    }
    .balance{
      padding: 30px 0 30px 30px;
      color: #2a2727;
      width: auto;
      max-width: 300px;
      .label{
        height: 40px;
        .text{
          font-size: 14px;
          font-weight: 600;
        }
        .currency-icon{
          margin-left: 5px;
          width: 20px;
          height: 20px;
          vertical-align: middle;
          
        }
      }
      .value{
        font-size: 14px;
        margin-bottom: 6px;
      }
    }
    .bonded{
      padding: 30px 0 30px 30px;
      color: #2a2727;
      width: auto;
      min-width: 100px;
      .label{
        height: 40px;
        .text{
          font-size: 14px;
          font-weight: 600;
        }
        .currency-icon{
          margin-left: 5px;
          width: 20px;
          height: 20px;
          vertical-align: middle;
          
        }
      }
      .value{
        font-size: 14px;
        margin-bottom: 6px;
      }
    }
    .nounce{
      padding: 30px 0 0 30px;
      color: #2a2727;
      width: 100px;
      .label{
        height: 40px;
        .text{
          font-size: 14px;
          font-weight: 600;
        }
      }
      .value{
        font-size: 14px;
      }
    }
  }
  .transfer-extrinsic-wrapper {
    min-height: 200px;
    margin-top: 20px;
    padding: 10px 20px;
    position: relative;
    .view-all-extrinsic {
      position: absolute;
      top: 20px;
      right: 24px;
      height: 30px;
      line-height: 30px;
      padding: 0 23px;
      cursor: pointer;
      border-radius: 2px;
      border: 1px solid var(--main-color);
      font-size: 14px;
      font-weight: 600;
      color: var(--main-color);
    }
    .link {
      color: var(--link-color);
      span {
        cursor: pointer;
      }
    }
    .icon {
      vertical-align: -0.5em;
      font-size: 26px;
      user-select: none;
    }
    .icon-wrapper {
      width: 26px;
      height: 26px;
      font-size: 26px;
      border-radius: 50%;
      background-color: #f6f4fd;
      color: var(--main-color);
    }
    .expand-form {
      background: #f3f5f9;
      padding: 10px 28px;
      .struct-table-content {
          padding: 20px;
          background-color: #f3f5f9;
          margin: 10px 0;
          // tr:last-child {
          //   .td-border {
          //     border-bottom: 1px solid #e7eaf3;
          //   }
          // }
          // .table {
          //   background-color: #fff;
          //   color: #363636;
          //   width: 100%;
          //   border-collapse: separate;
          //   border: 1px solid #e7eaf3;
          //   border-width: 1px 0 0 1px;
          //   table-layout: fixed;
          // }
          // .td-border {
          //   border: 1px solid #e7eaf3;
          //   border-width: 0 1px 1px 0;
          // }
          // .table-cell {
          //   overflow: hidden;
          //   text-overflow: ellipsis;
          //   white-space: normal;
          //   padding: 0 10px;
          //   line-height: 1.5;
          //   min-height: 21px;
          // }
        }
    }
    .block-log {
      .log-item {
        .label {
        }
        .value {
        }
      }
    }
  }
  .view-all-extrinsic {
    &.mobile {
      display: none;
    }
  }
  .not-found {
    padding: 10%;
    text-align: center;
    .not-found-img {
    }
    .no-data {
      font-size: 14px;
      font-weight: 600;
      color: rgba(152, 149, 159, 1);
    }
  }
  .currency-icon {
    margin-right: 10px;
    img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      transform: translateY(-2px);
    }
  }
  @media screen and (max-width: $screen-xs) {
    .account-header {
      height: inherit;
      flex-direction: column;
      .header-left {
        width: 100%;
        order: 2;
        display: none;
        &.mobile {
          display: flex;
        }
        .copy-btn {
          display: none;
        }
        .address {
          word-break: break-all;
          padding: 0 0 0 10px;
        }
      }
      .search-input-wrapper {
        order: 1;
        max-width: 100%;
        margin: 0 20px 20px;
      }
    }
    .account-info {
      flex-direction: column;
      .account-intro {
        width: auto;
      }
      .detail {
        word-break: break-all;
      }
      .split-line {
        display: none;
      }
      .balance {
        padding-top: 10px;
        padding-bottom: 0;
        width: auto;
      }
      .bonded {
        padding-top: 0;
        padding-bottom: 0;
        width: auto;
      } 
      .nounce {
        padding-bottom: 20px;
        padding-top: 0;
      }
    }
    .transfer-extrinsic-wrapper {
      .view-all-extrinsic {
        display: none;
      }
    }
    .view-all-extrinsic {
      &.mobile {
        display: block;
        height: 35px;
        line-height: 35px;
        margin-top: 12px;
        border-radius: 2px;
        color: var(--main-color);
        background-color: #fff;
        border: 1px solid var(--main-color);
        text-align: center;
        font-size: 14px;
        font-weight: 600;
      }
    }
    .intro {
      flex-direction: column;
      .asset,
      .basic {
        width: inherit;
        .desc {
          padding-right: 0;
        }
      }
      .asset {
        .desc {
          .desc-item {
            .label {
              width: 80px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.asset-dropdown-menu.el-dropdown-menu {
  width: 433px;
  .menu-item {
    text-align: left;
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
.transfer-extrinsic-wrapper {
  .el-tabs {
    .el-tabs__header {
      .el-tabs__nav-wrap {
        height: 50px;
        &::after {
          height: 1px;
          background-color: #e7eaf3;
        }
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            .el-tabs__active-bar {
              height: 4px;
              background-color: var(--main-color);
            }
            .el-tabs__item {
              height: 50px;
              line-height: 50px;
              &.is-active,
              &:hover {
                color: var(--main-color);
              }
            }
          }
        }
      }
    }
    .el-tabs__content {
      .el-table {
        .el-table__header-wrapper {
          th,
          tr {
            box-sizing: border-box;
            height: 44px;
            background: #f3f5f9;
            font-size: 14px;
            font-weight: bold;
            color: #302b3c;
          }
          th {
            padding: 0;
            border: none;
          }
        }
        .el-table__body-wrapper {
          .el-table__body tr:hover > td {
            background: none;
          }
          tr {
            box-sizing: border-box;
            height: 50px;
            font-size: 14px;
            color: #302b3c;
          }
          td {
            padding: 0;
            &.el-table__expand-column {
              .el-table__expand-icon {
                width: 48px;
                height: 26px;
                background: rgba(255, 255, 255, 1);
                border-radius: 4px;
                border: 1px solid rgba(219, 219, 219, 1);
                font-size: 10px;
                text-align: center;
                cursor: pointer;
                user-select: none;
                .el-icon {
                  transition: transform 0.2s ease-in-out;
                }
                &.el-table__expand-icon--expanded {
                  transform: rotate(0);
                  .el-icon {
                    transform: rotate(90deg);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
