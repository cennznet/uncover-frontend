<template>
    <div :data="treeList" v-if="isObjOrArray(treeList)" class="struct-table">
        <div :class="`struct-table-content ${isFirst?'':'is-inner'}`">
            <table class="table">
                <tr v-for="(item, index) in treeList" :key="index">
                    <td v-if ="checkAttr(item)" class="td-border" :width="`${isFirst? '15%': '20%'}`">
                        <div v-if="treeType === 'extrinsic'" class ="table-cell">{{item.name}}</div>
                        <div v-else-if="treeType === 'event'" class ="table-cell">{{item.type}}</div>
                    </td>
                    <td v-else class="td-border" width="20%">
                        <div class ="table-cell">{{index}}</div>
                    </td>
                    <td v-if ="checkAttr(item)" class="struct-cell-wrapper">
                        <div v-if="treeType === 'extrinsic'">
                            <div v-if="moudleName === 'genericAsset'
                                && functionName=== 'transfer' && item.name==='amount'">
                                <tree-item :treeList="item.value" treeType="amount"
                                :assetId="treeList.find(ele => ele.name === 'asset_id').value"></tree-item>
                            </div>
                            <div v-else-if="moudleName === 'cennzx'
                               && functionName=== 'sellAsset' && item.name==='sell_amount'">
                              <tree-item :treeList="item.value" treeType="sell_amount"
                              :assetId="treeList.find(ele => ele.name === 'asset_to_sell').value"></tree-item>
                            </div>
                            <div v-else-if="moudleName === 'cennzx'
                               && functionName=== 'sellAsset' && item.name==='minimum_buy'">
                            <tree-item :treeList="item.value" treeType="sell_amount"
                             :assetId="treeList.find(ele => ele.name === 'asset_to_buy').value"></tree-item>
                            </div>
                            <div v-else-if="moudleName === 'cennzx'
                                && functionName=== 'buyAsset' && item.name==='buy_amount'">
                                <tree-item :treeList="item.value" treeType="buy_amount"
                                :assetId="treeList.find(ele => ele.name === 'asset_to_buy').value"></tree-item>
                            </div>
                            <div v-else-if="moudleName === 'cennzx'
                                && functionName=== 'buyAsset' && item.name==='maximum_sell'">
                            <tree-item :treeList="item.value" treeType="buy_amount"
                                       :assetId="treeList.find(ele => ele.name === 'asset_to_sell').value"></tree-item>
                            </div>
                            <div v-else-if="item.type === 'AccountId'">
                                <tree-item :treeList="item.value" treeType="accountId"></tree-item>
                            </div>
                            <div v-else>
                                <tree-item :treeList="item.value"></tree-item>
                            </div>
                        </div>
                        <div v-else-if="treeType === 'event'">
                            <div v-if="moudleName === 'genericAsset'
                            && functionName=== 'Transferred' && item.type==='Balance'">
                                <tree-item :treeList="item.value" treeType="amount"
                                :assetId="treeList.find(ele => ele.type === 'AssetId').value"></tree-item>
                            </div>
                            <div v-else-if="item.type === 'AccountId'">
                                <tree-item :treeList="item.value" treeType="accountId"></tree-item>
                            </div>
                            <div v-else>
                                <tree-item :treeList="item.value"></tree-item>
                            </div>
                        </div>
                    </td>
                    <td v-else class="struct-cell-wrapper">
                        <tree-item :treeList="item"></tree-item>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div v-else class="struct-table">
        <div :class="`struct-table-content ${isFirst?'':'is-inner'}`">
            <table class ="table">
                <tr>
                    <td class="td-border">
                        <div v-if="treeType === 'amount' || treeType === 'sell_amount' || treeType === 'buy_amount' || treeType === 'maximum_sell' || treeType === 'minimum_buy'" class ="table-cell">
                            <balances
                                :amount="treeList"
                                :currencyId="assetId" :hasImg="false"
                            ></balances>
                        </div>
                        <div v-else-if="treeType === 'accountId'" class ="table-cell">
                            <accountHash :size="24" :hash="treeList" :adjustHeight="'1px'"></accountHash>
                        </div>
                        <div v-else class ="table-cell">{{treeList}}</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>>
<script>
import { mapState } from "vuex";
import AccountHash from "../AccountDetailNew/AccountHash";
import Balances from "./Balances";
export default {
    name: 'treeItem',
    components: {
        AccountHash,
        Balances
    },
    props:{
        treeList: {
            type: [Object, Array, Number, String, Boolean],
            default: ''
        },
        isFirst: {
            type: Boolean,
            default: false
        },
        treeType: {
            type: String,
            default: ''
        },
        moudleName: {
            type: String,
            default: ''
        },
        functionName: {
            type: String,
            default: ''
        },
        itemName: {
            type: String,
            default: ''
        },
        itemType: {
            type: String,
            default: ''
        },
        assetId: {
            type: Number,
            default: -1
        }
    },
    computed: {
        ...mapState({
            sourceSelected: state => state.global.sourceSelected,
            token: state => state.polka.tokenV2
        })
    },
    methods: {
        isObjOrArray(value){
            return value !== null && typeof value === 'object';
        },
        checkAttr(item){
            let num =0;
            for(let key in item){
                if(key === 'type' || key === 'value'){
                    num++;
                }else if (key !== 'name'){
                    return false;
                }
            }
            if(num === 2){
                return true;
            }

            return false;
        }
    }

}
</script>
<style lang="scss" scoped>
 .struct-table-content .table{
        background-color: #fff;
        color: #363636;
        width: 100%;
        table-layout: fixed;
        border-collapse: separate;
        border: 1px solid #e7eaf3;
        border-width: 1px 0 0 1px;
}
 .struct-table-content.is-inner {
    padding: 0;
    background-color: #fff;
    margin: 0
}
 .struct-table-content.is-inner .table {
    border-width: 0
}
 .struct-table-content .td-border {
    border: 1px solid #e7eaf3;
    border-width: 0 1px 1px 0
}

 .struct-table-content .table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    padding: 0 10px;
    line-height: 1.5;
    min-height: 21px
}

.struct-table-content .table tbody {
    background-color: transparent
}
.struct-table-content .struct-cell-wrapper {
    padding: 0!important;
    border: none!important
}

.struct-table-content .table td {
    padding: .5em 0;
}
#app .el-table tr:last-child td{
    border-bottom: 1px solid #e7eaf3;
}


</style>
