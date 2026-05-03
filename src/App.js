import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfuYAD28etiTZG_lGQZ3PkjRIxQ4SumBk",
  authDomain: "scentlab-cef71.firebaseapp.com",
  projectId: "scentlab-cef71",
  storageBucket: "scentlab-cef71.firebasestorage.app",
  messagingSenderId: "50214857080",
  appId: "1:50214857080:web:9a941f1a422b598d1c408d",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const ADMIN_PASSWORD = "iagg260897";
const WA_NUMBER = "5218125206737";

const LOGO_B64 = "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAAv/aAAwDAQACAAMAAAAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsgAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgoIAEoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA4AQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEAMAAA4IAoQQAAEAAIMIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEEQUEIAkIAEMgAQcUEgIIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUOAEq6UAa60MmuAQgqCCCAAACCKyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACuAKgAAaSAAASGIAAqACCAAAWCqmiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQqAqAAAiiAAQCEaAAqACCAECWC6emAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASmOAAAqKAAACAWOAqACCA2gWCqomAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaqyaIAoCIAUCAASAqACKMgAWCq+mAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAgAAAgQAgAAQAQgAwQAAAAwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8QAAv/aAAwDAQACAAMAAAAQ888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888scIw88888888888888888888888888888888888888888888888888888888888kU88Mc8888888888888888888888888888888888888888888888888888888888g8I08w8888888888888888888888888888888888888888888888888884448088s0804884w848w08888888888888888888888888888888888888888888Yoo48888884A88sc8ocM8888888888888888888888888888888888888888888888888888888c8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888Cc8C+Icu2I8mS8scm26W888u2ra888888888888888888888888888888888888O28XU88+e888Ch088WUqW884eWpv288888888888888888888888888888888888sZ8l888/GMMcC8l08WUqW88++Wp+W888888888888888888888888888888888888u9R888m2888C8+/wDFlKlvNvPlqfJfPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOKrjnsMFG/OJAvPP8AxZSpLBzz5anZPzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzyxxzzwwxyzzyzwxzwwzzzzwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/xAAcEQEAAwADAQEAAAAAAAAAAAABABAgMUFQEaD/2gAIAQIBAT8A/Sz9www0wwwi+Mwpwwx3OMNMMPEIxh4vFd4c95aYYYRnyD4rCPOGGO6baYYYRrvxjXGO7aaYYYRo/On/AP/EABQRAQAAAAAAAAAAAAAAAAAAALD/2gAIAQMBAT8AVA//xABCEAABAgMDCAYIBAUEAwAAAAACAQMABAUREjEQEyAhMzRBURQiMmFxchVCUlRggZKxMFNzoSM1YpGiQ1XAwURFgP/aAAgBAQABPwL/AIR70Q0G851E78YK76tuUJfO7M9fsrqWDAwWwhVF+OWWTeNABNcZmXpzN8us5wh55x41I10EVU1pEo81OhmX063BYnJI5YuY8F+NxRSVETFYkpUZZnX2uKxPTKvvqvBMNIDUCQkxSGibnJVLUxTXE1LlLuqC/L42o7F91XF9WKk9mpUua6tApMwFCcJAt5wuOWivaza+cVZjOMX+I/G1KC7KCvPXFbLZD88siopNNXsLYrQFngP1buhTSuzjffDg3gIeaQSWEqd/xrT9zZ8sVvaNeXQlXQnpZWXO2iQ+yTLhAXDLJ7015skxt3fMvxrSTvSiJyitjqaLQlHCbmG1HnFbEbzS8ctNG9NtwZXQJeSQa3iJe/4nkAZUHycbvXUjpcj7mkPm2Z2tt3E5RLNZ54A5wZU+0ms0qWevkl3mG0XOMIcCUkUubvRU6qw9MSphYEsgrz0qO/cdVtfWipNZyVLmmvKlluuGXZZkr6CRKmFsTEwb7l88tFZ6xu/KKq/m2LnEtCVZZzRvvaxTUic4FJSbQhBrNmiWp35JSXz7lltgprJYz9PFbqS9o+1xiblxauGC2tnhkuS0o23nG75kltnKJhphyX6QylmuwhySzbaSYH0bOEpKkPEDYrep93v+Gabczc1f7N1LYcSnXFuEd7hkYzqHfbTWOuBmZR8rHWERS9ZImWcy8QcsjX8uf8yaYqoqipjElNDMs6+1xSJ6WVh9U4LhpACmSCmKw0LcnKpauCa4mpgph1TX5aCE4qZtLbLcIbAZFtXD2pJ1R5QuuKfs5v8ATyP/AMulvMuQAfmTREtJYmTaYY6M2tq22muQJ55uXzIateMSM06TyNOLeA9SosPBcecD2SVPhiQNlAfBxy7eSOiSXviQ+22B2A5fTnEm+jLvWTqqliwjdOA85n7eN2Jh7POkfPI26CSLoW9ZVyNBnHEG8iW8YcC4ajbbZx0WXjZNCBYz0vUGbhLdc4Q8w4yaiaaCIqrYkSrDUkOdfXr8EicnTmS5DwTRp5yrbZqTiC5wWDZkzK8U7asOIImSCVqcFiVmMw5bZai6lSM1TVW9n1RPZibmUduiCWAHZyC5JpLi2Exc1dbnBy8kgkqTVq2csjDkqbOZeSyxdRpAFJStpgecP1e6CVSVVXFfinpZkFxzrp3wtnDK3MZrZjr9qDMjW0ltX/7iYpE26lqpcTvg6bLAthT4IvhD7bbZ2A7fTnZZosUube9S6nMoKmyjO3nEt5JGapH5739o6LIHs5yxf6kh2lzQJeFEcHmGuMMoNm4tgCqr3Q1RphUvOkLad8FK0tvUU4S+VIzVJ/PdT5R6PZc2E2Bdxaofk5ljaNrZz4ZJVjpD4tXrLeMegF95/wAYnZM5Ry6utOC6MrLdIU0vWXRtgURSRFWzvjoMn/uA/THQZNf/AGA/THoBfef8YOmyzZKJzwoqf0x0GT/3Afph9sG3LoOX05xLUZX2Rcz9lvC7E/IdDufxL1vdZ+DI0tyaBTv3B4asYfoqssm5n7bqW9nJKsZ98G71lvGPQC+8/wCMDS2XCutzoKXKyJimzUvrUbR5p8FUiQEAR806y4d0VibJlpABbFP7aLDDj7iA2lqxLU+WkwvnYpJiS8Inqu46qgyt0OfFdBp95krWzVImJwJlrrtJnfbTjkkKacyt4tTfPnDrkpTWeqKW8E4rEzOvzJdctXs8NCXqEwzqtvB7JRMmy45eabuJxSKVvzXz+0UyevkTBrrRerE7KDNMqC48FhwCbMgJLFTQpXbf/SXK3tB8YTBIqe+veOWl7k1FfxZ/Ak5ZZh276qayXkkSEyjs0YN6mgCwYqG5P+RclL35nxhcFgiUXiVF13okX+kSoGuOCxWJEWlzzadVcU+CEhizMt2eykV4Vvsl3aAARmIimtViRkwlWrqdpe0sVidzjmYBeqOPeunTZLpT2vsJjDhtyzClgIpEzMHMOkZadK35r5/aFMgfUhXWhRIzYzTKF6ydpIrEjnBz4J1kx700KV23/wBJcre0HxhMEip76945aXuTUV/FnTESMkEU1rEySScv0UF65bVf+ooO3d8sVDcn/IuSl78z4wuCw5tD8yxQ7eil54q13oLlvwTR5nOy+bXtB9oqEr0mXIfWTWkKiiqouOWhy14yfX1dSROPZiWcc5JqhVt16dPl0YlgTiutYrr/AGGU8V/ApW/NfP7Q7tD8YkZspV5C9X1kgCFwEJNaKkVWR6O7fFOoX7ZaV23/ANJcre0HxhMEip76945aXuTUV/FnTlhSTY6Sadctmn/cERGSkq61ig7d3yxUNyf8i5KXvzPjC4LGbNx8hBLVUliUZGVlhFVwxWKrPpMFm2+wn7/BMrMFLvC4nzhl0HmxMV1LFYkP/IbTzJlpYXJJrv1xXTslgHmenJhfmWh5lkn6ggTJj0Zo7OJJHpIfc2Ppj0kPubH0x6SH3Nj6Y9JD7mx9Mekh9zY+mPSQ+5sfTBLaqrFK35r5/aHdofjko89cLMGupezD7IPtE2WCxMsHLuk2XDJSu2/+kuVvaD4wmCRU99e8ctL3JqK/izpSEsjpqbmpoNZQ7VkIt2aVE7NqWx6SH3Nj6YpU0jzppmGw6vqpZFQ3J/yLkpe/M+MLgsJV1acK7LNJr4aoF2UqgXCUhLlbE7S3pbrJ1g5/BVLn+juXCXqF+0aiTuWKpI9GdvD2CwySG5seWK/smfNp07fWPNkqO+v+b8Clb818/tDu0Pxy0ue6Q1dJeuOPfFTkuktWj2xwjCKV23/0lyt7QfGEwSKnvr3jlpe5NRX8WdFlk3nBAcVieeBsElGuyPaXmuWg7d3yxUNyf8i5KXvzPjC4LDm0PzLDbhNmJiutIl3RmJcD5priqyXR3b4J1C/b4Kos5fDMkuscPCJlgX2SbLjDgKBkK4osUZ2/JonsrZFabvydvslbpsHceAuSwK3kRecVlu7N2+0n4FK35r5/aHdofjll3zYdFweES74PtC4OCxWZG6ufBNS9qKV23/0lyt7QfGEwSKnvr3jlpe5NRX8WdFLJCVt/13E/smhQdu75YqG5P+RclL35nxhcFhzaH5lyUI7ZdweRRVGkck3O7X8FSDitzbK/1WZKuKDOn32LFHmszMXC7J/eHW0cbIFwVLIeaJl02yxRdOkTWdl7ir1gisy2dYvpiH4FK35r5/aHdofjoUue6O7dJeoX7QQi4CoutFSGZQpWamB9VWlurlb2g+MJgkVPfXvHLS9yaiv4s6EgwAisy72Aw71iYfN90jLjoUHbu+WKhuT/AJFyUvfmfGFwWHNofmXJQE/hvL3pE+SDKPL/AE/BVPaVybaTvt/tGCRPPZ6adNMLdWSl1FHhRpxeumHfFWkM8OdbTrp++nLTBy7qGMS8w1NNXh44pFSkCl3Lwp1F06VvzXz+0O7Q/HRo89fHMGvWTsxMImZc8q5W9oPjCYJFT317xy0vcmor+LOWUlimHUHhxXuifmRNUab2YYaNB27vliobk/5FyUvfmfGFwWHNofmXJTWMzKAi4rrWK3NpYjAr5vggWXSS0QVYbkJtxbEaWJOWYp4KbriXlxioVbOorbOoeK88qKqLakSdaVLAf1/1RMyErOpnGDS9D0jNMr1m18YulyWBZdJbEAl+UN01ztPEjQ98TLkmLWaYG3ma5JeZdlzvAUMVOVmgzbyXVXnhE1Ri7cut5OUGy6C9YCSLpclhuUmXOy0UDJS7HWmnU8gxMug65aDd0eCRSt+a+f2h3aH46IGTZoQrrSGZsZqSMuN3rJlb2g+MJgkVPfXvHLS9yaiuNmatXRVY6M/+UX9ozDqKiKC68IfJJKXzAbQu2ulQdu75YqG5P+RclL35nxhcFg5Z9XD/AIRdpeEU+lqio7MakTBFieq7baKDPWLnwSCIjJSJbVX4IanJloboOqiQs9Nri8UEZl2iVdITMFtElSAqs6H+pb4x6WmfZb+mCqk4vr2eEG4ZraRKui3Mvtdhwkj0vOWWKor4pHpaa5N/TDk/NualdWzK24bZIQLYsKtq6Tb7rV64apbjlwj0lPfnlDjhuEpGtqrlbnptsUEHlRI9JT355R6Snvzygp6aJRVXVtHCCMjJSJbVXSZfeZVVbNRg5+cMVEnlVFxyNuG2SEC2KnGPSU9+eUekp788ocmH3O24S/8AGJ//xAAqEAEAAQIFAwQDAQEBAQAAAAABABEhEDFBUWEgcaFggZHwMLHB8dHAgP/aAAgBAQABPyH/AMR4CtAvAdzT1OxLuhu4FK3ygG0/5DeK9sk9c1KK8SwQureVQq+OhASiayick52b9fq+txKqlAlfUVFZVlaR6m/olSIBJSGzMszVuethG2y95abo8QVAzmj6hmgBA15xaudKINEa/t62PWGxb7+JrlHrFB3Oj3wID2SE4+R618BPuc4ijUnLuv7A6uvnGv2UcmU2PWsOtNJ8vOjMOpPmA18a9sez2sJnJGcqp9TkMp0Gf6Mp4UMkurQV5Uy5hqqRpVpCpCtmsy74UrGPObqFbbL3lvmixsLqa0hvgMETJfQ2xRUZFENQ6ft0GKU0OqV1i0cqIiKOku6g8AjWZlXQ9QhV/wAwqrteCCFk45wo2TyiVUez0znxMkmjWzGF+DddoLa1OWXLrVZ4/DhSqBqMy8oKSpK1nx1B/VKEECCst2ZZmjY6C6pVU7xkb05G8Sldcb1fDhb+AVdCXjbve2BnUmnO8VbrQhFZfCPpghFOCz/PlLOhFXVKJ4ZfURopvEXKVWOMGnaaGBp1LNkQhjWya9NConmNGBat5Sap56DQKuRKV9Ryk269K5YNEK0ImqjVGU6W9yPly5Qxpda9l43TdQf3AD9dwLmUyakNTgYuo5y+8VXp6KHKKdVFff1QKNRlEAHLUdmX81OcCmsobJvXYtamr/8AcIKgFWGifL+IiNNL/wBMpvUsvSUtPaky0bG/9iFveo/5MvwlPzOQiEIpEo4ldqhWfKyzFKphWy74fyGdbvZlo2b/ACw36eSuRON995VvWK0aV6Vzbcta0lJTW+yf6/8A7BgFXv8A+ziffeZ1Uiv/ALP9f/2JA08pSUnu+f2Kg/hYqriiuimPU0WV84akvRWcT77xx2q/7Dn3dnoqra+OmtcTt0q+U+A3Zbklf00YFIKrVca4rxLdxSlmjnC/ovoSmRLI8kaK7Bk6PdevEvwBwjxgLPele5tOSztMqwnROtfi54E8Zj4U/a/APyQIe1iffPoJHjRpwGj7zZg90gugXtPojMd4loLE2wqOiskpgg8K3N1jtcfXE7lf8lORYwiR5tjY2/AKksaj7wy7GwzRV29Yvxc8CeMx8KftddcQlAhyyqjH2eegkeNPvN52qH7HTv6JME0IoL/RIZVA0TEgv9M32+U5REpqrd6gVAlNtr5Y95+GF5WAXNbcIspVjszUF25bdS/FzwJ4zHwp+11vbao8VxSVWfZ56CR40W1ooO8B8UV0qw4l/Pd6J0+cm5KoYJVr2F+8T3wV7xw+b26xf0MErkty9f8A3v8A/WMCrkYC8rhrm7tnaGLUfjmCTdWdzfpX4ueBPGY+FP2urViJvxKKytdKYfPVPVW+6CRZ2Jm6EaKmUwv9+ZVOzNO/opMxXy3nFQ+SLQ73sdsGPawXeX662HaYFK34QvK4CiJnAy1+xvDo2vz4iKRKJn0L8XPAnjMfCn7XSTdUjO4l/Z56CR40+83lCAlRlNAltzrD4A8vRSNbUj8yWdmB3dD7QtXf+pXSZX8dfDawR8gJ7x30i/hF5XF2brLc2iM2Ph2nZ9dnfoX4ueBPGY+FP2ugvPYimqqueP2eegkeNPvN8H+zMsHc0e3ooS7F2bYUT0QGsUs9tEzP2veGBkusy0h7RaPre34ReV6Nb3flvCjKM8jNUg8GPi54E8Zj4U/a6AX2MkDustjo+zz0Ejxp95vgvNkrN3oonaFdoURWxD2wdhaZS2Xrts0cdzZERonU/wDlmbkAoIKbEZXnbj8AvK9Onpu3JUFLn6sfFzwJ4zHwp+1iBbG+1Fh+3yd+n7PPQSPGn3m8Cscl/emc5n6IUEbcIe7u2JRoa7+Ev6Xu4gSImSQkNG3+xQe9snvEBT7Lk/wpUzIo91a7/EVPdTVNNsBlNuaMoxAomZCV7p3lHOckHy+KZjOaQG5b1WU4iKYAvK9NMYlRgFys2GmPi54E8Zj4UsztcjBSLtdKjOFWt12uOr7PPQSPGlKrvkQ+i8/qiYEQ4hFV9EcP3J/fcRqhy16q4Tw0hFLPGs/zcLoHt0lTN5a9P75IeQPlqwdhCeyi0VWq1wRqeSREXN6ihSdKNTEVCZmBI1zS4i0uQY1Sd6XbRgKrr1KyEopBfVQYI1ywx4vKo/8AmJ//xAArEAEAAgAFAwUAAwEBAAMAAAABABEQITFBUSBxoWBhgbHwMJHxwcCA0eH/2gAIAQEAAT8Q/wDEeHkK0CLnuf8A+qwiqQ4Rfg0wZFV3A0yud7536QeIaqH1ykpvwOWFWdpfTGbO+BwdCMUWBpEnti/Zb+fkfXrctMAG6w4EPn9XvtDqS2GhyT2Yz0wvV1+ttt2lXfjZCUxDQVNAarBkRt7c7ENaRQGj7mIMtIOLb6/L1tpBmiKYyDgyddB2i5tFxHQPxUsOm0nyRm9f6h9asYnl8QJKRsYiBoNzWhlFLKOw2TFiufgQAtH/AE9a2izbHfcdG0TmgbipIVaA+xiotmfwRr6SPYjqa/3D6nNdYfinykll5wUNRvYha9hG1IglYLTFnOyoqVBDMbO4hgJRSnUOUK+3FLcp8WJZsXLaqifis1BlmnRtDgxyiUuvm/w6IvjrasvfAVfBYbVKR7kZL08RjwobPO9yOTu9qcrBrC5ppsE4pLY25hcNeNwFjeEgLRPpkoWljWEO79BkrhQjS42HMJeRNSLeLkl3BZn8PlphA2SBBQ+P1e8xdTWwwOXCDOS7CaejanvmcPOoEtCuo3wp2aV7s0Brg77hq2psY+WCRGF0TswX0A7WmyI+Z50akVGwb7MemCFcff6GFnEtBM46Y9NGjTz1Nhn9XAA0wHeL76GA62hmAtlDR6T5XfA4YDNd/wDDECOydhydCf3oC1ZRr5vHdz8j7el03lfviP5fbCtieU1XmWTfY06YVnl+0S3yt7sFY4Lr7pgXLg2EglgbJwku1QWyd0t7C+VW+qDyBNElAcSxNpHDBmFmpaLc4XtxEx5ml/8AzhRAjQGasbHt9c7JqcyLlY1fbwt2pXoBUAVZd80p9b7un7RyiPCuLxxZYYR64hZesDSJSOK1voxSn2FqqJzhOpPpIrT3530mt90Bmiuysy+GDjF6zJsdLISUZk2dHTIpzu9t1IdccQsDvWA5yxIBMORcp7z4YcAqBHlX2VhYANWT4wKNLpleX+EOgWLaj+DnFkGFSQmLZMTFYpiOpZNTvBVw1VL0UREtl0i6y0DqEVVVt6F+6t+UmxH77H6I+aonKa5Cuq4niflk9yJMryU3A4Glcz3eyQAArXPKh5l7amKKNjC8pMs5ktODbb3PZPA+ybxru2yRACbVii7ZOvn4vM8ZP2OMfNTwP4J/anCCUTjLvQHGfy08/CYKhpEjLqtRxSVY6P6Ip8aNev8AEqFot+hrmINusCUI3f8A9RN6jI9aMAlf0odm3m00CJXX2raHX4H2RqRTbJCeABM3ezfr1nPxeZ4yfscY+angddih4tVYEJFK+LxH8tPPz9DlD3JUJ2H5vRP28/BDSDPDaRkiY3yz+31YZSXD+lCWkFM1Xd6iQtUAmWkJveNjD/A+B9k/H5j2KpIj3Ihowd893hv9Xn4vM8ZP2OMfNTwOuH5ROsWfdqrPF4j+Wnn4GXAFxaX9yFusVy2nb6J3VaVc/qQKR6e3sxsdyZgHdNxtNL4HrJyyMAANCLMGVk/8tP8ALz/Lz/LT/LRQ/wCeCPdmigvYngfZPx+cKvdzmye4+62E+H8B9B08/F5njJ+xxj5qeB1VWoX9KaS6T9qwn/LStcVIsR/LR2qGllAokVrIw0R9KDubQG7nPPt+ii7kpElB+UCSwG8+VhVTjj8E686OFyo/geB9k/H5wdhA2JskJZSHLZl+epTjvL1kIHJE6Ofi8zxk/Y4x81PA6bHwzsbrNwXnieLxH8tPPz9DlGZHg9o5aC29gg6gyjb0U277Td4BQi+JZTuC/dVLG57lUxf+362KZy020ewuVNyx/B4H2T8fnFN5ntm8pbPzRvuKWefcvofPxeZ4yfscY+angdEKALVoIbHZndo6CptXdcfF4j+Wnn5+hywQDpodsB23yf0VbHX+4WD/AL87pEgRDdtxA1vsgIlAW/c2evI1Xyki9R7v4PgfZPx+ehiZUOOzKjWA5gI6xeb2L8XmeMn7HGPmp4HRoHa38IRHjlNmwHR4vEfy08/P0OWA1aAJsLn6KL9T23mQ4wCq7BGytzIVCNJCAFJXQj51yfrNEgRpHUerMGP2t4ZfQC9VuMd0uXzdnr8D7J+Pz00W9Xt7RiSgjuXi/F5njJ+xxj5qeBj+NUctWZZvrNrV9Pi8R/LTz8/Q5REAWrK9VgTREtPREf5naQyEduqCY1FdCDMco0sR5bCikSO70TUJIb9tz40qVmzfM6szi0NLGgKVwRmiPjDBQ3xxhbk/heEjmCDFSb55CI+KuWaguyY4U/uhDtZzAP3SUWfLwbs8D7J+Pz0tOPFskScONji/F5njJ+xxj5qZXMvcz/WQpHQUtDioz6l6vi8R/LQqJzl2TIUt4Ru59lOi7aIO1IvVX0QOGlSqa+u1J77mb7dRYN3aC/bAnMvPgqGuwygRN26TQ+2jqHPZJLYPfTRaNy6x8pOqtuF/c90WUxN7RV5XqAAV+jEeukEeEgYBFLrXrnHYoaqMVVryFgzsu/I1y9XKlMJGAzTVI4LdK9YYntlQuotf+Yn/AP/Z";

