<template>
  <div class="chart-wrapper">
    <div class="header-content space-between">
      <div class="header-left align-items-center">
        <icon-svg class="icon" icon-class="chart" />
        <span class="title">{{chartName}}</span>
      </div>
    </div>
    <div class="chart-content subscan-card" ref="chart"></div>
  </div>
</template>

<script>
let myChart;
import { mapState } from "vuex";
import {
  fmtNumber,
  fmtPercentage,
  bnMinus,
  bnPlus,
  bnShift
} from "../../utils/format";
//import ring from "../../assets/images/ring@2x.png";
//import kton from "../../assets/images/ksm@2x.png";
//import kusama from "../../assets/images/ksm@2x.png";
//import edgeware from "../../assets/images/edgeware.png";
//import switchIcon from "../../assets/images/switch-purple.png";

// import lIconBlack from "../../assets/images/l-black.png";
// import tIconBlack from "../../assets/images/t-black.png";
// import lIconPurple from "../../assets/images/l-purple.png";
// import tIconPurple from "../../assets/images/t-purple.png";
// import lIconPink from "../../assets/images/l-pink.png";
// import tIconPink from "../../assets/images/t-pink.png";
// import oIcon from "../../assets/images/o.png";
import { getTokenDetailFromId } from "../../utils/tools";

