export const customizeConfig = {
  logo: "/images/Uncover.png",
  chains: [
    {
      name: "Azalea",
      link: "https://uncoverexplorer.com/",
      buttonIcon: "/images/Azalea.png",
      pieColor: {
        mainColor: "#000000",
        colors: ["#000000", "#a6a6a6", "#d7d7d7"],
        bIcon: "/images/Lock.png",
        tIcon: "/images/Transferrable.png",
        oIcon: "/images/Others.png"
      },
      themeColor: {
        mainColor: "#1130FFCC",
        mainColorLight: "#1130FF80",
        mainColorWhite: "#1130FF0d",
        mainButtonColor: "#1130FF",
        linkColor: "#1130FF",
        navbarBg: "#000"
      }
    },
    {
      name: "Nikau",
      link: "https://nikau.uncoverexplorer.com/",
      buttonIcon: "/images/Azalea.png",
      pieColor: {
        mainColor: "#000000",
        colors: ["#000000", "#a6a6a6", "#d7d7d7"],
        bIcon: "/images/Lock.png",
        tIcon: "/images/Transferrable.png",
        oIcon: "/images/Others.png"
      },
      themeColor: {
        mainColor: "#05b210CC",
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
