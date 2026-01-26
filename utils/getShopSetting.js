const ShopSetting = require("../models/shopSetting");

async function getShopSetting(){
  let setting = await ShopSetting.findOne();
  if(!setting){
    setting = await ShopSetting.create({});
  }
  return setting;
}

module.exports = getShopSetting;
