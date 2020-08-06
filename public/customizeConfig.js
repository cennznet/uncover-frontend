const customizeConfig ={
    logo: "/images/logo@2x.png",

    chains: [
        {
            name: "azalea",
            buttonIcon: "/images/icefrog-button.png",
            bannerIcon: "/images/icefrog-banner.png",
            baseURL : 'https://scan-azalea.onfinality.me/api',
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
            ],
            colorMap : {
                mainColor: "#000000",
                colors: ["#000000", "#a6a6a6", "#d7d7d7"],
                 bIcon: "/images/l-purple.png",
                 tIcon: "/images/t-purple.png",
                 oIcon: "/images/o.png"
            }
        }
    ],
    modules:{
        transfer: false,
        vote: false,
        staking: false,
    }
}
window.customizeConfig =customizeConfig;
