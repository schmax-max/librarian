const moment = require("moment-timezone");
const _ = require("lodash");

const { allocationLoop } = require("./allocationLoop");
const { getAllocations } = require("./getAllocations");
const postData = require("../config/postData");
const { Library, Allocation, Category } = require("../model");

module.exports = { commander };

async function commander(body) {
  try {
    const { content_url, content_type } = body.core;
    // console.log({content_url})
    const allocations = await getAllocations(body);
    const locations = await getLocations(allocations);
    const updated_at = moment()
      .tz("America/Chicago")
      .toISOString();
    const find = { content_url };
    const item = { body, allocations, locations, updated_at };
    const options = { new: true, upsert: true };
    const result = await Library[`${content_type}s`].findOneAndUpdate(
      find,
      item,
      options
    );
    postToEditorNoisefree(item);
    return result;
  } catch (e) {
    console.log({ e });
    return;
  }
}

async function getLocations({ primary }) {
  let allocation_name = "potluck";

  if (primary && primary.allocation) {
    const hasEnoughPoints = primary.totalPoints >= 3;
    const hasEnoughTags = primary.totalCounts >= 2;

    if (hasEnoughPoints && hasEnoughTags) {
      allocation_name = primary.allocation;
    }
  }

  const response = {
    allocation: allocation_name
  };

  if (allocation_name === "potluck") {
    response.category = "potluck";
    response.area = "potluck";
  } else {
    const allocation = await Allocation.findOne({ allocation_name });
    if (allocation) {
      response.category = allocation.parent_category;
      const category = await Category.findOne({
        category_name: allocation.parent_category
      });
      if (category) {
        response.area = category.parent_area;
      }
    }
  }

  return response;
}

async function postToEditorNoisefree({ locations, body }) {
  const { scores, core, search_words } = body;
  const config = {
    target: "editor",
    data: { locations, scores, core, search_words },
    mins: 1
  };
  return await postData(config);
}
