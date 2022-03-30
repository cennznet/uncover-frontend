<template>
  <div class="account-wrapper subscan-content">
    <div class="container">
      <template v-if="notFound">
        <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
        <div class="not-found">
          <img class="not-found-img" src="./../../assets/images/404.png" alt="404" />
          <div class="no-data">{{$t('no_data')}}</div>
        </div>
      </template>
      <template v-else>
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{$t('top_holders', {number: (total).toLocaleString('en-US'), total: (allAccounts).toLocaleString('en-US')})}}</div>
        </div>
      </div>
      <div class="account-table subscan-card" v-loading="isLoading">
        <el-table @sort-change="handleSortChange" :data="accountsData" :default-sort = "{prop: 'free', order: 'descending'}" style="width: 100%" fit>
          <el-table-column min-width="470" prop="address" :label="$t('account')">
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.address"
                  placement="top-start"
                >
                  <router-link :to="`/account/${scope.row.address}`">{{scope.row.address}}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="this.isStakingCurr" sortable="custom" min-width="150" prop="lockBalance" :label="$t('balance_lock')" >
            <template slot="header">
              {{`${$t('bonded_currency',
              {token: this.token.symbol})}`}}
              <img
                class="currency-icon"
                :src="this.token.icon"
                :alt="this.token.symbol"
              />
            </template>
            <template slot-scope="scope" v-if="scope.row.lock">
              <balances
                :amount="scope.row.lock"
                :symbol="token.symbol"
                :showSymbol="false"
                :currencyId="token.id" :hasImg="false"
              ></balances>
           </template>
          </el-table-column>
          <el-table-column sortable="custom" min-width="150" prop="free" :label="$t('balance')">
            <template slot="header">
              {{`${$t('balance_currency',
              {token: this.token.symbol})}`}}
              <img
                class="currency-icon"
                :src="this.token.icon"
                :alt="this.token.symbol"
              />
            </template>
            <template slot-scope="scope">
              <balances
                :amount="scope.row.balance"
                :showSymbol="false"
                :symbol="token.symbol"
                :currencyId="token.id" :hasImg="false"
              ></balances>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-bottom space-between align-items-center">
        <div class="download">
          <csv-download @downloadClick="downloadClick" />
        </div>
        <pagination :page-size="1" :total="total" @currentChange="currentChange" />
      </div>
    </template>
    </div>
  </div>
