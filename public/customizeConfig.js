const customizeConfig ={
    logo: "/images/logo@2x.png",

    chains: [
        {
            name: "azalea",
            buttonIcon: "/images/icefrog-button.png",
            bannerBackground: "/images/icefrog-banner.png",
            mobileBannerBackground: "/images/icefrog-banner-mobile.png",
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
            pieColor : {
                mainColor: "#000000",
                colors: ["#000000", "#a6a6a6", "#d7d7d7"],
                 bIcon: "/images/l-purple.png",
                 tIcon: "/images/t-purple.png",
                 oIcon: "/images/o.png"
            }, 
            themeColor: {
                mainColor: "#e90979",
                mainColorLight: "#e9097980",
                mainColorWhite: "#e909790d",
                mainButtonColor: "#4572de",
                linkColor: "#4572de",
                navbarBg: "#000"
            }
        }
    ],
    modules:{
        transfer: {chart: false},
        vote: false,
        staking: false,
    }
}
window.customizeConfig =customizeConfig;
