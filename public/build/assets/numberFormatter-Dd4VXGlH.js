const n=(t,r=0)=>{if(!t&&t!==0)return"0";const i=typeof t=="string"?parseFloat(t):t;return isNaN(i)?"0":i.toLocaleString("en-US",{minimumFractionDigits:r,maximumFractionDigits:r})};export{n as f};
