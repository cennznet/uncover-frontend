const customizeConfig ={
    logo: "/images/logo@2x.png",

    chains: [
        {
            name: "azalea",
            currencies : [
                {
                    id: 1,
                    name: "CENNZ",
                    type: 1,
                    icon: "/images/kton@2x.png"
                },
                {
                    id: 2,
                    name: "CPAY",
                    type: 2,
                    icon: "/images/ksm@2x.png"
                }
            ]
        }
    ],
    modules:{
        transfer: false,
        vote: false,
        staking: false,
    }
}
window.customizeConfig =customizeConfig;