</template>
<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import Balances from "../ExtrinsicDetail/Balances";
export default {
  name: "Asset",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Balances
  },
  data() {
    return {
      token: {},
      inputParam: '',
      assets_data:[],
      isLoading: false,
      tokenList: {},
      stakingToken: {},
      accountsData: [],
      total: 0,
      allAccounts: 0,
      currentPage: 0,
      currentOrder: 'desc',
      currentOrderField: 'free',
      notFound: false,
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
      ]
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.polka.accounts,
      sourceSelected: state => state.global.sourceSelected,
      tokens: state => state.polka.tokenV2,
    }),
    isStakingCurr() {
      return this.token?.id === this.stakingToken?.id
    }
  },
  watch:{
    "$route.params.key": function() {
      this.pathRouter();
    }
  },
  created() {
    this.pathRouter();
  },

  methods: {
    init() {
      if (this.accounts && this.accounts.length > 0) {
        this.accountsData = this.accounts;
      } else {
        this.isLoading = true;
      }
      this.getTokenData();
      this.getStakingToken();
      this.getAccountData();
    },
    async getAccountData(page = 0) {
      const data = await this.$api["polkaGetAccounts"]({
        currencyId: this.token?.id,
        row: 25,
        page,
        order: this.currentOrder,
        order_field: this.currentOrderField
      });
      this.accountsData = data.list || [];
      this.total = Math.min(1000, +data.count);
      this.allAccounts = +data.count;
      this.isLoading = false;
      if (page == 0) {
        this.$store.commit("SET_ACCOUNTS", data.list);
      }
    },
    async getTokenData() {
      const data = await this.$api["polkaGetTokenV2"]();
      this.tokenList = data.detail;
    },
    async getStakingToken() {
      const data = await this.$api["polkaGetStakingToken"]();
      this.stakingToken = data;
    },
    setToken() {
      if (this.tokenList) {
        this.token = '';
        const tokenValues = Object.values(this.tokenList);
        const valueAt = tokenValues.findIndex(value => value.id.toString() === this.inputParam || value.symbol === this.inputParam);
        const assetInfo = tokenValues[valueAt];
        assetInfo.icon = `/images/${assetInfo.symbol}.svg`
        this.token = assetInfo;
      }
    },
    async pathRouter(){
      var numReg = /^\d+$/
      var numRe = new RegExp(numReg)
      this.inputParam = this.$route.params.key
      this.notFound = false
      await this.getTokenData()
      this.setToken();

      if(!this.token){
          this.notFound = true
      }else if(numRe.test(this.inputParam)) {
        this.$router.push(`/asset/${this.token.symbol}`)
      }else{
        this.init()
      }

    },
    downloadClick() {
      const tableData = [
        [
          this.$t('account'),
          this.$t('bonded_currency', {currency: this.getCurrencyLowerCase('balances')}),
          this.$t('bonded_currency', {currency: this.getCurrencyLowerCase('kton')}),
          this.$t('balance_currency', {currency: this.getCurrencyLowerCase('balances')}),
          this.$t('balance_currency', {currency: this.getCurrencyLowerCase('kton')})
        ]
      ];
      this.accountsData.forEach(item => {
        let arr = [
          item.address,
          item.ring_lock,
          item.kton_lock,
          item.balance,
          item.kton_balance
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `account-${this.accountsData[this.accountsData.length - 1].address}-${this.accountsData[0].address}.csv`
      );
    },
    currentChange(pageSize) {
      this.currentPage = --pageSize
      this.getAccountData(this.currentPage);
    },
    handleSortChange(change) {
      this.currentOrderField = change.prop || '';
      switch(change.order) {
        case 'descending':
          this.currentOrder = 'desc';
          break;
        case 'ascending':
          this.currentOrder = 'asc';
          break;
        default:
          this.currentOrder = '';
          break;
      }
      this.getAccountData(this.currentPage);
    }
  }

};
</script>
<style lang="scss" scoped>
.account-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .table-top {
      margin-top: 20px;
      .for-block {
        font-size: 14px;
        font-weight: bold;
        color: rgba(48, 43, 60, 1);
        .icon {
          padding-left: 10px;
          transform: translateY(2px);
        }
        .link {
          padding: 0 10px;
          color: var(--main-color);
          cursor: pointer;
        }
        .all {
          padding: 0 10px;
        }
      }
    }
    .account-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
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
      .detail-btn {
        width: 48px;
        height: 26px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(219, 219, 219, 1);
        font-size: 10px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
      .currency-icon {
        width: 44px;
        height: 24px;
        vertical-align: -5px;
      }
    }
    .table-bottom {
      margin-top: 20px;
      .download {
        width: 196px;
        height: 30px;
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
  }
  @media screen and (max-width:$screen-xs) {
    .container {
      .table-top {
        margin-top: 0;
        .for-block {
          .link {
            max-width: 250px;
            word-break: break-all;
          }
        }
      }
      .table-bottom {
        flex-direction: column;
        .pagination-component {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.account-wrapper {
  .signed-checkbox {
    .el-checkbox {
      .el-checkbox__input {
        .el-checkbox__inner {
          width: 22px;
          height: 22px;
          background-color: #fff;
          border-color: #dbdbdb;
          &::after {
            border-color: #000;
            border-width: 2px;
            height: 10px;
            left: 7px;
            top: 2px;
            width: 5px;
          }
        }
      }
      .el-checkbox__label {
        font-size: 14px;
        font-weight: bold;
        color: rgba(48, 43, 60, 1);
      }
    }
  }
  .account-table {
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
        }
      }
    }
  }
}
</style>
