<template>
  <div class="extrinsic-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
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
          <template v-else-if="$route.query.block">
            <router-link
              class="link"
              :to="`/block/${$route.query.block}`"
            >{{` Block#${$route.query.block} `}}</router-link>
          </template>
          <div v-else class="all">{{$t('all')}}</div>
          <div>{{`(${total})`}}</div>
        </div>
        <div class="signed-checkbox">
          <el-checkbox v-model="signedChecked" @change="signedChange">{{$t('signed_only')}}</el-checkbox>
        </div>
      </div>
      <div class="extrinsic-table subscan-card" v-loading="isLoading">
        <el-table :data="extrinsicsData" style="width: 100%">
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
          <el-table-column min-width="140" prop="extrinsic_hash" :label="$t('extrinsic_hash')" fit>
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
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat, parseTimeToUtc } from "Utils/filters";
import TreeItem from "../ExtrinsicDetail/TreeItem";
import { fetchAccurateBalanceFromParams } from "../../utils/tools";
export default {
  name: "Extrinsic",
  components: {
    SearchInput,
    CsvDownload,
    Pagination,
    Identicon,
    TreeItem
  },
  data() {
    return {
      erc20META: {},
      isLoading: false,
      extrinsicsData: [],
      currentPage: 0,
      total: 0,
      signedChecked: true,
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
  filters: {
    timeAgo,
    hashFormat,
    parseTimeToUtc
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      this.getExtrinsicData();
    },
    async getExtrinsicData(page = 0) {
      this.isLoading = true;
      let data;
      if (this.$route.query.block) {
        const promiseOne = this.$api["polkaGetBlockByKey"]({
                                     block_num: +this.$route.query.block
                                   });
        const promiseTwo = this.$api["polkaGetERC20Meta"]();
        const promiseThree = this.$api["polkaGetTokenV2"]();
        const [extData, erc20Data, tokenData] = await Promise.all([promiseOne, promiseTwo, promiseThree]);
        data = extData;
        this.erc20META = erc20Data.erc20tokenMap;
        data.extrinsics.forEach(item => {
          item.params = JSON.parse(item.params);
          item.params = fetchAccurateBalanceFromParams(tokenData, this.erc20META, item.params);
        });
        this.extrinsicsData = data.extrinsics;
        this.total = data.extrinsics_count;
        this.isLoading = false;
      } else {
        let ops = {
          row: 25,
          page,
          signed: this.signedChecked ? "signed" : "all",
          address: this.$route.query.address
        };
        if (this.$route.query.address) {
          ops.signed = "all";
        }
        const promiseOne = this.$api["polkaGetExtrinsics"](ops);
        const promiseTwo = this.$api["polkaGetERC20Meta"]();
        const promiseThree = this.$api["polkaGetTokenV2"]();
        const [extData, erc20Data, tokenData] = await  Promise.all([promiseOne, promiseTwo, promiseThree]);
        data = extData;
        this.erc20META = erc20Data.erc20tokenMap;

        data = await this.$api["polkaGetExtrinsics"](ops);
        data.extrinsics.forEach(item => {
          item.params = JSON.parse(item.params);
          item.params = fetchAccurateBalanceFromParams(tokenData, this.erc20META, item.params);
        });
        this.extrinsicsData = data.extrinsics;
        this.total = +data.count;
        this.isLoading = false;
      }
    },
    downloadClick() {
      const tableData = [
        [
          this.$t("extrinsic_id"),
          this.$t("block"),
          this.$t("extrinsic_hash"),
          this.$t("block_timestamp"),
          this.$t("result"),
          this.$t("action")
        ]
      ];
      this.extrinsicsData.forEach(item => {
        let arr = [
          item.extrinsic_index,
          item.block_num,
          item.extrinsic_hash,
          moment(item.block_timestamp * 1000).format(),
          item.success,
          `${item.call_module}(${item.call_module_function})`
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `extrinsic-${this.extrinsicsData[this.extrinsicsData.length - 1].extrinsic_index}-${this.extrinsicsData[0].extrinsic_index}.csv`
      );
    },
    currentChange(pageSize) {
      this.getExtrinsicData(--pageSize);
      this.currentPage = pageSize;
    },
    signedChange() {
      this.getExtrinsicData(this.currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
#app .extrinsic-wrapper {
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
    .extrinsic-table {
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
          //   padding: 10px 10px;
          //   line-height: 1.5;
          //   min-height: 21px;
          // }
        }
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
      .table-top {
        margin-top: 0;
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
.extrinsic-wrapper {
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
  .extrinsic-table {
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
</style>
