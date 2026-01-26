const getShopSetting = require("../utils/getShopSetting");

module.exports = async (req, res, next) => {
  const setting = await getShopSetting();

  if(!setting.isOpen){
    return res.render("Customers/shopClosed", {
      message: setting.closedMessage
    });
  }

  next();
};