const SIZES = [
  { label: "30 ml", price: 100 },
  { label: "60 ml", price: 150 },
  { label: "100 ml", price: 280 },
];

const ESSENCES_DAMA = [
  "La Bomba · Carolina Herrera",
  "J'adore · Dior",
  "Libre · YSL",
  "Cosmic · Kylie Jenner",
  "BFF · KKW",
  "Sugar Pink · Aquolina",
];

const ESSENCES_CABALLERO = [
  "Bad Boy · Carolina Herrera",
  "L'Immensite · Louis Vuitton",
  "Dylan Blue · Versace",
  "Aventus · Creed",
  "Polo 67 · Ralph Lauren",
  "Stronger With You · Armani",
];

const BANK_INFO = {
  clabe: "722969010020014265",
  banco: "Mercado Pago",
  beneficiario: "Iryán Garza",
  linkPago: "https://link.mercadopago.com.mx/scentlab",
};

const STATUS_META = {
  "Pendiente":      { color: "#92622a", bg: "#fff3e0" },
  "Confirmado":     { color: "#1a5fa8", bg: "#e3f0ff" },
  "En preparación": { color: "#6a3a9a", bg: "#f3e8ff" },
  "Enviado":        { color: "#1a7a6e", bg: "#e0f5f3" },
  "Entregado":      { color: "#2a7a2a", bg: "#e8f5e8" },
  "Cancelado":      { color: "#aa2a2a", bg: "#fde8e8" },
};

