const ShopSetting = require("../models/shopSetting.js");

const settingsPage = async (req, res) => {
  let setting = await ShopSetting.findOne();
  if(!setting) setting = await ShopSetting.create({});

  res.render("Admins/Setting.ejs", {
    user: req.session.user,
    setting,
    page: "Settings"
  });
};

const updateShopStatus = async (req, res) => {
  const { isOpen, closedMessage } = req.body;

  let setting = await ShopSetting.findOne();
  if(!setting) setting = await ShopSetting.create({});

  setting.isOpen = isOpen === "on";
  setting.closedMessage = closedMessage;
  setting.updatedAt = new Date();

  await setting.save();

  res.redirect("/admin/settings");
};

module.exports = { settingsPage, updateShopStatus };
