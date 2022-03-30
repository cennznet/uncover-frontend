<template>
  <div class="align-items-center">
    <div class="currency-icon" v-if="hasImg">
      <img
        :src="this.icon"
        :alt="this.symbol"
      />
    </div>
    <div
      class="currency-num"
    >{{`${numberWithCommas(accuracyAmount)}`}} {{this.showSymbol?this.symbol:''}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import { accuracyFormat } from "../../utils/filters";
  import {getTokenDetailFromId} from "../../utils/tools";
  export default {
    props: {
      amount: {
        type: String,
        default: "0"
      },
      hasImg: {
        type: Boolean,
        default: true
      },
      currencyId: {
        type: [Number,String],
        default: -1
      },
      showSymbol: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        icon: '',
        symbol: ''
      }
    },
    computed: {
      ...mapState({
        token: state => state.polka.tokenV2
      }),
      accuracyAmount: function(){return this.amountFormat(this.currencyId)}
    },
    mounted() {
      this.setToken();
    },
    methods: {
      amountFormat(tokenId) {
        const tokenDetail = getTokenDetailFromId(this.token, tokenId);
        const accuracy = tokenDetail?.accuracy;
        const iconImage = tokenDetail?.symbol;
        this.symbol = tokenDetail?.symbol;
        this.icon = `/images/${iconImage}.svg`
        return accuracyFormat(this.amount, typeof accuracy === 'undefined'? 0: accuracy)
      },
     numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
     },
     async setToken() {
      await Promise.all([
        this.$store.dispatch("SetTokenV2")
      ]);
     },
    }
  };
</script>

<style lang="scss" scoped>
  .currency-icon {
    margin-right: 10px;
    img {
      width: 40px;
      height: 24px;
      vertical-align: middle;
      transform: translateY(-2px);
    }
  }
  .currency-num {
    word-break: break-all;
  }
</style>