export default {
  computed: {
    ...mapState({
      sourceSelected: state => state.global.sourceSelected,
      tokens: state => state.polka.tokenV2
    }),
    tokenDetail() {
      if (this.token.symbol) {
        return getTokenDetailFromId(
          this.tokens,
          this.token.id
        );
      }
      return {};
    },
    chartName() {
      let name = this.token.symbol;
      return name;
    },
    iconImg() {
      let icon = `/images/${this.token.symbol}.svg`
      return icon;
    },
    isSwitch(){
      return true;
    }
  },
  data() {
    return {
      token: {},
      // colorMap: {
      //   icefrog: {
      //     mainColor: "#5930dd",
      //     colors: ["#5930dd", "#a995eb", "#d7d7d7"],
      //     bIcon: lIconPurple,
      //     tIcon: tIconPurple,
      //     oIcon: oIcon
      //   },
      //   kusama: {
      //     mainColor: "#e90979",
      //     colors: ["#e90979", "#ffaccb", "#d7d7d7"],
      //     bIcon: lIconPink,
      //     tIcon: tIconPink,
      //     oIcon: oIcon
      //   },
      //   polkadot: {
      //     mainColor: "#e90979",
      //     colors: ["#e90979", "#ffaccb", "#d7d7d7"],
      //     bIcon: lIconPink,
      //     tIcon: tIconPink,
      //     oIcon: oIcon
      //   },
      //   edgeware: {
      //     mainColor: "#000000",
      //     colors: ["#000000", "#a6a6a6", "#d7d7d7"],
      //     bIcon: lIconBlack,
      //     tIcon: tIconBlack,
      //     oIcon: oIcon
      //   }
      // }
    };
  },
  created() {
    this.init()
    GLOBAL.vbus.$on("CHANGE_SOURCE",  function() {
      myChart.setOption({
        series: {
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: this.getColorStop()
            }
          },
          lineStyle: {
            width: 1,
            color: this.$customizeConfig.selected.pieColor.mainColor
          }
        }
      });
    });
  },
  beforeDestroy() {
    myChart = null;
    GLOBAL.vbus.$off("CHANGE_SOURCE");
    this.$loop.removeLoop("token");
  },
  watch: {
    tokenDetail(newV) {
      let others = bnMinus(
        newV.totalIssuance,
        bnPlus(newV.locked_balance, newV.available_balance)
      );
      const data = [
        {
          name: this.$t("locked"),
          formatVal: newV.accuracy ? fmtNumber(
            bnShift(newV.locked_balance, -(newV.accuracy + 3)),
            0
          ) : 0,
          value: fmtPercentage(newV.locked_balance, newV.totalIssuance, 1)
        },
        {
          name: this.$t("transferrable"),
          formatVal: newV.accuracy ? fmtNumber(
            bnShift(newV.available_balance, -(newV.accuracy + 3)),
            0
          ) : 0,
          value: fmtPercentage(newV.available_balance, newV.totalIssuance, 1)
        },
        {
          name: this.$t("others"),
          formatVal: newV.accuracy ? fmtNumber(bnShift(others, -(newV.accuracy + 3)), 0) : 0,
          value: fmtPercentage(others, newV.totalIssuance, 1)
        }
      ];
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  // width: 190,
                  // height: 90,
                  // cx: 95,
                  // cy: 77,
                  r: 25
                },
                style: {
                  fill: "#fff",
                  // stroke: '#555',
                  lineWidth: 2,
                  shadowBlur: 4,
                  // shadowOffsetX: 3,
                  // shadowOffsetY: 3,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          }
        ],
        legend: {
          orient: "vertical",
          left: "47%",
          top: "10%",
          align: "left",
          itemGap: 28,
          data: this.getXAxisData(),
          tooltip: {
            show: true
          },
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: "#302b3c",
            fontWeight: "bold",
            fontSize: 13,
          },
          formatter(name) {
            let result = "";
            data.forEach(function(val) {
              if (val.name === name) {
                result = val.formatVal + "K（" + val.value + "%）";
              }
            });
            return result;
          }
        },
        series: {
          data
        }
      });
    },
    currency() {
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  r: 25
                },
                style: {
                  fill: "#fff",
                  lineWidth: 2,
                  shadowBlur: 4,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          }
        ]
      });
    }
  },
  mounted() {
    this.getStakingToken();
    this.initChart();
  },
  methods: {
    async init() {
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
        this.$store.dispatch("SetTokenV2")
      ]);
    },
    async getStakingToken() {
      this.$api["polkaGetStakingToken"]().then(async data => {
        this.token = data;
      })
    },
    initChart() {
      let newV = this.tokenDetail;
      if (newV === {}) return;
      let others = bnMinus(
        newV.totalIssuance,
        bnPlus(newV.locked_balance, newV.available_balance)
      );
      let data = [];
      if (newV.totalIssuance) {
        data = [
          {
            name: this.$t("locked"),
            formatVal: fmtNumber(
              bnShift(newV.locked_balance, -(newV.accuracy + 3)),
              0
            ),
            value:
              fmtPercentage(newV.locked_balance, newV.totalIssuance, 1) || 0
          },
          {
            name: this.$t("transferrable"),
            formatVal: fmtNumber(
              bnShift(newV.available_balance, -(newV.accuracy + 3)),
              0
            ),
            value:
              fmtPercentage(newV.available_balance, newV.totalIssuance, 1) || 0
          },
          {
            name: this.$t("others"),
            formatVal: fmtNumber(bnShift(others, -(newV.accuracy + 3)), 0),
            value: fmtPercentage(others, newV.totalIssuance, 1) || 0
          }
        ];
      }
      myChart = window.echarts.init(this.$refs.chart);
      myChart.setOption({
        graphic: [
          {
            type: "group",
            left: "18%",
            top: "center",
            children: [
              {
                type: "circle",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                shape: {
                  // width: 190,
                  // height: 90,
                  // cx: 95,
                  // cy: 77,
                  r: 25
                },
                style: {
                  fill: "#fff",
                  // stroke: '#555',
                  lineWidth: 2,
                  shadowBlur: 4,
                  // shadowOffsetX: 3,
                  // shadowOffsetY: 3,
                  shadowColor: "rgba(0,0,0,0.2)"
                }
              },
              {
                type: "image",
                id: "logos",
                z: 100,
                left: "center",
                top: "middle",
                cursor: "default",
                bounding: "raw",
                style: {
                  image: this.iconImg,
                  width: 35,
                  height: 35
                }
              }
            ]
          }
        ],
        tooltip: {
          trigger: "item",
          backgroundColor: "#ffffff",
          borderColor: "#e7eaf3",
          borderWidth: 1,
          padding: [5, 20],
          textStyle: {
            color: "#302b3c"
          },
          formatter: `{b}`
        },
        legend: {
          orient: "vertical",
          left: "47%",
          top: "10%",
          align: "left",
          itemGap: 28,
          icon: "circle",
          data: this.getXAxisData(),
          tooltip: {
            show: true
          },
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: "#302b3c",
            fontWeight: "bold",
            fontSize: 13,
          },
          formatter(name) {
            let result = "";
            data.forEach(function(val) {
              if (val.name === name) {
                result = val.formatVal + "K（" + val.value + "%）";
              }
            });
            return result;
          }
        },
        series: [
          {
            type: "pie",
            data: data,
            radius: ["70%", "85%"],
            center: ["25%", "50%"],
            avoidLabelOverlap: false,
            legendHoverLink: false,
            hoverAnimation: false,
            color: this.$customizeConfig.selected.pieColor.colors,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ]
      });
      myChart.on("legendselectchanged", function(params) {
        const option = this.getOption();
        const selectedLegends = params.selected;
        const keys = Object.keys(selectedLegends);
        keys.forEach(key => {
          option.legend[0].selected[key] = true;
        })
        this.setOption(option);
      });
    },
    getXAxisData() {
      return [
        {
          name: this.$t("locked"),
          icon: "image://" + this.$customizeConfig.selected.pieColor.bIcon
        },
        {
          name: this.$t("transferrable"),
          icon: "image://" + this.$customizeConfig.selected.pieColor.tIcon
        },
        {
          name: this.$t("others"),
          icon: "image://" + this.$customizeConfig.selected.pieColor.oIcon
        }
      ];
    },
    getColorStop() {
      let sourceColor = this.$customizeConfig.selected.pieColor.mainColor;
      return [
        {
          offset: 0,
          color: sourceColor + "99" // 透明度60%
        },
        {
          offset: 0.6,
          color: sourceColor + "4D" // 透明度30%
        },
        {
          offset: 0.8,
          color: sourceColor + "33" // 透明度20%
        },
        {
          offset: 1,
          color: sourceColor + "1A" // 透明度10%
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  .header-content {
    display: none;
  }
  .chart-content {
    height: 100%;
  }
  @media screen and (max-width: $screen-xs) {
    .header-content {
      display: block;
      margin-bottom: 10px;
      .header-left {
        height: 30px;
        .icon {
          font-size: 30px;
        }
        .title {
          padding-left: 8px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(48, 43, 60, 1);
        }
      }
    }
    .chart-content {
      height: 156px;
    }
  }
}
</style>