const STATUS_MSG = {
  "Pendiente":      "Recibimos tu pedido. Pronto confirmaremos el pago. ⏳",
  "Confirmado":     "¡Pago confirmado! Tu pedido está en cola. ✅",
  "En preparación": "Tu fragancia está siendo preparada con cuidado. 🧪",
  "Enviado":        "¡Tu pedido va en camino! La entrega tarda 7-15 días hábiles. 📦",
  "Entregado":      "¡Tu pedido fue entregado! Gracias por elegir SCENTLAB. 🌹",
  "Cancelado":      "Tu pedido fue cancelado. Escríbenos si tienes dudas.",
};

// Stock por esencia — { available: bool, gender: "dama"|"caballero" }
const initialEssenceStock = {
  "La Bomba · Carolina Herrera":    { available: true,  gender: "dama" },
  "J'adore · Dior":                 { available: true,  gender: "dama" },
  "Libre · YSL":                    { available: true,  gender: "dama" },
  "Cosmic · Kylie Jenner":          { available: true,  gender: "dama" },
  "BFF · KKW":                      { available: true,  gender: "dama" },
  "Sugar Pink · Aquolina":          { available: true,  gender: "dama" },
  "Bad Boy · Carolina Herrera":     { available: true,  gender: "caballero" },
  "L'Immensite · Louis Vuitton":    { available: true,  gender: "caballero" },
  "Dylan Blue · Versace":           { available: true,  gender: "caballero" },
  "Aventus · Creed":                { available: true,  gender: "caballero" },
  "Polo 67 · Ralph Lauren":         { available: true,  gender: "caballero" },
  "Stronger With You · Armani":     { available: true,  gender: "caballero" },
};

