// For HubSpot API calls
const hubspot = require("@hubspot/api-client");

// Entry function of this module, it fetches associated deals and calculates the statistics
exports.main = async (context = {}) => {
  const { hs_object_id } = context.propertiesToSend; //provide ID
  const deals = await getAssociatedDeals(hs_object_id);
  console.log({deals});
  return { deals };
};

// exports.main = async (context = {}) => {
//   try {
//     const { hs_object_id } = context.propertiesToSend;
//     const deals = await getAssociatedDeals(hs_object_id);
//     return deals;
//   } catch (error) {
//     console.error(error);
//     return { error: error.message };
//   }
// };

// Function to fetch associated deals with their properties
async function getAssociatedDeals(hs_object_id) {
  const hubSpotClient = new hubspot.Client({
    accessToken: process.env["PRIVATE_APP_ACCESS_TOKEN"],
  });

  const dealId = hs_object_id;
  const properties = ["properties"];
  const propertiesWithHistory = undefined;
  const associations = ["properties"];
  const archived = false;

  try {
    const apiResponse = await hubSpotClient.crm.deals.basicApi.getById(
      dealId,
      properties,
      propertiesWithHistory,
      associations,
      archived
    );

    console.log(JSON.stringify(apiResponse, null, 2));
    const objectIDs = apiResponse.associations.p7078181_properties?.results?.map(result => result.id);
    console.log("Check is this ID",objectIDs);
    let allResponses = [];
    for(objectID of objectIDs){
    const objectTypeNew = "properties";
    const objectIdNew = objectID;
    const propertiesNew = ["property_name","new_property_sold"];
    const propertiesWithHistoryNEw = undefined;
    const associationsNEw = undefined;
    const archivedNew = false;
    const idPropertyNew = undefined;

    try {
      const apiResponseProperty =
        await hubSpotClient.crm.objects.basicApi.getById(
          objectTypeNew,
          objectIdNew,
          propertiesNew,
          propertiesWithHistoryNEw,
          associationsNEw,
          archivedNew,
          idPropertyNew
        );
        // return(apiResponseProperty);
        allResponses.push(apiResponseProperty);
      // console.log(JSON.stringify(apiResponseProperty, null, 2));
    } catch (e) {
      e.message === "HTTP request failed"
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e);
    }
  }
    return allResponses;
    
    // return apiResponse;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}


  
