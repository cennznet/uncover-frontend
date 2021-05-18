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
    hasModule(moduleName){
      return this.config.modules[moduleName] || false;
    }
}
export default new customizeConfig(window.customizeConfig);
