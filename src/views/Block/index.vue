<template>
  <div class="block-wrapper subscan-content">
    <div class="container">
      <search-input
        class="search-input"
        :selectList="selectList"
        :placeholder="$t('placeholder.search_by')"
      />
      <div class="block-table subscan-card" v-loading="isLoading">
        <el-table :data="blockData" style="width: 100%">
          <el-table-column min-width="120" prop="block_num" :label="$t('block')">
            <template slot-scope="scope">
              <div class="link">
                <router-link :to="`/block/${scope.row.block_num}`">{{scope.row.block_num}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="70" prop="success" :label="$t('status')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.finalized ? $t('finalized') : $t('unfinalized')" placement="top-start">
                <icon-svg class="icon finalize" :icon-class="scope.row.finalized ? 'success' : 'pending'" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="block_timestamp" :label="$t('age')">
            <template slot-scope="scope">{{scope.row.block_timestamp|timeAgo}}</template>
          </el-table-column>
          <el-table-column min-width="90" prop="extrinsics_count" :label="$t('extrinsics')">
            <template slot-scope="scope">
              <div :class="{link:scope.row.extrinsics_count>0}">
                <router-link
                  :to="scope.row.extrinsics_count > 0 ? `/block/${scope.row.block_num}?detail_type=extrinsic` : `${$route.fullPath}`"
                >{{scope.row.extrinsics_count}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="70" prop="event_count" :label="$t('events')">
            <template slot-scope="scope">
              <div :class="{link:scope.row.event_count>0}">
                <router-link
                  :to="scope.row.event_count > 0 ? `/block/${scope.row.block_num}?detail_type=event` : `${$route.fullPath}`"
                >{{scope.row.event_count}}</router-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="validator" :label="$t('validator')" fit>
            <template slot-scope="scope">
              <div class="link" >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.validator"
                  placement="top-start"
                >
                  <router-link v-if="isShowValidatorHref()" :to="`/validator/${scope.row.validator}`"
                  >{{scope.row.validator_name 
                  | getValidator(scope.row.validator_index_ids, scope.row.validator) 
                  | hashFormat}}
                  </router-link>
                  <router-link v-else :to="`/account/${scope.row.validator}`"
                  >{{scope.row.validator_name 
                  | getValidator(scope.row.validator_index_ids, scope.row.validator) 
                  | hashFormat}}
                  </router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="hash" :label="$t('block_hash')" fit>
            <template slot-scope="scope">
              <div class="link">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="scope.row.hash"
                  placement="top-end"
                >
                  <router-link :to="`/block/${scope.row.hash}`">{{scope.row.hash|hashFormat}}</router-link>
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
import XLSX from "xlsx";
import moment from "moment";
import { mapState } from "vuex";
import SearchInput from "@/views/Components/SearchInput";
import CsvDownload from "Components/CsvDownload";
import Pagination from "Components/Pagination";
import { timeAgo, hashFormat } from "Utils/filters";
export default {
  name: "Block",
  components: {
    SearchInput,
    CsvDownload,
    Pagination
  },
  data() {
    return {
      isLoading: false,
      blockData: [],
      total: 0,
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
      latestBlocks: state => state.polka.latestBlocks
    })
  },
  filters: {
    timeAgo,
    hashFormat,
    getValidator: function(nickname, index, stash) {
      return nickname || index || stash;
    }
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      if (this.latestBlocks.length > 0) {
        this.blockData = this.latestBlocks;
      } else {
        this.isLoading = true;
      }
      this.getBlockData();
    },
    async getBlockData(page = 0) {
      const data = await this.$api["polkaGetBlocks"]({ row: 25, page });
      this.blockData = data.blocks;
      this.total = +data.count;
      if (page == 0) {
        this.$store.commit("SET_LATEST_BLOCKS", data.blocks);
      }
      this.isLoading = false;
    },
    downloadClick() {
      const tableData = [
        [
          this.$t("block"),
          this.$t("block_timestamp"),
          this.$t("extrinsics"),
          this.$t("events"),
          this.$t("validator"),
          this.$t("block_hash")
        ]
      ];
      this.blockData.forEach(item => {
        let arr = [
          item.block_num,
          moment(item.block_timestamp * 1000).format(),
          item.extrinsics_count,
          item.event_count,
          item.validator,
          item.hash
        ];
        tableData.push(arr);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(tableData);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, "SheetJS");
      XLSX.writeFile(
        new_workbook,
        `block-${this.blockData[this.blockData.length - 1].block_num}-${
          this.blockData[0].block_num
        }.csv`
      );
    },
    currentChange(pageSize) {
      this.isLoading = true;
      this.getBlockData(--pageSize);
    },
    isShowValidatorHref(){
      return this.$customizeConfig.hasModule('staking')
    }
  }
};
</script>
<style lang="scss" scoped>
.block-wrapper {
  .container {
    .search-input {
      height: 50px;
    }
    .block-table {
      min-height: 120px;
      margin-top: 10px;
      padding: 13px 20px;
      .link {
        color: var(--link-color);
        span {
          cursor: pointer;
        }
      }
      .finalize {
        font-size: 26px;
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
.block-wrapper {
  .block-table {
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
