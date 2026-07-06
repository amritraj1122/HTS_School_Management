const getSessions = require("./sessions/getSessions");

module.exports = {
  createSession: require("./sessions/createSession"),
  getSessions: require("./sessions/getSessions"),
  getSession: require("./sessions/getSession"),
  updateSession: require("./sessions/updateSession"),
  deleteSession: require("./sessions/deleteSession"),
};
