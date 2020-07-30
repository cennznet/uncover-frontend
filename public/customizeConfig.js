const customizeConfig ={
    logo: "/images/logo@2x.png",

    chains: [
        {
            name: "edgeware",
            currencies : [
                {
                    id: 11,
                    name: "staking",
                    type: 1, 
                    icon: "/images/kton@2x.png"
                },
                {
                    id: 22,
                    name: "spending",
                    type: 2,
                    icon: "/images/ksm@2x.png"
                }
            ]
        },
        {
            name: "kusama",
            currencies : [
                {
                    id: 1,
                    name: "ring",
                    type: 3,
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