const customizeConfig ={
    logo: "/images/Uncover.png",
    chains: [
        {
            name: "azalea",
            buttonIcon: "/images/Azalea.png",
            bannerBackground: "/images/banner-background.png",
            mobileBannerBackground: "/images/banner-mobile-background.png",
            baseURL : 'https://service.eks.centralityapp.com/cennznet-explorer-api/api',
            // baseURL : 'https://service.eks.centrality.me/cennznet-explorer-api/api'// dev
            currencies : [
                {
                    id: 1,
                    name: "CENNZ",
                    type: 1,
                    icon: "/images/CENNZ.png"
                },
                {
                    id: 2,
                    name: "CPAY",
                    type: 2,
                    icon: "/images/CPAY.png"
                }
            ],
            pieColor : {
                mainColor: "#000000",
                colors: ["#000000", "#a6a6a6", "#d7d7d7"],
                 bIcon: "/images/Lock.png",
                 tIcon: "/images/Transferrable.png",
                 oIcon: "/images/Others.png"
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
if (window.location.hostname.endsWith('centrality.me')) {
    window.customizeConfig.chains[0].baseURL = 'https://service.eks.centrality.me/cennznet-explorer-api/api'
}
