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
    >{{`${accuracyAmount}`}} {{this.hasSymbol?this.symbol:''}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import { accuracyFormat } from "../../utils/filters";
  import { getCurrencyTokenDetail } from "../../utils/tools";
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
      hasSymbol: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        symbol: '',
        icon: ''
      }
    },
    computed: {
      ...mapState({
        token: state => state.polka.token
      }),
      accuracyAmount: function(){return this.amountFormat(this.currencyId)}
    },
    methods: {
      amountFormat(currency_id) {
        const curDetail = this.$customizeConfig.getCurrencyById(currency_id)
        if(typeof curDetail !== 'undefined'){
          const accuracy = getCurrencyTokenDetail(this.token, curDetail.name)?.accuracy
          this.symbol = curDetail.name
          this.icon = curDetail.icon
          return accuracyFormat(this.amount, typeof accuracy === 'undefined'? 0: accuracy)
        }else {
          return this.amount
        }
      }
     }
  };
</script>

<style lang="scss" scoped>
  .currency-icon {
    margin-right: 10px;
    img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      transform: translateY(-2px);
    }
  }
  .currency-num {
    word-break: break-all;
  }
</style>
