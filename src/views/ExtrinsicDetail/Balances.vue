<template>
  <div class="align-items-center">
    <div class="currency-icon" v-if="hasImg">
      <img
        :src="icon"
        :alt="symbol"
      />
    </div>
    <div
      class="currency-num"
    >{{`${amount} ${symbol}`}}
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

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
      module: {
        type: String,
        default: 'balances'
      },
      currencyType: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapState({
        sourceSelected: state => state.global.sourceSelected
      }),
      symbol: function() {return this.formatSource(this.module, 'value')},
      icon:  function() {return this.formatSource(this.module, 'icon')},
    },
    methods: {
      formatSource(module, type) {
        let curDetail = this.$customizeConfig.getCurrencyByType( this.currencyType)
        if(typeof curDetail !== 'undefined'){
            if(type === 'icon'){
              return curDetail.icon
            }
            if(type === 'value'){
              return curDetail.name
            }
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
</style>
