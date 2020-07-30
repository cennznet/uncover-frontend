class customizeConfig {
    constructor(customizeConfig) {
        this.config = customizeConfig;
      }
    get logo(){
        return this.config.logo;
    }
    get defaultChain(){
      return this.chains[0]?.name;
    }
    get chains(){
      return this.config.chains;
    }
    setSelected(sourceSelected){
      this.selected = this.chains.find(ele => ele.name === sourceSelected);
    }
    getCurrencyById(currencyId){
      return this.selected?.currencies?.find(ele => ele.id === Number(currencyId));
    }
    isStakingCurrencyById(currencyId){
      const currency = this.getCurrencyById(currencyId);
      return currency?.type === 1 || currency?.type === 3;
    }
    getCurrencyByType(currencyType){
      return this.selected?.currencies.find(ele => ele.type === currencyType);
    }
    hasModule(moduleName){
      return this.config.modules[moduleName] || false;
    }
}
export default new customizeConfig(window.customizeConfig);
