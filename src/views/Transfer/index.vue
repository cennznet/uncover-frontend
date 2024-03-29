<template>
  <div class="transfer-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <div v-if="this.$customizeConfig.hasModule('transfer').chart" class="chart-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{$t('transfer_history')}}</div>
        </div>
      </div>
      <chartBar v-if="this.$customizeConfig.hasModule('transfer').chart" class="chart-component" />
      <div class="table-top space-between align-items-center">
        <div class="for-block align-items-center">
          <div>{{$t('for')}}</div>
          <template v-if="$route.query.address">
            <div class="icon">
              <identicon :size="30" theme="polkadot" :value="$route.query.address" />
            </div>
            <router-link
              class="link"
              :to="`/account/${$route.query.address}`"
            >{{$route.query.address}}</router-link>
          </template>
          <div v-else class="all">{{$t('all')}}</div>
          <div>{{`(${total})`}}</div>
        </div>
        <div>
            <el-select v-model="tokenId"  placeholder="currency filter" @change="getData">
              <el-option key="-1" label="all" :value="-1"></el-option>
               <el-option v-for="(item) in Object.values(tokenDetails)"
                :key="item.id" :label="item.symbol+ -item.id" :value="item.id">
                </el-option>
            </el-select>
          </div>
      </div>
      <div class="transfer-table subscan-card" v-loading="isLoading">
        <el-table :data="transfersData" style="width: 100%">
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
          <el-table-column min-width="150" prop="block_timestamp" :label="$t('age')">
            <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
          </el-table-column>
          <el-table-column min-width="150" prop="from" :label="$t('from')">
            <template slot-scope="scope">
              <div :class="scope.row.from === $route.query.address ? 'defaul-cursor' : 'link'">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.from"
                  placement="top-start"
                >
                  <router-link
                    :to="scope.row.from === $route.query.address ? `${$route.fullPath}` : `/account/${scope.row.from}`"
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
              <div :class="scope.row.to === $route.query.address ? 'defaul-cursor' : 'link'">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.to"
                  placement="top-start"
                >
                  <router-link
                    :to="scope.row.to === $route.query.address ? `${$route.fullPath}` : `/account/${scope.row.to}`"
                  >{{scope.row.to|hashFormat}}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="120" prop="amount" :label="$t('value')" fit>
            <template slot-scope="scope">
              <balances
                :amount="scope.row.amount"
                :currencyId="scope.row.asset_id" :hasImg="false"
              ></balances>
            </template>
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
                  <router-link :to="`/extrinsic/${scope.row.hash}`">{{scope.row.hash|hashFormat}}</router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-bottom space-between align-items-center">
        <div class="download">
          <csv-download @downloadClick="downloadClick" />
        </div>
        <pagination :page-size="25" :total="total" @currentChange="currentChange" />
      </div>
    </div>
  </div>
</template>
<script>
import Identicon from "@polkadot/vue-identicon";
import XLSX from "xlsx";
import moment from "moment";
import ChartBar from "./chartBar";
import { mapState } from "vuex";
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat } from "Utils/filters";
import Balances from "../ExtrinsicDetail/Balances";
export default {
  name: "Transfer",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Identicon,
    ChartBar,
    Balances
  },
  data() {
    return {
      isLoading: false,
      transfersData: [],
      tokenDetails: {},
      total: 0,
      tokenId: -1,
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
      transfers: state => state.polka.transfers,
      sourceSelected: state => state.global.sourceSelected,
      token: state => state.polka.tokenV2
    })
  },
  filters: {
    timeAgo,
    hashFormat
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.transfers && this.transfers.length > 0) {
        this.transfersData = this.transfers;
      } else {
        this.isLoading = true;
      }
      this.getData();
    },
    async getData() {
      await Promise.all([this.getTransferData()]);
    },
    async getTransferData(page = 0) {
      let tokenInfo = await this.$api["polkaGetTokenV2"]();
      this.tokenDetails = tokenInfo?.detail;
      const data = await this.$api["polkaGetTransfers"]({
        row: 25,
        page,
        address: this.$route.query.address,
        currencyId: this.tokenId === -1? undefined: parseInt(this.tokenId)
      });
      this.transfersData = data.transfers || [];
      this.total = +data.count;
      this.isLoading = false;
      if (page == 0) {
        this.$store.commit("SET_TRANSFERS", data.transfers);
      }
    },
    downloadClick() {
      const tableData = [
        [
          this.$t("extrinsic_id"),
          this.$t("block"),
          this.$t("block_timestamp"),
          this.$t("from"),
          this.$t("to"),
          this.$t("value"),
          this.$t("result"),
          this.$t("hash")
        ]
      ];
      this.transfersData.forEach(item => {
        let arr = [
          item.extrinsic_index,
          item.block_num,
          moment(item.block_timestamp * 1000).format(),
          item.from,
          item.to,
          item.amount,
          item.success,
          item.hash
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `transfer-${this.transfersData[this.transfersData.length - 1].extrinsic_index}-${this.transfersData[0].extrinsic_index}.csv`
      );
    },
    currentChange(pageSize) {
      this.getTransferData(--pageSize);
    }
  }
};
</script>
<style lang="scss" scoped>
.transfer-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .table-top {
      margin-top: 20px;
      .for-block {
        font-size: 14px;
        font-weight: bold;
        color: #302b3c;
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
    .chart-top {
      margin: 20px 0 10px;
      font-size: 14px;
      font-weight: bold;
      color: #302b3c;
    }
    .chart-component {
      height: 155px;
    }
    .transfer-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .defaul-cursor {
        a {
          cursor: auto;
        }
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
        background-color: var(--main-color-white);
        color: var(--main-color);
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
    }
    .table-bottom {
      margin-top: 20px;
      .download {
        width: 196px;
        height: 30px;
      }
    }
  }
  @media screen and (max-width: $screen-xs) {
    .container {
      .chart-top {
        margin-top: 0;
      }
      .table-top {
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
.transfer-wrapper {
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
  .transfer-table {
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
