export const customizeConfig = {
  logo: "/images/Uncover.png",
  chains: [
    {
      name: "Azalea",
      buttonIcon: "/images/Azalea.png",
      bannerBackground: "/images/banner-background.png",
      mobileBannerBackground: "/images/banner-mobile-background.png",
      pieColor: {
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
    },
    {
      name: "Nikau",
      buttonIcon: "/images/Azalea.png",
      bannerBackground: "/images/banner-background-nikau.png",
      mobileBannerBackground: "/images/banner-mobile-background-nikau.png",
      pieColor: {
        mainColor: "#000000",
        colors: ["#000000", "#a6a6a6", "#d7d7d7"],
        bIcon: "/images/Lock.png",
        tIcon: "/images/Transferrable.png",
        oIcon: "/images/Others.png"
      },
      themeColor: {
        mainColor: "#05b210",
        mainColorLight: "#05b21080",
        mainColorWhite: "#05b2100d",
        mainButtonColor: "#05b210",
        linkColor: "#05b210",
        navbarBg: "#000"
      }
    }
  ],
  modules: {
    transfer: { chart: false },
    vote: false,
    staking: false
  }
};