export default function App() {
  const [mode, setMode] = useState("client");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  // Client
  const [step, setStep] = useState("catalog");
  const [gender, setGender] = useState(null);
  const [selSize, setSelSize] = useState(null);
  const [selEssence, setSelEssence] = useState("");
  const [cart, setCart] = useState([]);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Admin
  const [orders, setOrders] = useState([]);
  const [essenceStock, setEssenceStock] = useState(initialEssenceStock);
  const [dbReady, setDbReady] = useState(false);

  // ── Load from Firebase on mount ──
  useEffect(() => {
    // Listen to orders in real time
    const unsubOrders = onSnapshot(collection(db, "orders"), snap => {
      const loaded = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
      loaded.sort((a, b) => b.id.localeCompare(a.id));
      setOrders(loaded);
    });
    // Load essence stock
    getDoc(doc(db, "config", "essenceStock")).then(snap => {
      if (snap.exists()) setEssenceStock(snap.data());
      setDbReady(true);
    });
    return () => unsubOrders();
  }, []);
  const [adminTab, setAdminTab] = useState("orders");
  const [newEssence, setNewEssence] = useState({ name: "", gender: "dama" });

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const currentPrice = selSize ? SIZES.find(s => s.label === selSize)?.price : null;
  // Lista filtrada por género seleccionado
  const essenceList = Object.keys(essenceStock).filter(e => essenceStock[e]?.gender === gender);
  const allEssences = Object.keys(essenceStock);

  const tryLogin = () => {
    if (pwInput === ADMIN_PASSWORD) { setAdminUnlocked(true); setPwError(false); }
    else { setPwError(true); setPwInput(""); }
  };

  const addToCart = () => {
    if (!gender || !selSize || !selEssence) return;
    const id = `${selEssence}|${selSize}`;
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, essence: selEssence, size: selSize, gender, price: currentPrice, qty: 1 }];
    });
    setStep("cart");
  };

  const removeItem = id => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeItem(id); setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)); };

  const placeOrder = () => {
    if (!custName.trim() || !custPhone.trim()) return;
    const order = {
      id: `SL-${Date.now().toString().slice(-6)}`,
      customer: custName, phone: custPhone,
      items: [...cart], total: cartTotal,
      date: new Date().toLocaleString("es-MX"),
      status: "Pendiente",
    };
    setOrders(prev => [order, ...prev]);
    addDoc(collection(db, "orders"), order).catch(console.error);
    setPlacedOrder(order);
    setCart([]);
    setStep("confirm");
  };

  const sendWA = (order) => {
    const items = order.items.map(i => `• ${i.essence} (${i.size}) ×${i.qty} = $${(i.price * i.qty).toLocaleString("es-MX")}`).join("\n");
    const msg = encodeURIComponent(`🌹 *SCENTLAB — Pedido #${order.id}*\n━━━━━━━━━━━━━━━━\n👤 ${order.customer}\n📱 ${order.phone}\n📅 ${order.date}\n\n🛍️ *Productos:*\n${items}\n\n💰 *Total: $${order.total.toLocaleString("es-MX")} MXN*\n━━━━━━━━━━━━━━━━\n💳 *Datos de pago:*\nCLABE: ${BANK_INFO.clabe}\nBanco: ${BANK_INFO.banco}\nBeneficiario: ${BANK_INFO.beneficiario}\n\n🔗 Pago con tarjeta: ${BANK_INFO.linkPago}\n━━━━━━━━━━━━━━━━\n📦 Entrega: 7 a 15 días hábiles.\n¡Gracias por elegir SCENTLAB! ✨`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const doTrack = () => {
    const found = orders.find(o => o.id.toLowerCase() === trackId.trim().toLowerCase());
    setTrackResult(found || null);
  };

  const copyClabe = () => {
    navigator.clipboard.writeText(BANK_INFO.clabe).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const toggleEssence = name => {
    setEssenceStock(prev => {
      const updated = { ...prev, [name]: { ...prev[name], available: !prev[name]?.available } };
      setDoc(doc(db, "config", "essenceStock"), updated).catch(console.error);
      return updated;
    });
  };
  const addNewEssence = () => {
    if (!newEssence.name.trim()) return;
    setEssenceStock(prev => {
      const updated = { ...prev, [newEssence.name]: { available: true, gender: newEssence.gender } };
      setDoc(doc(db, "config", "essenceStock"), updated).catch(console.error);
      return updated;
    });
    setNewEssence({ name: "", gender: "dama" });
  };
  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    // Update in Firebase
    const order = orders.find(o => o.id === id);
    if (order && order._docId) updateDoc(doc(db, "orders", order._docId), { status }).catch(console.error);
  };

  const C = {
    bg: "#f5f0e8",
    surface: "#ffffff",
    surface2: "#faf7f2",
    border: "#e0d8cc",
    gold: "#8B6914",
    goldLight: "#c4922a",
    text: "#1a1208",
    textMid: "#4a3c28",
    textLight: "#7a6a50",
    textFaint: "#a89878",
    btnBg: "#1a1208",
    btnText: "#f5f0e8",
    green: "#2a6a2a",
    greenBg: "#e8f5e8",
    red: "#aa2a2a",
    redBg: "#fde8e8",
  };

  const pill = (active) => ({
    padding: "11px 22px", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", cursor: "pointer", border: `2px solid ${active ? C.gold : C.border}`,
    background: active ? C.gold : C.surface, color: active ? "#fff" : C.textLight,
    borderRadius: 8, transition: "all .18s",
  });

  return (
    <div style={{ fontFamily: "'Didact Gothic', sans-serif", minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Didact+Gothic&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #c4b898; border-radius: 4px; }
        body { background: #f5f0e8; }
        .btn { cursor: pointer; border: none; transition: all .18s; font-family: 'Didact Gothic', sans-serif; }
        .btn:active { transform: scale(.97); }
        input, select { background: #fff; border: 1.5px solid #ddd4c0; border-radius: 8px; color: #1a1208; font-family: 'Didact Gothic', sans-serif; font-size: 15px; padding: 12px 14px; outline: none; width: 100%; transition: border-color .2s; font-weight: 500; }
        input:focus, select:focus { border-color: #8B6914; box-shadow: 0 0 0 3px rgba(139,105,20,0.10); }
        input::placeholder { color: #b0a080; }
        select option { background: #fff; color: #1a1208; }
        .lbl { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #7a6a50; display: block; margin-bottom: 7px; }
        .tab { background: none; border: none; font-family: 'Didact Gothic', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; padding: 12px 18px; color: #a89878; transition: color .2s; position: relative; }
        .tab.on { color: #8B6914; }
        .tab.on::after { content: ''; position: absolute; bottom: 0; left: 18px; right: 18px; height: 2.5px; background: #8B6914; border-radius: 2px; }
        .tab:hover:not(.on) { color: #4a3c28; }
        .card { background: #fff; border: 1.5px solid #e0d8cc; border-radius: 14px; }
        .ghost { background: transparent; border: 1.5px solid #d4c8b0; color: #7a6a50; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 9px 16px; border-radius: 8px; }
        .ghost:hover { border-color: #8B6914; color: #8B6914; }
        .danger { background: transparent; border: 1.5px solid #e0b0b0; color: #aa2a2a; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 9px 16px; border-radius: 8px; }
        .danger:hover { background: #fde8e8; }
        .primary { background: #1a1208; color: #f5f0e8; font-size: 12px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; padding: 15px 28px; border-radius: 10px; width: 100%; }
        .primary:hover { background: #2e2010; }
        .primary:disabled { background: #d4c8b0; color: #a89878; cursor: not-allowed; }
        .wa-btn { background: #1a7a2a; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 15px 24px; width: 100%; border-radius: 10px; }
        .wa-btn:hover { background: #146020; }
        .badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; }
        .toggle { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #fff; border: 1.5px solid #e0d8cc; border-radius: 10px; margin-bottom: 8px; }
        .toggle-switch { width: 46px; height: 26px; border-radius: 13px; border: none; cursor: pointer; transition: background .2s; position: relative; flex-shrink: 0; }
        .toggle-switch::after { content: ''; position: absolute; top: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: left .2s; }
        .toggle-on { background: #2a6a2a; }
        .toggle-on::after { left: 23px; }
        .toggle-off { background: #d0c0b0; }
        .toggle-off::after { left: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fu { animation: fadeUp .35s ease both; }
        .divider { border: none; border-top: 1.5px solid #e8e0d0; margin: 18px 0; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: "#1a1208", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 8px" }}>
            <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="SCENTLAB" style={{ height: 64, objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #2e2010" }}>
            {mode === "client" ? (
              <div style={{ display: "flex" }}>
                {[{ k: "catalog", l: "Catálogo" }, { k: "cart", l: `Carrito${cartCount > 0 ? ` (${cartCount})` : ""}` }, { k: "track", l: "Mi Pedido" }].map(({ k, l }) => (
                  <button key={k} className={`btn tab ${step === k ? "on" : ""}`} style={{ color: step === k ? "#d4a840" : "#a89060" }}
                    onClick={() => setStep(k)}>{l}</button>
                ))}
              </div>
            ) : adminUnlocked ? (
              <div style={{ display: "flex" }}>
                {[{ k: "orders", l: "Pedidos" }, { k: "stock", l: "Esencias" }].map(({ k, l }) => (
                  <button key={k} className={`btn tab ${adminTab === k ? "on" : ""}`} style={{ color: adminTab === k ? "#d4a840" : "#a89060" }}
                    onClick={() => setAdminTab(k)}>{l}</button>
                ))}
              </div>
            ) : <div />}
            <button className="btn ghost" style={{ fontSize: 10, color: "#a89060", borderColor: "#2e2010", marginRight: 0 }}
              onClick={() => { setMode(m => m === "client" ? "admin" : "client"); setAdminUnlocked(false); setPwInput(""); setPwError(false); }}>
              {mode === "client" ? "Admin ↗" : "← Tienda"}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "44px 20px 100px" }}>

        {/* ══ CLIENT ══ */}
        {mode === "client" && (
          <>
            {/* CATALOG */}
            {step === "catalog" && (
              <div className="fu">
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.textFaint, marginBottom: 32 }}>Seleccioná tu fragancia</p>

                {/* Gender */}
                <div style={{ marginBottom: 36 }}>
                  <span className="lbl">Colección</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["dama", "caballero"].map(g => (
                      <button key={g} className="btn" style={pill(gender === g)} onClick={() => { setGender(g); setSelEssence(""); }}>
                        {g === "dama" ? "♀ Dama" : "♂ Caballero"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                {gender && (
                  <div style={{ marginBottom: 36 }} className="fu">
                    <span className="lbl">Tamaño</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, maxWidth: 380 }}>
                      {SIZES.map(s => (
                        <button key={s.label} className="btn" style={pill(selSize === s.label)} onClick={() => setSelSize(s.label)}>
                          <div style={{ fontSize: 15, marginBottom: 2 }}>{s.label}</div>
                          <div style={{ fontSize: 17, fontFamily: "'Playfair Display', serif" }}>${s.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essence */}
                {gender && selSize && (
                  <div style={{ marginBottom: 36 }} className="fu">
                    <span className="lbl">Esencia</span>
                    <div style={{ maxWidth: 440 }}>
                      <select value={selEssence} onChange={e => setSelEssence(e.target.value)} style={{ fontSize: 16, fontStyle: selEssence ? "italic" : "normal" }}>
                        <option value="">— Elegí tu esencia —</option>
                        {essenceList.filter(e => essenceStock[e]?.available).map(e => <option key={e} value={e}>{e}</option>)}
                        {essenceList.filter(e => !essenceStock[e]?.available).map(e => <option key={e} value={e} disabled>🚫 {e} (agotado)</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {gender && selSize && selEssence && essenceStock[selEssence]?.available && (
                  <div className="fu card" style={{ maxWidth: 420, padding: "28px 28px 24px", marginBottom: 32 }}>
                    <div style={{ width: 28, height: 3, background: C.gold, borderRadius: 2, marginBottom: 20 }} />
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 8, textTransform: "uppercase" }}>{gender} · {selSize}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontStyle: "italic", color: C.text, marginBottom: 8 }}>{selEssence}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.gold, fontFamily: "'Playfair Display', serif", marginBottom: 22 }}>${currentPrice?.toLocaleString("es-MX")}</div>
                    <button className="btn primary" onClick={addToCart}>Agregar al carrito</button>
                  </div>
                )}

                {/* Catalogue grid */}
                <div style={{ marginTop: 52, paddingTop: 36, borderTop: `1.5px solid ${C.border}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.textFaint, marginBottom: 24, textTransform: "uppercase" }}>Disponibilidad</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                    {allEssences.map(e => (
                      <div key={e} className="card" style={{ padding: "18px 18px 16px", opacity: essenceStock[e] ? 1 : 0.5 }}>
                        <div style={{ width: 18, height: 2.5, background: essenceStock[e]?.available ? C.gold : "#c0b090", borderRadius: 2, marginBottom: 12 }} />
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.textFaint, marginBottom: 6, textTransform: "uppercase" }}>
                          {essenceStock[e]?.gender === "caballero" ? "Caballero" : "Dama"}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: C.textMid, lineHeight: 1.4 }}>{e}</div>
                        <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: essenceStock[e]?.available ? C.green : C.red, textTransform: "uppercase" }}>
                          {essenceStock[e]?.available ? "Disponible" : "Agotado"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CART */}
            {step === "cart" && (
              <div className="fu" style={{ maxWidth: 580, margin: "0 auto" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: C.textFaint, marginBottom: 32, textTransform: "uppercase" }}>Tu carrito</p>
                {cart.length === 0 ? (
                  <div className="card" style={{ padding: "60px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Carrito vacío</div>
                  </div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: `1.5px solid ${C.border}` }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 4, textTransform: "uppercase" }}>{item.gender} · {item.size}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, color: C.text, fontWeight: 500 }}>{item.essence}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {["-", item.qty, "+"].map((v, i) => i === 1
                            ? <span key={i} style={{ fontSize: 16, minWidth: 24, textAlign: "center", fontWeight: 700, color: C.textMid }}>{v}</span>
                            : <button key={i} className="btn" style={{ width: 32, height: 32, background: C.surface2, border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 18, color: C.textMid, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }} onClick={() => updateQty(item.id, item.qty + (i === 0 ? -1 : 1))}>{v}</button>
                          )}
                        </div>
                        <div style={{ minWidth: 72, textAlign: "right", fontSize: 18, fontWeight: 700, color: C.gold, fontFamily: "'Playfair Display', serif" }}>${(item.price * item.qty).toLocaleString("es-MX")}</div>
                        <button className="btn" style={{ background: "none", border: "none", color: C.textFaint, fontSize: 15, padding: 4 }} onClick={() => removeItem(item.id)}>✕</button>
                      </div>
                    ))}
                    <div style={{ paddingTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Total</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.text }}>${cartTotal.toLocaleString("es-MX")}</span>
                      </div>
                      <div><span className="lbl">Tu nombre</span><input placeholder="Nombre completo..." value={custName} onChange={e => setCustName(e.target.value)} /></div>
                      <div><span className="lbl">WhatsApp / Teléfono</span><input placeholder="10 dígitos..." value={custPhone} onChange={e => setCustPhone(e.target.value)} /></div>
                      {/* Payment preview */}
                      <div className="card" style={{ padding: "18px 20px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 14, textTransform: "uppercase" }}>Opciones de pago</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 12, color: C.textLight, marginBottom: 2 }}>{BANK_INFO.banco} · CLABE</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: 1 }}>{BANK_INFO.clabe}</div>
                          </div>
                          <button className="btn ghost" onClick={copyClabe} style={{ fontSize: 10 }}>{copied ? "✓ Copiado" : "Copiar"}</button>
                        </div>
                        <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>Beneficiario: {BANK_INFO.beneficiario}</div>
                        <a href={BANK_INFO.linkPago} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "10px", background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, color: "#1a5fa8", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Pagar con tarjeta →</a>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.textFaint, letterSpacing: 1, textAlign: "center", textTransform: "uppercase" }}>Entrega estimada: 7 a 15 días hábiles</div>
                      <button className="btn primary" disabled={!custName.trim() || !custPhone.trim()} onClick={placeOrder}>Confirmar pedido</button>
                      <button className="btn" style={{ background: "none", border: "none", color: C.textFaint, fontSize: 12, fontWeight: 700, letterSpacing: 2, padding: 10, textTransform: "uppercase", cursor: "pointer" }} onClick={() => setStep("catalog")}>← Seguir comprando</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CONFIRM */}
            {step === "confirm" && placedOrder && (
              <div className="fu" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
                <div style={{ width: 48, height: 3, background: C.gold, borderRadius: 2, margin: "0 auto 28px" }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontStyle: "italic", color: C.text, marginBottom: 6, fontWeight: 500 }}>¡Pedido recibido!</div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.textFaint, marginBottom: 32, textTransform: "uppercase" }}>#{placedOrder.id}</div>
                <div className="card" style={{ padding: "22px 24px", marginBottom: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 14, textTransform: "uppercase" }}>Resumen</div>
                  {placedOrder.items.map(i => (
                    <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: C.textMid }}>{i.essence} <span style={{ fontSize: 11, fontStyle: "normal", color: C.textFaint }}>({i.size})</span></span>
                      <span style={{ fontWeight: 700, color: C.gold }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, textTransform: "uppercase" }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>${placedOrder.total.toLocaleString("es-MX")}</span>
                  </div>
                </div>
                <div className="card" style={{ padding: "18px 20px", marginBottom: 20, textAlign: "left" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 12, textTransform: "uppercase" }}>Realiza tu pago</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, color: C.textLight, marginBottom: 2 }}>{BANK_INFO.banco} · CLABE</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{BANK_INFO.clabe}</div>
                    </div>
                    <button className="btn ghost" onClick={copyClabe} style={{ fontSize: 10 }}>{copied ? "✓" : "Copiar"}</button>
                  </div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>Beneficiario: {BANK_INFO.beneficiario}</div>
                  <a href={BANK_INFO.linkPago} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "10px", background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, color: "#1a5fa8", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Pagar con tarjeta →</a>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textFaint, letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>
                  Guarda tu número: <span style={{ color: C.gold }}>#{placedOrder.id}</span><br />
                  <span style={{ fontWeight: 400 }}>Entrega: 7 a 15 días hábiles</span>
                </div>
                <button className="btn wa-btn" onClick={() => sendWA(placedOrder)} style={{ marginBottom: 12 }}>💬 Enviar confirmación por WhatsApp</button>
                <button className="btn" style={{ background: "none", border: "none", color: C.textFaint, fontSize: 12, fontWeight: 700, letterSpacing: 2, padding: 10, textTransform: "uppercase", cursor: "pointer", width: "100%" }} onClick={() => { setStep("catalog"); setPlacedOrder(null); }}>Volver a la tienda</button>
              </div>
            )}

            {/* TRACK */}
            {step === "track" && (
              <div className="fu" style={{ maxWidth: 520, margin: "0 auto" }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: C.textFaint, marginBottom: 36, textTransform: "uppercase" }}>Seguimiento de pedido</p>
                <div style={{ marginBottom: 24 }}>
                  <span className="lbl">Número de pedido</span>
                  <input placeholder="SL-XXXXXX" value={trackId} onChange={e => setTrackId(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} style={{ fontSize: 20, letterSpacing: 3, textAlign: "center" }} />
                  <div style={{ fontSize: 11, color: C.textFaint, marginTop: 8, letterSpacing: 1, textAlign: "center" }}>Lo recibiste al confirmar tu pedido</div>
                </div>
                <button className="btn primary" onClick={doTrack} style={{ marginBottom: 32 }}>Buscar pedido</button>
                {trackId && trackResult === null && (
                  <div className="card" style={{ padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: C.red, textTransform: "uppercase" }}>Pedido no encontrado</div>
                  </div>
                )}
                {trackResult && (
                  <div className="fu card" style={{ padding: "26px 26px 22px" }}>
                    <div style={{ width: 24, height: 3, background: C.gold, borderRadius: 2, marginBottom: 18 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, marginBottom: 5, textTransform: "uppercase" }}>#{trackResult.id}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic", color: C.text, fontWeight: 500 }}>{trackResult.customer}</div>
                      </div>
                      <span className="badge" style={{ background: STATUS_META[trackResult.status]?.bg, color: STATUS_META[trackResult.status]?.color }}>{trackResult.status}</span>
                    </div>
                    <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 14, color: C.textMid, lineHeight: 1.7, fontWeight: 500 }}>
                      {STATUS_MSG[trackResult.status]}
                    </div>
                    <hr className="divider" />
                    {trackResult.items.map(i => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: C.textMid }}>{i.essence} <span style={{ fontSize: 11, fontStyle: "normal", color: C.textFaint }}>({i.size})</span></span>
                        <span style={{ fontWeight: 700, color: C.gold }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                      </div>
                    ))}
                    <hr className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>${trackResult.total.toLocaleString("es-MX")}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══ ADMIN ══ */}
        {mode === "admin" && (
          <>
            {!adminUnlocked ? (
              <div className="fu" style={{ maxWidth: 360, margin: "100px auto", textAlign: "center" }}>
                <div style={{ width: 32, height: 3, background: C.gold, borderRadius: 2, margin: "0 auto 28px" }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontStyle: "italic", color: C.text, marginBottom: 6 }}>Panel Admin</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.textFaint, marginBottom: 32, textTransform: "uppercase" }}>Acceso restringido</div>
                <input type="password" placeholder="Contraseña..." value={pwInput} onChange={e => setPwInput(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()} style={{ textAlign: "center", fontSize: 17, letterSpacing: 3, marginBottom: 16 }} />
                {pwError && <div style={{ fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Contraseña incorrecta</div>}
                <button className="btn primary" onClick={tryLogin}>Ingresar</button>
              </div>
            ) : (
              <>
                {/* ADMIN ORDERS */}
                {adminTab === "orders" && (
                  <div className="fu">
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: C.textFaint, marginBottom: 32, textTransform: "uppercase" }}>Pedidos · {orders.length} total</p>
                    {orders.length === 0 ? (
                      <div className="card" style={{ padding: "60px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Sin pedidos aún</div>
                      </div>
                    ) : orders.map(o => (
                      <div key={o.id} className="card" style={{ padding: "24px 26px", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
                          <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic", color: C.text, fontWeight: 500, marginBottom: 4 }}>{o.customer}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.textFaint, textTransform: "uppercase" }}>#{o.id} · {o.date}</div>
                            <div style={{ fontSize: 13, color: C.textLight, marginTop: 4 }}>📱 {o.phone}</div>
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <span className="badge" style={{ background: STATUS_META[o.status]?.bg, color: STATUS_META[o.status]?.color }}>{o.status}</span>
                            <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ fontSize: 12, padding: "8px 12px", width: "auto" }}>
                              {Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <hr className="divider" style={{ margin: "10px 0" }} />
                        {o.items.map(i => (
                          <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: C.textMid }}>{i.essence} <span style={{ fontSize: 11, fontStyle: "normal", color: C.textFaint }}>({i.size} · {i.gender})</span> ×{i.qty}</span>
                            <span style={{ fontWeight: 700, color: C.textMid }}>${(i.price * i.qty).toLocaleString("es-MX")}</span>
                          </div>
                        ))}
                        <hr className="divider" style={{ margin: "10px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Total</span>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.gold }}>${o.total.toLocaleString("es-MX")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADMIN STOCK — solo esencias, sin tamaño */}
                {adminTab === "stock" && (
                  <div className="fu">
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: C.textFaint, marginBottom: 8, textTransform: "uppercase" }}>Disponibilidad de esencias</p>
                    <p style={{ fontSize: 13, color: C.textLight, marginBottom: 32, lineHeight: 1.6 }}>Activá o desactivá cada esencia. Los perfumes se fabrican al momento, sin stock por tamaño.</p>

                    {/* Add new */}
                    <div className="card" style={{ padding: "20px 22px", marginBottom: 28 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.textFaint, display: "block", marginBottom: 16, textTransform: "uppercase" }}>Agregar esencia</span>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end" }}>
                        <div><span className="lbl">Nombre</span><input placeholder="ej: Chance · Chanel" value={newEssence.name} onChange={e => setNewEssence({ ...newEssence, name: e.target.value })} /></div>
                        <div><span className="lbl">Colección</span>
                          <select value={newEssence.gender} onChange={e => setNewEssence({ ...newEssence, gender: e.target.value })}>
                            <option value="dama">Dama</option>
                            <option value="caballero">Caballero</option>
                          </select>
                        </div>
                        <button className="btn primary" style={{ padding: "12px 18px", width: "auto", fontSize: 11 }} onClick={addNewEssence}>+ Agregar</button>
                      </div>
                    </div>

                    {/* Dama */}
                    <div style={{ marginBottom: 28 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.textFaint, marginBottom: 14, textTransform: "uppercase" }}>♀ Dama</div>
                      {Object.keys(essenceStock).filter(e => !ESSENCES_CABALLERO.includes(e)).map(e => (
                        <div key={e} className="toggle">
                          <div>
                            <div style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: C.text, fontWeight: 500 }}>{e}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: essenceStock[e]?.available ? C.green : C.red, letterSpacing: 1.5, marginTop: 3, textTransform: "uppercase" }}>{essenceStock[e]?.available ? "Disponible" : "Agotado"}</div>
                          </div>
                          <button className={`btn toggle-switch ${essenceStock[e]?.available ? "toggle-on" : "toggle-off"}`} onClick={() => toggleEssence(e)} />
                        </div>
                      ))}
                    </div>

                    {/* Caballero */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.textFaint, marginBottom: 14, textTransform: "uppercase" }}>♂ Caballero</div>
                      {ESSENCES_CABALLERO.filter(e => essenceStock.hasOwnProperty(e)).map(e => (
                        <div key={e} className="toggle">
                          <div>
                            <div style={{ fontSize: 15, fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: C.text, fontWeight: 500 }}>{e}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: essenceStock[e] ? C.green : C.red, letterSpacing: 1.5, marginTop: 3, textTransform: "uppercase" }}>{essenceStock[e] ? "Disponible" : "Agotado"}</div>
                          </div>
                          <button className={`btn toggle-switch ${essenceStock[e] ? "toggle-on" : "toggle-off"}`} onClick={() => toggleEssence(e)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer style={{ borderTop: `1.5px solid ${C.border}`, padding: "24px", textAlign: "center", background: C.surface }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 5, color: C.textFaint, textTransform: "uppercase" }}>SCENTLAB · EST. 2025</div>
      </footer>
    </div>
  );
}
