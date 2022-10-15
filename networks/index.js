const networkList = {
  ADWORDS: require("./adwords/index.js"),
  DC_STUDIO: require("./dc_studio/index.js"),
  DC_STUDIO_HULU: require("./dc_studio_hulu/index.js"),
  ESPN_ON_CHANNEL: require("./espn_on_channel/index.js"),
  ESPN_TESTING: require("./espn_testing/index.js"),
  ESPN_RAYCOM: require("./espn_raycom/index.js"),
  FLASHTALKING: require("./flashtalking/index.js"),
  MRAID: require("./mraid/index.js"),
  NETFLIX_MONET: require("./netflix_monet/index.js"),
  OATH_ADTECH: require("./oath_adtech/index.js"),
  SIZMEK: require("./sizmek/index.js"),
  STANDARD: require("./standard/index.js"),
  VELVET: require("./velvet/index.js"),
};

module.exports = networkList;
